import cv2
import os
import numpy as np
import time
import shutil

from server import load_domain, load_videos

from domain.detection import DomainDetector
from domain.estimators import best_plate, NO_PLATE

from utils import convert_video

LEFT_CROP_MARGIN = 5
VIDEO_FOLDER = '/videos'
IMAGE_FOLDER = '/images'
DARKNET_COMMAND = './darknet/darknet detector test ./darknet/obj.data ./darknet/yolov4.cfg ./darknet/yolov4.weights -save_labels'


def no_plate_condition(x0, y0, x1, y1, height, width):
    pixels = [x0, y0, x1, y1]
    left = any(x <= LEFT_CROP_MARGIN for x in pixels)
    rigth = x0 >= width or y0 >= height or x1 >= width or y1 >= height
    return left or rigth


def get_coordinates(image_name, height, width):
    file = open(f'{image_name}.txt')

    plates = list(map(lambda x: x.split('\n')[0], file.readlines()))
    plates_coordinates = []
    for plate in plates:
        coordinates = parse_coordinates(plate, height, width)
        plates_coordinates.append(coordinates)
    return plates_coordinates


def parse_coordinates(plate, height, width):
    result = plate.split(' ')[1:]
    coords = list(map(lambda x: float(x), result))
    if len(coords) == 0:
        return 0, 0, 0, 0
    width_domain = coords[2]
    height_domain = coords[3]
    x0 = (coords[0] - width_domain / 2) * width
    x1 = (coords[0] + width_domain / 2) * width
    y0 = (coords[1] - height_domain / 2) * height
    y1 = (coords[1] + height_domain / 2) * height
    if no_plate_condition(x0, y0, x1, y1, height, width):
        return 0, 0, 0, 0
    return int(x0), int(x1), int(y0), int(y1)


def distance_to_center(x0, y0, x1, y1, height, width):
    x_mean = np.mean([x0, x1])
    y_mean = np.mean([y0, y1])
    pic_x_mean = width / 2
    pic_y_mean = height / 2
    dx = x_mean - pic_x_mean
    dy = y_mean - pic_y_mean
    return (dx ** 2 + dy ** 2) ** .5


def get_domains(image, read_dir='./images', save_dir='./plates'):
    os.system(f'{DARKNET_COMMAND} {read_dir}/{image} >> temp.txt')
    name = image.split('.')[0]
    img = cv2.imread(f'{read_dir}/{image}')
    height, width, _ = img.shape
    plates_coordinates = get_coordinates(f'{read_dir}/{name}', height, width)
    plates = list(map(lambda coordinates, i: get_domain(
        coordinates, img, save_dir,
        f'{name}-{i}'), plates_coordinates, range(len(plates_coordinates))))
    return plates


def get_domain(coordinate, img, save_dir, name):
    x0, x1, y0, y1 = coordinate
    height, width, _ = img.shape
    if x0 == x1 and y0 == y1:
        return {'distance': np.inf}
    crop_img = img[y0: y1, x0: x1]
    if len(crop_img) == 0:
        return {'distance': np.inf}
    pic_name = f'{name}.jpg'
    cv2.imwrite(f'{save_dir}/{pic_name}', crop_img)
    distance = distance_to_center(x0, y0, x1, y1, height, width)
    return {'pic': pic_name, 'distance': distance, 'coordinates': [x0, x1, y0, y1]}


def create_folders(folder):
    if not os.path.isdir(folder):
        os.makedirs(folder)


def save_plates(plates):
    plates_file = open('./plates.json', 'w')
    plates_file.write(f'{plates}')


def save_no_plate(save_folder, images_dir):
    best_images_folder = os.path.join(save_folder, 'images')
    create_folders(best_images_folder)
    def get_full_path(x): return os.path.join(images_dir, x)
    images = list(filter(lambda x: x.endswith(
        '.jpg'), os.listdir(images_dir)))
    for image in images:
        shutil.move(get_full_path(image), best_images_folder)


def predict_plate(video, domain_detector, video_id, save_car_images=True):
    save_folder = f'{IMAGE_FOLDER}/{video_id}'
    more_than_one_car = False
    create_folders(save_folder)

    images_dir = f'./results/images'
    plates_dir = f'./results/plates'
    create_folders(images_dir)
    create_folders(plates_dir)

    convert_video(video, images_dir)

    images = os.listdir(images_dir)
    images = list(filter(lambda x: x.split('.')[-1] != 'txt', images))
    best_pic = {'pic': '', 'distance': np.inf}
    pics = []
    for image in images:
        new_pics = get_domains(image, images_dir, plates_dir)
        more_than_one_car = len(new_pics) > 1
        for pic in new_pics:
            if pic['distance'] < np.inf:
                pics.append(pic)
            if pic['distance'] < best_pic['distance']:
                best_pic = pic
    available_pics = delete_static_pics(pics)
    plates = domain_detector.video_predictions(plates_dir, available_pics)
    plate, prob = best_plate(plates)

    if plate == NO_PLATE and save_car_images:
        save_no_plate(save_folder, images_dir)

    elif save_car_images:
        best_images_folder = os.path.join(save_folder, 'images')
        best_plates_folder = os.path.join(save_folder, 'plates')
        create_folders(best_plates_folder)
        create_folders(best_images_folder)
        save_best_images(plates_dir, images_dir,
                         best_images_folder, best_plates_folder)
    load_domain(plate, prob, best_pic['pic'], video_id, more_than_one_car)
    file = open(f'{save_folder}/results.txt', 'w')
    file.write(plate)
    file.close()
    shutil.rmtree('./results')
    return plate


def delete_static_pics(pics):
    coords_count = {}
    for pic in pics:
        coords = str(pic["coordinates"])
        if coords in coords_count:
            coords_count[coords].append(pic["pic"])
        else:
            coords_count[coords] = [pic["pic"]]
    filter_pics = []
    for key in coords_count:
        if len(coords_count[key]) == 1:
            filter_pics.append(*coords_count[key])
    return filter_pics


def save_best_images(plates_path, images_path, result_folder, plates_results):
    def get_full_path(x): return os.path.join(images_path, x)
    def get_plate_full_path(x): return os.path.join(plates_path, x)
    images_name = os.listdir(plates_path)

    for image in images_name:
        car_image = image.split('-')[0] + '.jpg'
        path = get_full_path(car_image)
        plate_path = get_plate_full_path(image)
        try:
            shutil.move(path, result_folder)
            shutil.move(plate_path, plates_results)
        except:
            pass


def main():
    if os.path.exists('./results'):
        shutil.rmtree('./results')
    domain_detector = DomainDetector()
    new_videos = load_videos()
    files = list(map(lambda x: x + '.h264', new_videos))

    videos = []
    for file in files:
        full_path = os.path.join(VIDEO_FOLDER, file)
        if os.path.isdir(full_path):
            videos += [
                os.path.join(file, i) for i in os.listdir(full_path)
            ]
        if file.endswith('h264'):
            videos.append(file)

    videos = list(filter(lambda x: x.endswith('h264'), videos))
    if len(videos) == 0:
        return
    for video in videos:
        video_id = video.split('.')[0]
        predict_plate(f'{VIDEO_FOLDER}/{video}',
                      domain_detector, video_id, True)


if __name__ == '__main__':
    while True:
        main()
        time.sleep(1)
