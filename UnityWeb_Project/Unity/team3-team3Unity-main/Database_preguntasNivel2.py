import sqlite3

conexion = sqlite3.connect("Nivel2.sqlite3")
cursor = conexion.cursor()

# #TABLA DE LAS PREGUNTAS
# cursor.execute("CREATE TABLE preguntas(id_pregunta INTEGER PRIMARY KEY, pregunta VARCHAR(50))")
# #Insertamos las preguntas
# #---PREGUNTA 1---
# cursor.execute("INSERT INTO preguntas(pregunta) VALUES('34 + 11 + 3')")
# #---PREGUNTA 2---
# cursor.execute("INSERT INTO preguntas(pregunta) VALUES('7 x 5 + 4')")
# #---PREGUNTA 3---
# cursor.execute("INSERT INTO preguntas(pregunta) VALUES('9 + 72 - 8')")
# #---PREGUNTA 4---
# cursor.execute("INSERT INTO preguntas(pregunta) VALUES('11 - 6 + 20')")
# #---PREGUNTA 5---
# cursor.execute("INSERT INTO preguntas(pregunta) VALUES('64 / 8')")
# #---PREGUNTA 6---
# cursor.execute("INSERT INTO preguntas(pregunta) VALUES('24 / 2')")
# #---PREGUNTA 7---
# cursor.execute("INSERT INTO preguntas(pregunta) VALUES('49 / 7')")
# #---PREGUNTA 8---
# cursor.execute("INSERT INTO preguntas(pregunta) VALUES('37 - 11')")
# #---PREGUNTA 9---
# cursor.execute("INSERT INTO preguntas(pregunta) VALUES('45 - 16')")
# #---PREGUNTA 10---
# cursor.execute("INSERT INTO preguntas(pregunta) VALUES('17 - 13 + 2')")
# #---PREGUNTA 11---
# cursor.execute("INSERT INTO preguntas(pregunta) VALUES('23 x 2')")
# #---PREGUNTA 12---
# cursor.execute("INSERT INTO preguntas(pregunta) VALUES('15 + 7')")
# #---PREGUNTA 13---
# cursor.execute("INSERT INTO preguntas(pregunta) VALUES('87 - 38')")
# #---PREGUNTA 14---
# cursor.execute("INSERT INTO preguntas(pregunta) VALUES('11 x 3')")
# #---PREGUNTA 15---
# cursor.execute("INSERT INTO preguntas(pregunta) VALUES('200 - 151')")
# #---PREGUNTA 16---
# cursor.execute("INSERT INTO preguntas(pregunta) VALUES('90 / 10')")
# #---PREGUNTA 17---
# cursor.execute("INSERT INTO preguntas(pregunta) VALUES('100 + 200')")
# #---PREGUNTA 18---
# cursor.execute("INSERT INTO preguntas(pregunta) VALUES('5 x 8')")
# #---PREGUNTA 19---
# cursor.execute("INSERT INTO preguntas(pregunta) VALUES('10 - 3 + 10')")
# #---PREGUNTA 20---
# cursor.execute("INSERT INTO preguntas(pregunta) VALUES('25 - 11')")


