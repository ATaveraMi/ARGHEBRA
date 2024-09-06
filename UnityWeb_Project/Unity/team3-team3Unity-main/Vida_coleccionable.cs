using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Vida_coleccionable : MonoBehaviour
{
    public AudioClip recoleccionClip;
    void OnTriggerEnter(Collider other)
    {
        Control_Jugador control_Jugador = other.gameObject.GetComponent<Control_Jugador>();

        if (control_Jugador != null)
        {
            if (control_Jugador.Vida_actual < control_Jugador.Vida_maxima)
            {
                control_Jugador.ModificarVida(1);
                Destroy(gameObject);

                control_Jugador.PlaySound(recoleccionClip);
            }
        }
    }
}
