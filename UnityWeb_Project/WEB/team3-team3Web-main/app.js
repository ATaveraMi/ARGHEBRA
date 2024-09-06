import express from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql';
import dotenv from 'dotenv';
import cors from 'cors';

const app = express();
// Carga las variables de entorno desde el archivo .env
dotenv.config();
// Middleware para parsear application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());
app.use(cors());


//-----------------------DATABASE CONNECTION------------------------------------
let connection; // Declarar connection como una variable utilizando let

// Función para conectar a la base de datos
function conectarBaseDeDatos() {
  // Configura la conexión a la base de datos MySQL
  const nuevaConexion = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  // Establecer conexión a la base de datos
  nuevaConexion.connect((err) => {
    if (err) {
      console.error('Error de conexión a la base de datos:', err);
      return;
    }
    console.log('Conexión a la base de datos establecida');
  });

  // Manejar errores de conexión
  nuevaConexion.on('error', (err) => {
    console.error('Error de conexión a la base de datos:', err);
  });

  return nuevaConexion;
}

// Conectar a la base de datos
connection = conectarBaseDeDatos();

// Cerrar y volver a abrir la conexión a la base de datos cada 24 horas (86400000 ms)
const intervaloReconexion = 1800000; // 24 horas en milisegundos

setInterval(() => {
  console.log('Cerrando conexión a la base de datos...');
  connection.end((err) => {
    if (err) {
      console.error('Error al cerrar la conexión a la base de datos:', err);
      return;
    }
    console.log('Conexión a la base de datos cerrada correctamente');
    console.log('Reconectando a la base de datos...');
    connection = conectarBaseDeDatos();
  });
}, intervaloReconexion);

//------------------------------------------------------------------------------