# #TABLA DE LAS RESPUESTAS
# cursor.execute("CREATE TABLE respuestas(id_pregunta INTEGER PRIMARY KEY, respuesta VARCHAR(50))")
# #Insertamos las respuestas
# #---RESPUESTA 1---
# cursor.execute("INSERT INTO respuestas(respuesta) VALUES('48')")
# #---RESPUESTA 2---
# cursor.execute("INSERT INTO respuestas(respuesta) VALUES('39')")
# #---RESPUESTA 3---
# cursor.execute("INSERT INTO respuestas(respuesta) VALUES('73')")
# #---RESPUESTA 4---
# cursor.execute("INSERT INTO respuestas(respuesta) VALUES('25')")
# #---RESPUESTA 5---
# cursor.execute("INSERT INTO respuestas(respuesta) VALUES('8')")
# #---RESPUESTA 6---
# cursor.execute("INSERT INTO respuestas(respuesta) VALUES('12')")
# #---RESPUESTA 7---
# cursor.execute("INSERT INTO respuestas(respuesta) VALUES('7')")
# #---RESPUESTA 8---
# cursor.execute("INSERT INTO respuestas(respuesta) VALUES('26')")
# #---RESPUESTA 9---
# cursor.execute("INSERT INTO respuestas(respuesta) VALUES('29')")
# #---RESPUESTA 10---
# cursor.execute("INSERT INTO respuestas(respuesta) VALUES('6')")
# #---RESPUESTA 11---
# cursor.execute("INSERT INTO respuestas(respuesta) VALUES('46')")
# #---RESPUESTA 12---
# cursor.execute("INSERT INTO respuestas(respuesta) VALUES('22')")
# #---RESPUESTA 13---
# cursor.execute("INSERT INTO respuestas(respuesta) VALUES('49')")
# #---RESPUESTA 14---
# cursor.execute("INSERT INTO respuestas(respuesta) VALUES('33')")
# #---RESPUESTA 15---
# cursor.execute("INSERT INTO respuestas(respuesta) VALUES('49')")
# #---RESPUESTA 16---
# cursor.execute("INSERT INTO respuestas(respuesta) VALUES('9')")
# #---RESPUESTA 17---
# cursor.execute("INSERT INTO respuestas(respuesta) VALUES('300')")
# #---RESPUESTA 18---
# cursor.execute("INSERT INTO respuestas(respuesta) VALUES('40')")
# #---RESPUESTA 19---
# cursor.execute("INSERT INTO respuestas(respuesta) VALUES('17')")
# #---RESPUESTA 20---
# cursor.execute("INSERT INTO respuestas(respuesta) VALUES('14')")

#Necesitamos modificar la columna 15 de ambas tablas para que las respuestas no sean iguales
#PREGUNTA
# pregunta_corregida = "157 - 27"
# id_pregunta = 15
# cursor.execute("UPDATE preguntas SET pregunta = ? WHERE id_pregunta = ?", (pregunta_corregida, id_pregunta))
# #RESPUESTA
# respuesta_corregida = "130"
# id_respuesta = 15
# cursor.execute("UPDATE respuestas SET respuesta = ? WHERE id_pregunta = ?", (respuesta_corregida, id_respuesta))

#Modificamos las preguntas 3, 4 y 13 para disminuir su dificultad
#Pregunta
pregunta_corregida3 = "100 - 25 - 25"
id_pregunta3 = 3
cursor.execute("UPDATE preguntas SET pregunta = ? WHERE id_pregunta = ?", (pregunta_corregida3, id_pregunta3))
#Respuesta
respuesta_corregida3 = "50"
id_respuesta3 = 3
cursor.execute("UPDATE respuestas SET respuesta = ? WHERE id_pregunta = ?", (respuesta_corregida3, id_respuesta3))

#Pregunta
pregunta_corregida4 = "25 x 3"
id_pregunta4 = 4
cursor.execute("UPDATE preguntas SET pregunta = ? WHERE id_pregunta = ?", (pregunta_corregida4, id_pregunta4))
#Respuesta
respuesta_corregida4 = "75"
id_respuesta4 = 4
cursor.execute("UPDATE respuestas SET respuesta = ? WHERE id_pregunta = ?", (respuesta_corregida4, id_respuesta4))

#Pregunta
pregunta_corregida13 = "78 / 6"
id_pregunta13 = 13
cursor.execute("UPDATE preguntas SET pregunta = ? WHERE id_pregunta = ?", (pregunta_corregida13, id_pregunta13))
#Respuesta
respuesta_corregida13 = "13"
id_respuesta13 = 13
cursor.execute("UPDATE respuestas SET respuesta = ? WHERE id_pregunta = ?", (respuesta_corregida13, id_respuesta13))

conexion.commit()