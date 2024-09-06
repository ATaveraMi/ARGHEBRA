using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;
using UnityEngine.Networking;

public class Daño_respuesta_Nivel2 : MonoBehaviour
{
    public TextMeshProUGUI opcion;
    public Preguntas_nivel2 preguntasNivel2;
    public static int correctas { get; set; } // Esto es para poder ver las respuestas correctas y manipularlo desde otros scripts para poder hacer el score
    public AudioClip danioClip;
    public AudioClip correctaClip;
    //Para obtener los objetos y quitar el collider si es la respuesta correcta
    public GameObject Objeto_opcion;
    public MeshCollider meshCollider_opcion;

    void Start()
    {
        meshCollider_opcion = Objeto_opcion.GetComponent<MeshCollider>();
    }

    void OnCollisionEnter(Collision collision)
    {
        Control_Jugador control_Jugador = collision.gameObject.GetComponent<Control_Jugador>();

        if (control_Jugador != null)
        {
            // Verificamos si el objeto con el que colisionó nuestro personaje no es la respuesta correcta
            if (opcion.text != preguntasNivel2.Respuesta_correcta)
            {
                // Reducir la vida del personaje
                control_Jugador.ModificarVida(-1);

                control_Jugador.PlaySound(danioClip);

                meshCollider_opcion.enabled = false;
            }
            else
            {
                correctas++;
                meshCollider_opcion.enabled = false;
                control_Jugador.PlaySound(correctaClip);
            }
        }
    }
}
