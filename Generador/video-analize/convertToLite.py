import tensorflow as tf
from tensorflow.python.keras.activations import softmax
from domain.custom import cat_acc, cce, plate_acc, top_3_k

custom_objects = {
    'cce': cce,
    'cat_acc': cat_acc,
    'plate_acc': plate_acc,
    'top_3_k': top_3_k,
    'softmax': softmax
}

model = tf.keras.models.load_model('./models/m1_93_vpa_2.0M-i2.h5', custom_objects=custom_objects)
converter = tf.lite.TFLiteConverter.from_keras_model(model)


save = open('./models/m1.tflite', 'wb')
save.write(converter.convert())
