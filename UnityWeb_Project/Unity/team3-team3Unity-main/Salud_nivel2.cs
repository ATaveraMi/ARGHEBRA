using System.Collections;
using System.Collections.Generic;
using Microsoft.Unity.VisualStudio.Editor;
using UnityEngine;
using UnityEngine.UI;

public class Salud_nivel2 : MonoBehaviour
{
    public static Salud_nivel2 instancia { get; private set; }
    public UnityEngine.UI.Image Vida1;
    public UnityEngine.UI.Image Vida2;
    public UnityEngine.UI.Image Vida3;

    void Awake()
    {
        instancia = this;
    }
    // Start is called before the first frame update
    void Start()
    {
        Vida1.gameObject.SetActive(true);
        Vida2.gameObject.SetActive(true);
        Vida3.gameObject.SetActive(true);
    }

    public void MostrarVida0()
    {
        Vida1.gameObject.SetActive(false);
        Vida2.gameObject.SetActive(false);
        Vida3.gameObject.SetActive(false);
    }

    public void MostrarVida1()
    {
        Vida1.gameObject.SetActive(true);
        Vida2.gameObject.SetActive(false);
        Vida3.gameObject.SetActive(false);
    }

    public void MostrarVida2()
    {
        Vida1.gameObject.SetActive(true);
        Vida2.gameObject.SetActive(true);
        Vida3.gameObject.SetActive(false);
    }

    public void MostrarVida3()
    {
        Vida1.gameObject.SetActive(true);
        Vida2.gameObject.SetActive(true);
        Vida3.gameObject.SetActive(true);
    }
}
