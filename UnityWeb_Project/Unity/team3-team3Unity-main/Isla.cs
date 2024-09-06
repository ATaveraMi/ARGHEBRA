using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Isla : MonoBehaviour
{

    private void OnCollisionEnter(Collision collision)
    {

        // Verifica si el objeto con el que hemos colisionado es el triángulo
        if (collision.gameObject.name == "Pyramid" || collision.gameObject.tag == "Pyramid")
        {
            ScoreManager.instance.AddScore(1);
            // Destruye la isla (este GameObject)
            Destroy(gameObject);
           
        }
    }
}
