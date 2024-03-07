import os
import string

import cv2
import numpy as np
import tensorflow as tf


os.environ['TF_FORCE_GPU_ALLOW_GROWTH'] = 'true'
alphabet = string.digits + string.ascii_uppercase + '_'


def check_low_conf(probs, thresh=.3):
    '''
    Add position of chars. that are < thresh
    '''
    return [i for i, prob in enumerate(probs) if prob < thresh]


def probs_to_plate(prediction):
    prediction = prediction.reshape((7, 37))
    probs = np.max(prediction, axis=-1)
    prediction = np.argmax(prediction, axis=-1)
    plate = list(map(lambda x: alphabet[x], prediction))
    return plate, probs


class LiteDomainDetector:
    def __init__(self, model="./models/m1.tflite"):
        interpreter = tf.lite.Interpreter(model_path=model)
        interpreter.allocate_tensors()
        self.model = interpreter

    def _get_prediction(self, img):
        output = self.model.get_output_details()[0]
        input = self.model.get_input_details()[0]
        self.model.set_tensor(input['index'], img)
        self.model.invoke()
        prediction = self.model.get_tensor(output['index'])
        return prediction

    def video_predictions(self, imgs_dir):
        img_paths = [os.path.join(imgs_dir, f) for f in os.listdir(imgs_dir)
                     if os.path.isfile(os.path.join(imgs_dir, f))]

        plates = {
            0: {},
            1: {},
            2: {},
            3: {},
            4: {},
            5: {},
            6: {},
        }

        for path in img_paths:
            img = self.read_image(path)
            prediction = self._get_prediction(img)
            plate, probs = probs_to_plate(prediction)
            plate = ''.join(plate)
            for i, letter, prob in zip(range(len(plate)), plate, probs):
                if letter in plates[i]:
                    plates[i][letter].append(prob)
                else:
                    plates[i][letter] = [prob]
        return plates

    def read_image(self, path):
        im = cv2.imread(path, cv2.IMREAD_GRAYSCALE)
        # resize dsize (w, h) -> (140, 70)
        img = cv2.resize(im, dsize=(140, 70), interpolation=cv2.INTER_LINEAR)
        img = img[np.newaxis, ..., np.newaxis] / 255.
        img = tf.constant(img, dtype=tf.float32)
        return img
