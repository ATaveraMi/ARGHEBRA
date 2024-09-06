using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;

public class Colision_meta_Nivel2 : MonoBehaviour
{
    public Control_Jugador control_Jugador;
    public GameObject Winner;
    public GameObject Salud; //Para manipular el panel de salud
    public GameObject Pausa; //Para manipular el panel de pausa
    public TextMeshProUGUI puntaje;
    public Segundo_nivel Segundo_nivel;
    public static bool ganador = false; //Para saber si nuestro jugador ya ganó la partida, en el caso que si, si se sale de la partida no se enviaran los datos al servidor, con esto evitamos que se duplique el envio de datos
    void OnCollisionEnter(Collision collision)
    {
        Control_Jugador control_Jugador = collision.gameObject.GetComponent<Control_Jugador>();

        if (control_Jugador != null && control_Jugador.Vida_actual > 0)
        {
            Controlador_niveles.instancia.AumentarNiveles(); //Para que al ganar el nivel se desbloqueé el tercer nivel del menu de los niveles
            ganador = true;
            Segundo_nivel.Recopilacion(); //Mandamos el tiempo y score al servidor

            control_Jugador.Detener();
            Winner.SetActive(true);

            Salud.SetActive(true); //Con esto activamos el panel de salud 

            Pausa.SetActive(false); //Con esto desactivamos el panel de pausa

            //Mostramos el puntaje que obtuvo
            int preguntasTotales = 5; //El numero de preguntas que hay en el nivel
            int respuestasCorrectas = Daño_respuesta_Nivel2.correctas; //Las respuestas correctas que obtuvo

            puntaje.text = respuestasCorrectas.ToString() + " I " + preguntasTotales.ToString();
        }
    }
}
