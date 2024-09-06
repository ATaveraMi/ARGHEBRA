using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;

public class Timer : MonoBehaviour
{
    public TMP_Text tmp_elapsed; // Texto "Elapsed"
    private float startTime; // Tiempo de inicio de la escena
    private bool Boton_pausa = false; // Indica si el tiempo está pausado

    void Start()
    {
        startTime = Time.realtimeSinceStartup; // Guarda el tiempo de inicio
    }

    void Update()
    {
        if (!Boton_pausa) // Si nuestro juego no está pausado, seguirá contando el tiempo normal
        {
            float elapsedTime = Time.realtimeSinceStartup - startTime; // Esto calcula el tiempo transcurrido
            tmp_elapsed.text = "Tiempo: " + elapsedTime.ToString("F1"); // Muestra el tiempo en pantalla con 1 decimal
        }
    }

    // Con esto pausamos el tiempo
    public void PausarTiempo()
    {
        Boton_pausa = true;
    }

    // Con esto continuamos con el tiempo si reanudamos nuestro juego
    public void ReanudarTiempo()
    {
        Boton_pausa = false;
        startTime = Time.realtimeSinceStartup - float.Parse(tmp_elapsed.text.Substring(8)); // Esto es para que muestre el tiempo sin contar cuando el juego estaba pausado
    }
}