using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Daño_obstaculo_Nivel2 : MonoBehaviour
{
    public AudioClip danioClip;
    public BoxCollider boxCollider;

    void OnCollisionEnter(Collision collision)
    {
        Control_Jugador control_Jugador = collision.gameObject.GetComponent<Control_Jugador>();

        if (control_Jugador != null)
        {
            control_Jugador.ModificarVida(-1);

            control_Jugador.PlaySound(danioClip);

            boxCollider.enabled = false;
        }
    }
}
