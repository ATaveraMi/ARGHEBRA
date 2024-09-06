from flask import Flask, request, jsonify
import json
import sqlite3
import random

app = Flask(__name__, static_url_path='')
port = 8001

@app.route('/tc2005b', methods=['POST'])
def doTC2005B():
    data = request.form['user'] #Esto ya es formato JSON
    #print(data) JSON
    user = json.loads(data) #JSON a DICCIONARIO
    print(user['id'], user['group'])
    #ToDO: Consultar en BD que el usuario existe.
    #Armar un usuario con los datos que tenemos: 
    response = {"id": user['id'], "group": user['group']}
    return jsonify(response) #Te crea un JSON a partir de ese diccionario

    #Sesion
#     data2 = request.form['user']
#     user = json.loads(data2)
#     levels = {
#         "id": 1,
#         "levels": [
#         {
#             "name": "level1",
#             "played": False,
#             "score": 0,
#             "finished": False
#         },
#         {
#             "name": "level2",
#             "played": False,
#             "score": 0,
#             "finished": False
#         },
#         {
#             "name": "level3",
#             "played": False,
#             "score": 0,
#             "finished": False
#         }
#     ]
# }

#     # Devolver el objeto como JSON
#     return jsonify(levels)


#Para mandar nuestras preguntas y respuestas de nuestra base de datos a unity y mostrarlas en el canvas
@app.route('/preguntas', methods=['GET'])
def preguntas():
    # Establecemos la conexión con la base de datos
    conexion = sqlite3.connect("Nivel2.sqlite3")
    cursor = conexion.cursor()

    try:
        # Obtenemos una pregunta aleatoria
        cursor.execute("SELECT * FROM preguntas ORDER BY RANDOM() LIMIT 1")
        pregunta = cursor.fetchone()
        print(pregunta)

        # Obtenemos la respuesta correcta que es el mismo id de la pregunta
        cursor.execute("SELECT * FROM respuestas WHERE id_pregunta = ?", (pregunta[0],))
        respuesta = cursor.fetchall()
        print(respuesta)

        # Obtenemos dos respuestas aleatorias que serán las opciones
        cursor.execute("SELECT * FROM respuestas WHERE id_pregunta != ? ORDER BY RANDOM() LIMIT 2", (pregunta[0],))
        opciones = cursor.fetchall()
        print(opciones)

        # Construimos la respuesta JSON
        if respuesta and opciones: #Primero verificamos para evitar errores del rango de la lista
            response = {
                "pregunta": pregunta[1],
                "respuestas": [respuesta[0][1], opciones[0][1], opciones[1][1]]
            }
        else:
            response = {"error": "No se encontraron respuestas para esta pregunta"}

        # Retornamos la pregunta y las respuestas
        print(response)
        return jsonify(response)

    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        conexion.close()


#Con esta función vamos a recibir el time y score del nivel 2 para ingresarlo a la base de datos
@app.route('/timeScore', methods=['POST'])
def timeScore():
    data = request.form['TimeScore'] 
    timeScore = json.loads(data) 
    print(f"Este es el timeScore: {timeScore}")
    response = {"Score": timeScore['score'], "Time": timeScore['time']}
    print(f"Este es el response: {response}")
    return jsonify(response) #Te crea un JSON a partir de ese diccionario
    

if __name__ == '__main__':
    app.run(host = '127.0.0.1', port = port, debug = True)