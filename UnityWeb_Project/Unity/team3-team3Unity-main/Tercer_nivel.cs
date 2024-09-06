using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class Tercer_nivel : MonoBehaviour
{
    // Start is called before the first frame update
    [Header("Botones")]
    public GameObject Regresar;

    public void RegresarMenu(GameObject panel)
    {
        SceneManager.LoadScene("Menu_niveles");
        gameObject.SetActive(false);
    }
}
