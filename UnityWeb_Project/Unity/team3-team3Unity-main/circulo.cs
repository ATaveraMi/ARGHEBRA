using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;
using System;

public class circulo : MonoBehaviour
{
   


    private void OnCollisionEnter(Collision collision)
    {
        // Verifica si el objeto con el que hemos colisionado es el triángulo
        if (collision.gameObject.name == "Cylinder" || collision.gameObject.tag == "Cylinder")
        {



            ScoreManager.instance.AddScore(1);
            Destroy(gameObject);
            




        }
    }
    
   
}