app.get('/', (req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.get('/signup', (req, res) => {
  res.sendFile('signup.html', { root: 'public' });
});

const escuelaContraseña = process.env.MASTER_PASSWORD;

app.post('/signup', (req, res) => {
  const { nombre, contraseña, escuelaContraseñaIngresada } = req.body;

  // Verificar si la contraseña de la escuela ingresada es correcta
  if (escuelaContraseñaIngresada !== escuelaContraseña) {
    return res.status(403).send('Contraseña de la escuela incorrecta');
  }

  const query = 'INSERT INTO profesor (nombre, contraseña) VALUES (?, ?)';
  connection.query(query, [nombre, contraseña], (err, results) => {
    if (err) {
      console.error('Error al agregar profesor:', err);
      return res.status(500).send('Error al agregar profesor');
    }
    res.send('Profesor agregado correctamente');
  });
});

app.get('/login', (req, res) => {
  res.sendFile('login.html', { root: 'public' });
});

app.post('/login', (req, res) => {
  const { nombre, contraseña } = req.body;
  const query = 'SELECT * FROM profesor WHERE nombre = ? AND contraseña = ?';
  connection.query(query, [nombre, contraseña], (err, results) => {
    if (err) {
      console.error('Error al buscar profesor:', err);
      res.status(500).send('Error al buscar profesor');
      return;
    }
    if (results.length === 0) {
      res.status(404).send('Profesor no encontrado o contraseña incorrecta');
      return;
    }
    res.send('Login exitoso');
  });
});


app.get('/delete_alumno', (req, res) => {
  res.sendFile('alumnos.html', { root: 'public' });
});

app.post('/delete_alumno', (req, res) => {
  const { nombre, numeroLista } = req.body; // Obtenemos los datos enviados desde el cliente
  // Realizamos la lógica de eliminación en la base de datos
  const query = 'DELETE FROM jugador WHERE nombre = ? AND num_lista = ?';
  connection.query(query, [nombre, numeroLista], (err, results) => {
    if (err) {
      console.error('Error al eliminar alumno:', err);
      res.status(500).send('Error al eliminar alumno');
      return;
    }
    if (results.affectedRows === 0) {
      res.status(404).send('No se encontró ningún alumno con esas características');
      return;
    }
    res.send('Alumno eliminado correctamente');
  });
});

app.get('/add_alumno', (req, res) => {
  res.sendFile('alumnos.html', { root: 'public' });
});


app.post('/add_alumno', (req, res) => {
  const { nombre, numLista, genero } = req.body;
  const query = 'INSERT INTO jugador (nombre, num_lista, genero) VALUES (?, ?, ?)';
  connection.query(query, [nombre, numLista, genero], (err, results) => {
    if (err) {
      console.error('Error al agregar alumno:', err);
      res.status(500).send('Error al agregar alumno');
      return;
    }
    res.send('Alumno agregado correctamente');
  });
});


app.get('/dashboard', (req, res) => {
  res.sendFile('dashboard.html', { root: 'public' });
});

app.post('/dashboard', (req, res) => {
  const highQuery = `
    SELECT j.nombre AS jugador, AVG(d.puntaje) AS promedio_puntaje
    FROM datos d
    INNER JOIN jugador j ON d.jugador_id = j.id
    GROUP BY j.nombre
    ORDER BY promedio_puntaje DESC
    LIMIT 5
  `;

  const lowQuery = `
    SELECT j.nombre AS jugador, AVG(d.puntaje) AS promedio_puntaje
    FROM datos d
    INNER JOIN jugador j ON d.jugador_id = j.id
    GROUP BY j.nombre
    ORDER BY promedio_puntaje ASC
    LIMIT 5
  `;

  const highQueryM = `
    SELECT j.nombre AS jugador, AVG(d.puntaje) AS promedio_puntaje
    FROM datos d
    INNER JOIN jugador j ON d.jugador_id = j.id
    WHERE j.genero = 'M'
    GROUP BY j.nombre
    ORDER BY promedio_puntaje DESC
    LIMIT 5
  `;

  const lowQueryM = `
    SELECT j.nombre AS jugador, AVG(d.puntaje) AS promedio_puntaje
    FROM datos d
    INNER JOIN jugador j ON d.jugador_id = j.id
    WHERE j.genero = 'M'
    GROUP BY j.nombre
    ORDER BY promedio_puntaje ASC
    LIMIT 5
  `;

  const highQueryF = `
    SELECT j.nombre AS jugador, AVG(d.puntaje) AS promedio_puntaje
    FROM datos d
    INNER JOIN jugador j ON d.jugador_id = j.id
    WHERE j.genero = 'F'
    GROUP BY j.nombre
    ORDER BY promedio_puntaje DESC
    LIMIT 5
  `;

  const lowQueryF = `
    SELECT j.nombre AS jugador, AVG(d.puntaje) AS promedio_puntaje
    FROM datos d
    INNER JOIN jugador j ON d.jugador_id = j.id
    WHERE j.genero = 'F'
    GROUP BY j.nombre
    ORDER BY promedio_puntaje ASC
    LIMIT 5
  `;

  const alumnosQuery = `
    SELECT j.nombre AS jugador, COUNT(d.id) AS veces_jugadas
    FROM jugador j
    LEFT JOIN datos d ON j.id = d.jugador_id
    GROUP BY j.nombre
  `;

  let responseData = {};

  connection.query(highQuery, (errHigh, highResults) => {
    if (errHigh) {
      console.error('Error al buscar datos para el dashboard:', errHigh);
      res.status(500).json({ error: 'Error al buscar datos para el dashboard' });
      return;
    }

    responseData.high_result = highResults;
    

    connection.query(lowQuery, (errLow, lowResults) => {
      if (errLow) {
        console.error('Error al buscar datos para el dashboard:', errLow);
        res.status(500).json({ error: 'Error al buscar datos para el dashboard' });
        return;
      }

      responseData.low_result = lowResults;
      

      connection.query(highQueryM, (errHighM, highResultsM) => {
        if (errHighM) {
          console.error('Error al buscar datos para el dashboard (mas altos - hombres):', errHighM);
          res.status(500).json({ error: 'Error al buscar datos para el dashboard (mas altos - hombres)' });
          return;
        }

        responseData.high_result_m = highResultsM;

        connection.query(lowQueryM, (errLowM, lowResultsM) => {
          if (errLowM) {
            console.error('Error al buscar datos para el dashboard (mas bajos - hombres):', errLowM);
            res.status(500).json({ error: 'Error al buscar datos para el dashboard (mas bajos - hombres)' });
            return;
          }

          responseData.low_result_m = lowResultsM;

          connection.query(highQueryF, (errHighF, highResultsF) => {
            if (errHighF) {
              console.error('Error al buscar datos para el dashboard (mas altos - mujeres):', errHighF);
              res.status(500).json({ error: 'Error al buscar datos para el dashboard (mas altos - mujeres)' });
              return;
            }

            responseData.high_result_f = highResultsF;

            connection.query(lowQueryF, (errLowF, lowResultsF) => {
              if (errLowF) {
                console.error('Error al buscar datos para el dashboard (mas bajos - mujeres):', errLowF);
                res.status(500).json({ error: 'Error al buscar datos para el dashboard (mas bajos - mujeres)' });
                return;
              }

              responseData.low_result_f = lowResultsF;

              connection.query(alumnosQuery, (errAlumnos, alumnosResults) => {
                if (errAlumnos) {
                  console.error('Error al buscar datos de alumnos:', errAlumnos);
                  res.status(500).json({ error: 'Error al buscar datos de alumnos' });
                  return;
                }

                responseData.alumnos = alumnosResults;

                res.json(responseData);
              });
            });
          });
        });
      });
    });
  });
});

//----------------------------------------codigos de conexcion con unity---------------------------------------------



// app.post('/login_player', (req, res) => {
//   const data = req.body.user; // Obtener el nombre y número de lista del cuerpo de la solicitud
//   console.log(data);
//   const user = JSON.parse(data);
//   const nombre = user.name;
//   const lista = user.number;
//   console.log(nombre);
//   console.log(lista);
  
//   // Realizar una consulta a la base de datos para verificar si el jugador existe
//   const query = `SELECT * FROM jugador WHERE nombre = ? AND num_lista = ?`;
  
//   connection.query(query, [nombre, lista ], (err, results) => {
//       if (err) {
//           console.error('Error al buscar jugador:', err);
//           res.status(500).json({ error: 'Error al buscar jugador' });
//           return;
//       }
      
//       // Verificar si se encontró algún jugador
//       if (results.length > 0) {
//           res.json({ exists: true }); // Si el jugador existe, enviar una respuesta indicando que existe
//       } else {
//           res.json({ exists: false }); // Si el jugador no existe, enviar una respuesta indicando que no existe
//       }
//   });
// });

app.post('/login_player', (req, res) => {
  const data = req.body.user; // Obtener el nombre y número de lista del cuerpo de la solicitud
  console.log(data);
  const user = JSON.parse(data);
  const nombre = user.name;
  const lista = user.number;
  console.log(nombre);
  console.log(lista);
  
  // Realizar una consulta a la base de datos para verificar si el jugador existe y obtener su id_jugador
  const query = `SELECT id FROM jugador WHERE nombre = ? AND num_lista = ?`;
  
  connection.query(query, [nombre, lista], (err, results) => {
    if (err) {
      console.error('Error al buscar jugador:', err);
      res.status(500).json({ error: 'Error al buscar jugador' });
      return;
    }
      
    // Verificar si se encontró algún jugador
    if (results.length > 0) {
      const idJugador = results[0].id; // Obtener el id_jugador del primer resultado
      res.json({ exists: true, id: idJugador }); // Enviar la respuesta con exists y id_jugador
    } else {
      res.json({ exists: false }); // Si el jugador no existe, enviar una respuesta indicando que no existe
    }
  });
});



app.post('/add_score', (req, res) => {
  const data = req.body.TimeScore;
  console.log(data);
  const score = JSON.parse(data);
  const puntaje = score.score;
  const gametime = score.time;
  const level = score.level;
  const jugador_id = score.jugador_id;
  console.log(puntaje);
  console.log(gametime);
  console.log(level);
  console.log(jugador_id);
  const veces_jugadas = 1;
  
  // Realizar la inserción de los datos del puntaje en la tabla datos
  const query = `INSERT INTO datos (veces_jugadas, puntaje, gametime, level, jugador_id) VALUES (?, ?, ?, ?, ?)`;
  
  connection.query(query, [veces_jugadas, puntaje, gametime, level, jugador_id], (err, results) => {
      if (err) {
          console.error('Error al agregar puntaje:', err);
          res.status(500).json({ error: 'Error al agregar puntaje' });
          return;
      }
      
      res.send('Puntaje agregado correctamente');
  });
});

app.get('/preguntas', (req, res) => {
  try {
    // Obtenemos una pregunta aleatoria
    const questionQuery = "SELECT * FROM preguntas_three ORDER BY RAND() LIMIT 1";
    connection.query(questionQuery, (err, pregunta) => {
      if (err) {
        console.error('Error al obtener la pregunta:', err);
        return res.status(500).json({ error: 'Error al obtener la pregunta' });
      }
      console.log('Pregunta obtenida:', pregunta);

      // Obtenemos la respuesta correcta que tiene el mismo id de la pregunta
      const respuestaCorrectaQuery = "SELECT respuesta FROM respuestas_three WHERE id_respuesta = ?";
      connection.query(respuestaCorrectaQuery, [pregunta[0].id_pregunta], (err, respuestaCorrecta) => {
        if (err) {
          console.error('Error al obtener la respuesta correcta:', err);
          return res.status(500).json({ error: 'Error al obtener la respuesta correcta' });
        }
        console.log('Respuesta correcta obtenida:', respuestaCorrecta);

        // Obtenemos dos respuestas aleatorias que no son la respuesta correcta
        const respuestasIncorrectasQuery = "SELECT respuesta FROM respuestas_three WHERE id_respuesta != ? ORDER BY RAND() LIMIT 2";
        connection.query(respuestasIncorrectasQuery, [pregunta[0].id_pregunta], (err, respuestasIncorrectas) => {
          if (err) {
            console.error('Error al obtener las respuestas incorrectas:', err);
            return res.status(500).json({ error: 'Error al obtener las respuestas incorrectas' });
          }
          console.log('Respuestas incorrectas obtenidas:', respuestasIncorrectas);

         // Construimos la respuesta JSON
         const response = {
          pregunta: pregunta[0].pregunta,
          respuestas: [
            respuestaCorrecta[0].respuesta,
            respuestasIncorrectas[0].respuesta,
            respuestasIncorrectas[1].respuesta
          ]
        };

        // Retornamos la pregunta y las respuestas
        res.json(response);
        console.log(response);
          
        });
      });
    });
  } catch (err) {
    console.error('Error en el servidor:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});




//---------------------------datos filtrado por niveles

app.get('/level_one', (req, res) => {
  res.sendFile('first_level.html', { root: 'public' });
});

app.post('/level_one', (req, res) => {
  const highQuery = `
    SELECT j.nombre AS jugador, d.puntaje
    FROM datos d
    INNER JOIN jugador j ON d.jugador_id = j.id
    WHERE d.level = 1
    ORDER BY d.puntaje DESC
    LIMIT 5
  `;

  const lowQuery = `
    SELECT j.nombre AS jugador, d.puntaje
    FROM datos d
    INNER JOIN jugador j ON d.jugador_id = j.id
    WHERE d.level = 1
    ORDER BY d.puntaje ASC
    LIMIT 5
  `;

  const highQueryM = `
    SELECT j.nombre AS jugador, d.puntaje
    FROM datos d
    INNER JOIN jugador j ON d.jugador_id = j.id
    WHERE j.genero = 'M' AND d.level = 1
    ORDER BY d.puntaje DESC
    LIMIT 5
  `;

  const lowQueryM = `
    SELECT j.nombre AS jugador, d.puntaje
    FROM datos d
    INNER JOIN jugador j ON d.jugador_id = j.id
    WHERE j.genero = 'M' AND d.level = 1
    ORDER BY d.puntaje ASC
    LIMIT 5
  `;

  const highQueryF = `
    SELECT j.nombre AS jugador, d.puntaje
    FROM datos d
    INNER JOIN jugador j ON d.jugador_id = j.id
    WHERE j.genero = 'F' AND d.level = 1
    ORDER BY d.puntaje DESC
    LIMIT 5
  `;

  const lowQueryF = `
    SELECT j.nombre AS jugador, d.puntaje
    FROM datos d
    INNER JOIN jugador j ON d.jugador_id = j.id
    WHERE j.genero = 'F' AND d.level = 1
    ORDER BY d.puntaje ASC
    LIMIT 5
  `;

  const alumnosQuery = `
    SELECT j.nombre AS jugador, COUNT(d.id) AS veces_jugadas
    FROM jugador j
    LEFT JOIN datos d ON j.id = d.jugador_id AND d.level = 1
    GROUP BY j.nombre
  `;

  let responseData = {};

  connection.query(highQuery, (errHigh, highResults) => {
    if (errHigh) {
      console.error('Error al buscar datos para el dashboard:', errHigh);
      res.status(500).json({ error: 'Error al buscar datos para el dashboard' });
      return;
    }

    responseData.high_result = highResults;

    connection.query(lowQuery, (errLow, lowResults) => {
      if (errLow) {
        console.error('Error al buscar datos para el dashboard:', errLow);
        res.status(500).json({ error: 'Error al buscar datos para el dashboard' });
        return;
      }

      responseData.low_result = lowResults;

      connection.query(highQueryM, (errHighM, highResultsM) => {
        if (errHighM) {
          console.error('Error al buscar datos para el dashboard (mas altos - hombres):', errHighM);
          res.status(500).json({ error: 'Error al buscar datos para el dashboard (mas altos - hombres)' });
          return;
        }

        responseData.high_result_m = highResultsM;

        connection.query(lowQueryM, (errLowM, lowResultsM) => {
          if (errLowM) {
            console.error('Error al buscar datos para el dashboard (mas bajos - hombres):', errLowM);
            res.status(500).json({ error: 'Error al buscar datos para el dashboard (mas bajos - hombres)' });
            return;
          }

          responseData.low_result_m = lowResultsM;

          connection.query(highQueryF, (errHighF, highResultsF) => {
            if (errHighF) {
              console.error('Error al buscar datos para el dashboard (mas altos - mujeres):', errHighF);
              res.status(500).json({ error: 'Error al buscar datos para el dashboard (mas altos - mujeres)' });
              return;
            }

            responseData.high_result_f = highResultsF;

            connection.query(lowQueryF, (errLowF, lowResultsF) => {
              if (errLowF) {
                console.error('Error al buscar datos para el dashboard (mas bajos - mujeres):', errLowF);
                res.status(500).json({ error: 'Error al buscar datos para el dashboard (mas bajos - mujeres)' });
                return;
              }

              responseData.low_result_f = lowResultsF;

              connection.query(alumnosQuery, (errAlumnos, alumnosResults) => {
                if (errAlumnos) {
                  console.error('Error al buscar datos de alumnos:', errAlumnos);
                  res.status(500).json({ error: 'Error al buscar datos de alumnos' });
                  return;
                }

                responseData.alumnos = alumnosResults;

                res.json(responseData);
              });
            });
          });
        });
      });
    });
  });
});




app.get('/level_two', (req, res) => {
  res.sendFile('second_level.html', { root: 'public' });
});

app.post('/level_two', (req, res) => {
  const highQuery = `
    SELECT j.nombre AS jugador, d.puntaje
    FROM datos d
    INNER JOIN jugador j ON d.jugador_id = j.id
    WHERE d.level = 2
    ORDER BY d.puntaje DESC
    LIMIT 5
  `;

  const lowQuery = `
    SELECT j.nombre AS jugador, d.puntaje
    FROM datos d
    INNER JOIN jugador j ON d.jugador_id = j.id
    WHERE d.level = 2
    ORDER BY d.puntaje ASC
    LIMIT 5
  `;

  const highQueryM = `
    SELECT j.nombre AS jugador, d.puntaje
    FROM datos d
    INNER JOIN jugador j ON d.jugador_id = j.id
    WHERE j.genero = 'M' AND d.level = 2
    ORDER BY d.puntaje DESC
    LIMIT 5
  `;

  const lowQueryM = `
    SELECT j.nombre AS jugador, d.puntaje
    FROM datos d
    INNER JOIN jugador j ON d.jugador_id = j.id
    WHERE j.genero = 'M' AND d.level = 2
    ORDER BY d.puntaje ASC
    LIMIT 5
  `;

  const highQueryF = `
    SELECT j.nombre AS jugador, d.puntaje
    FROM datos d
    INNER JOIN jugador j ON d.jugador_id = j.id
    WHERE j.genero = 'F' AND d.level = 2
    ORDER BY d.puntaje DESC
    LIMIT 5
  `;

  const lowQueryF = `
    SELECT j.nombre AS jugador, d.puntaje
    FROM datos d
    INNER JOIN jugador j ON d.jugador_id = j.id
    WHERE j.genero = 'F' AND d.level = 2
    ORDER BY d.puntaje ASC
    LIMIT 5
  `;

  const alumnosQuery = `
    SELECT j.nombre AS jugador, COUNT(d.id) AS veces_jugadas
    FROM jugador j
    LEFT JOIN datos d ON j.id = d.jugador_id AND d.level = 2
    GROUP BY j.nombre
  `;

  let responseData = {};

  connection.query(highQuery, (errHigh, highResults) => {
    if (errHigh) {
      console.error('Error al buscar datos para el dashboard:', errHigh);
      res.status(500).json({ error: 'Error al buscar datos para el dashboard' });
      return;
    }

    responseData.high_result = highResults;

    connection.query(lowQuery, (errLow, lowResults) => {
      if (errLow) {
        console.error('Error al buscar datos para el dashboard:', errLow);
        res.status(500).json({ error: 'Error al buscar datos para el dashboard' });
        return;
      }

      responseData.low_result = lowResults;

      connection.query(highQueryM, (errHighM, highResultsM) => {
        if (errHighM) {
          console.error('Error al buscar datos para el dashboard (mas altos - hombres):', errHighM);
          res.status(500).json({ error: 'Error al buscar datos para el dashboard (mas altos - hombres)' });
          return;
        }

        responseData.high_result_m = highResultsM;

        connection.query(lowQueryM, (errLowM, lowResultsM) => {
          if (errLowM) {
            console.error('Error al buscar datos para el dashboard (mas bajos - hombres):', errLowM);
            res.status(500).json({ error: 'Error al buscar datos para el dashboard (mas bajos - hombres)' });
            return;
          }

          responseData.low_result_m = lowResultsM;

          connection.query(highQueryF, (errHighF, highResultsF) => {
            if (errHighF) {
              console.error('Error al buscar datos para el dashboard (mas altos - mujeres):', errHighF);
              res.status(500).json({ error: 'Error al buscar datos para el dashboard (mas altos - mujeres)' });
              return;
            }

            responseData.high_result_f = highResultsF;

            connection.query(lowQueryF, (errLowF, lowResultsF) => {
              if (errLowF) {
                console.error('Error al buscar datos para el dashboard (mas bajos - mujeres):', errLowF);
                res.status(500).json({ error: 'Error al buscar datos para el dashboard (mas bajos - mujeres)' });
                return;
              }

              responseData.low_result_f = lowResultsF;

              connection.query(alumnosQuery, (errAlumnos, alumnosResults) => {
                if (errAlumnos) {
                  console.error('Error al buscar datos de alumnos:', errAlumnos);
                  res.status(500).json({ error: 'Error al buscar datos de alumnos' });
                  return;
                }

                responseData.alumnos = alumnosResults;

                res.json(responseData);
              });
            });
          });
        });
      });
    });
  });
});

app.get('/level_three', (req, res) => {
  res.sendFile('third_level.html', { root: 'public' });
});

app.post('/level_three', (req, res) => {
  const highQuery = `
    SELECT j.nombre AS jugador, d.puntaje
    FROM datos d
    INNER JOIN jugador j ON d.jugador_id = j.id
    WHERE d.level = 3
    ORDER BY d.puntaje DESC
    LIMIT 5
  `;

  const lowQuery = `
    SELECT j.nombre AS jugador, d.puntaje
    FROM datos d
    INNER JOIN jugador j ON d.jugador_id = j.id
    WHERE d.level = 3
    ORDER BY d.puntaje ASC
    LIMIT 5
  `;

  const highQueryM = `
    SELECT j.nombre AS jugador, d.puntaje
    FROM datos d
    INNER JOIN jugador j ON d.jugador_id = j.id
    WHERE j.genero = 'M' AND d.level = 3
    ORDER BY d.puntaje DESC
    LIMIT 5
  `;

  const lowQueryM = `
    SELECT j.nombre AS jugador, d.puntaje
    FROM datos d
    INNER JOIN jugador j ON d.jugador_id = j.id
    WHERE j.genero = 'M' AND d.level = 3
    ORDER BY d.puntaje ASC
    LIMIT 5
  `;

  const highQueryF = `
    SELECT j.nombre AS jugador, d.puntaje
    FROM datos d
    INNER JOIN jugador j ON d.jugador_id = j.id
    WHERE j.genero = 'F' AND d.level = 3
    ORDER BY d.puntaje DESC
    LIMIT 5
  `;

  const lowQueryF = `
    SELECT j.nombre AS jugador, d.puntaje
    FROM datos d
    INNER JOIN jugador j ON d.jugador_id = j.id
    WHERE j.genero = 'F' AND d.level = 3
    ORDER BY d.puntaje ASC
    LIMIT 5
  `;

  const alumnosQuery = `
    SELECT j.nombre AS jugador, COUNT(d.id) AS veces_jugadas
    FROM jugador j
    LEFT JOIN datos d ON j.id = d.jugador_id AND d.level = 3
    GROUP BY j.nombre
  `;

  let responseData = {};

  connection.query(highQuery, (errHigh, highResults) => {
    if (errHigh) {
      console.error('Error al buscar datos para el dashboard:', errHigh);
      res.status(500).json({ error: 'Error al buscar datos para el dashboard' });
      return;
    }

    responseData.high_result = highResults;

    connection.query(lowQuery, (errLow, lowResults) => {
      if (errLow) {
        console.error('Error al buscar datos para el dashboard:', errLow);
        res.status(500).json({ error: 'Error al buscar datos para el dashboard' });
        return;
      }

      responseData.low_result = lowResults;

      connection.query(highQueryM, (errHighM, highResultsM) => {
        if (errHighM) {
          console.error('Error al buscar datos para el dashboard (mas altos - hombres):', errHighM);
          res.status(500).json({ error: 'Error al buscar datos para el dashboard (mas altos - hombres)' });
          return;
        }

        responseData.high_result_m = highResultsM;

        connection.query(lowQueryM, (errLowM, lowResultsM) => {
          if (errLowM) {
            console.error('Error al buscar datos para el dashboard (mas bajos - hombres):', errLowM);
            res.status(500).json({ error: 'Error al buscar datos para el dashboard (mas bajos - hombres)' });
            return;
          }

          responseData.low_result_m = lowResultsM;

          connection.query(highQueryF, (errHighF, highResultsF) => {
            if (errHighF) {
              console.error('Error al buscar datos para el dashboard (mas altos - mujeres):', errHighF);
              res.status(500).json({ error: 'Error al buscar datos para el dashboard (mas altos - mujeres)' });
              return;
            }

            responseData.high_result_f = highResultsF;

            connection.query(lowQueryF, (errLowF, lowResultsF) => {
              if (errLowF) {
                console.error('Error al buscar datos para el dashboard (mas bajos - mujeres):', errLowF);
                res.status(500).json({ error: 'Error al buscar datos para el dashboard (mas bajos - mujeres)' });
                return;
              }

              responseData.low_result_f = lowResultsF;

              connection.query(alumnosQuery, (errAlumnos, alumnosResults) => {
                if (errAlumnos) {
                  console.error('Error al buscar datos de alumnos:', errAlumnos);
                  res.status(500).json({ error: 'Error al buscar datos de alumnos' });
                  return;
                }

                responseData.alumnos = alumnosResults;

                res.json(responseData);
              });
            });
          });
        });
      });
    });
  });
});





//-------------------------------------------------------------------------------------------------------

app.get('/license', (req, res) => {
  res.sendFile("license.html", { root : "public" })
})

// 404 route
app.get('/404', (req, res) => {
  res.sendFile("404.html", { root : "public" })
})

app.use((req, res) => {
  res.redirect('/404')
})

const port = process.env.PORT;
// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});



/* CREAR BASE DE DATOS MYSQL LOCAL PARA PRUEBAS

USE db_unity;

CREATE TABLE jugador (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255),
  num_lista INT,
  genero VARCHAR(7)
);

CREATE TABLE datos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  veces_jugadas INT,
  puntaje FLOAT,
  gametime FLOAT,
  jugador_id INT,
  level INT,
  FOREIGN KEY (jugador_id) REFERENCES jugador(id)
);

CREATE TABLE niveles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  facil INT,
  intermedio INT,
  dificil INT,
  jugador_id INT,
  FOREIGN KEY (jugador_id) REFERENCES jugador(id)
);

CREATE TABLE categoria (
  id INT AUTO_INCREMENT PRIMARY KEY,
  conceptos_basicos VARCHAR(255),
  operaciones_basicas VARCHAR(255),
  operaciones_figuras VARCHAR(255),
  nivel_id INT,
  FOREIGN KEY (nivel_id) REFERENCES niveles(id)
);

CREATE TABLE preguntas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  categoria_id INT,
  FOREIGN KEY (categoria_id) REFERENCES categoria(id)
);

CREATE TABLE respuestas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  correctas VARCHAR(255),
  incorrectas VARCHAR(255),
  pregunta_id INT,
  FOREIGN KEY (pregunta_id) REFERENCES preguntas(id)
);

CREATE TABLE profesor (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255),
  contraseña VARCHAR(255) -- Corrección: Eliminé el carácter extra al final
);

INSERT INTO jugador (nombre, num_lista, genero)
VALUES 
('Juan Pérez', 1, 'M'),
('María García', 2, 'F'),
('Luis Martínez', 3, 'M'),
('Ana Rodríguez', 4, 'F'),
('Carlos López', 5, 'M'),
('Laura González', 6, 'F'),
('David Sánchez', 7, 'M'),
('Elena Fernández', 8, 'F'),
('Javier Gómez', 9, 'M'),
('Sofía Díaz', 10, 'F'),
('Pedro Hernández', 11, 'M'),
('Carmen Ruiz', 12, 'F'),
('Alejandro Torres', 13, 'M'),
('Raquel Jiménez', 14, 'F'),
('Diego Vázquez', 15, 'M'),
('Isabel Moreno', 16, 'F'),
('Sergio Romero', 17, 'M'),
('Natalia Ortiz', 18, 'F'),
('Pablo Castro', 19, 'M'),
('Lucía Navarro', 20, 'F');


INSERT INTO datos (veces_jugadas, puntaje, gametime, level, jugador_id)
VALUES 
(1, 150.5, '2024-03-13 10:30:00', 1, 1),
(1, 120.3, '2024-03-13 09:45:00', 2, 2),
(1, 200.7, '2024-03-13 11:20:00', 3, 3),
(1, 250.0, '2024-03-13 13:05:00', 3, 4),
(1, 180.2, '2024-03-13 14:40:00', 2, 5),
(1, 220.1, '2024-03-13 16:15:00', 1, 6),
(1, 130.6, '2024-03-13 17:50:00', 3, 7),
(1, 190.9, '2024-03-13 19:25:00', 2, 8),
(1, 160.4, '2024-03-13 20:55:00', 3, 9),
(1, 210.8, '2024-03-13 22:30:00', 3, 10),
(1, 170.0, '2024-03-13 08:00:00', 1, 11),
(1, 100.5, '2024-03-13 09:35:00', 3, 12),
(1, 230.3, '2024-03-13 11:10:00', 2, 13),
(1, 240.6, '2024-03-13 12:45:00', 3, 14),
(1, 270.9, '2024-03-13 14:20:00', 1, 15),
(1, 270.9, '2024-03-13 14:20:00', 2, 15),
(1, 270.9, '2024-03-13 14:20:00', 3, 15),
(1, 140.2, '2024-03-13 15:55:00', 1, 16),
(1, 150.7, '2024-03-13 17:30:00', 3, 17),
(1, 280.5, '2024-03-13 19:05:00', 1, 18),
(1, 290.8, '2024-03-13 20:40:00', 3, 19),
(1, 90.3, '2024-03-13 22:15:00', 1, 20);


*/
