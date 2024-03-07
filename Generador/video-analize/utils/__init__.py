import cv2

def convert_video(video, save_dir):
    video = cv2.VideoCapture(video)
    i = 0
    while video.isOpened():
        ret, frame = video.read()
        if ret:
            cv2.imwrite(f'{save_dir}/{i}.jpg', frame)
            i += 1
        else:
            break
    return

