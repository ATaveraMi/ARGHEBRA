using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;
using UnityEngine.Networking;

public class Score_nivel2 : MonoBehaviour
{
    public TextMeshProUGUI scoreText;

    void Update()
    {
        int preguntasTotales = 5; //El numero de preguntas que hay en el nivel
        int respuestasCorrectas = Daño_respuesta_Nivel2.correctas; //Aquí mandamos a llamar esta variable que nos dirá cuantas respuestas correctas ha elegido

        scoreText.text = "Puntaje: " + respuestasCorrectas.ToString() + " I " + preguntasTotales.ToString(); //Modificamos el texto que aparece en la pantalla
    }
}
