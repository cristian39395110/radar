import requests

SERVER_URL = 'http://api:8000/measures'


import traceback  # Importamos esta librería para imprimir el traceback del error

SERVER_URL = 'http://api:8000/measures'

def load_videos():
    print("Estamos aquí")
    try:
        response = requests.get(f'{SERVER_URL}/videos',
                                headers={'x-api-key': 'app doppler-solutions-test'})
        print(response.json())
        return response.json()
    except Exception as e:
        print("Ocurrió un error:", e)
       # print("Traceback:", traceback.format_exc())  # Imprimimos el traceback del error
        return []

videos = load_videos()

def load_domain(domain, prob, pic_name, id, more_than_one_car):
    response = requests.put(f'{SERVER_URL}/{id}/plate', json={
        'plate': domain,
        'security': int(prob),
        'pic': pic_name,
        'moreThanOneCar': more_than_one_car
    }, headers={'x-api-key': 'app doppler-solutions-test'})
    print(f'video {id} status code:', response.json())
    # print(response.json())

    return


