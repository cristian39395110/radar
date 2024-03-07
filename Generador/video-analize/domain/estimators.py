import numpy as np

NO_PLATE = 'XXXXXXX'


def best_plate(plates: dict, filter=np.mean):
    plate = NO_PLATE
    prob = 0
    if len(plates) == 0:
        return NO_PLATE, 0.0

    for key in plates:
        p = plates[key]
        if p > prob:
            plate = key
            prob = p

    return plate.replace('_', ''), int(prob * 1000) / 10.0
