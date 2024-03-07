# Asocia la Probabilidad  a la Patente

import os
import string
import cv2
import numpy as np
import tensorflow as tf
from tensorflow.python.keras.activations import softmax

# import statistics as stat
# Custom metris / losses
from .custom import cat_acc, cce, plate_acc, top_3_k

os.environ['TF_FORCE_GPU_ALLOW_GROWTH'] = 'true'
alphabet = string.digits + string.ascii_uppercase + '_'


def check_low_conf(probs, thresh=.3):
    '''
    Add position of chars. that are < thresh
    '''
    return [i for i, prob in enumerate(probs) if prob < thresh]


@tf.function
def predict_from_array(img, model):
    pred = model(img, training=False)
    return pred


def probs_to_plate(prediction):
    prediction = prediction.reshape((7, 37))
    probs = np.max(prediction, axis=-1)
    prediction = np.argmax(prediction, axis=-1)
    plate = list(map(lambda x: alphabet[x], prediction))
    return plate, np.mean(probs)


class DomainDetector:
    def __init__(self, model="./models/m3_91_vpc_1.3M_CPU.h5"):
        custom_objects = {
            'cce': cce,
            'cat_acc': cat_acc,
            'plate_acc': plate_acc,
            'top_3_k': top_3_k,
            'softmax': softmax
        }
        self.model = tf.keras.models.load_model(
            model, custom_objects=custom_objects)

    def video_predictions(self, imgs_dir, available_pics):
        img_paths = [os.path.join(imgs_dir, f) for f in available_pics
                     if os.path.isfile(os.path.join(imgs_dir, f))]
        plates = {}

        for path in img_paths:
            img = self.read_image(path)
            prediction = predict_from_array(img, self.model).numpy()
            plate, p = probs_to_plate(prediction)
            plate = ''.join(plate)
            if plate in plates:
                plates[plate].append(p)
            else:
                plates[plate] = [p]

        for plate in plates:
            plates[plate] = np.mean(plates[plate])
        return plates

    def read_image(self, path):
        im = cv2.imread(path, cv2.IMREAD_GRAYSCALE)
        # resize dsize (w, h) -> (140, 70)
        img = cv2.resize(im, dsize=(140, 70), interpolation=cv2.INTER_LINEAR)
        img = img[np.newaxis, ..., np.newaxis] / 255.
        img = tf.constant(img, dtype=tf.float32)
        return img
