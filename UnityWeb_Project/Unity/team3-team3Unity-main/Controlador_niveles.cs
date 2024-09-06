using System.Collections;
using System.Collections.Generic;
using System.Xml.Serialization;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

public class Controlador_niveles : MonoBehaviour
{
    public static Controlador_niveles instancia;
    public Button[] botonesNiveles;
    public int desbloquearNiveles;

    private void Awake()
    {
        if (instancia == null)
        {
            instancia = this;
        }
    }

    void Start()
    {
        //PlayerPrefs.DeleteKey("nivelesDesbloqueados"); // Limpia el registro de niveles desbloqueados
        if (botonesNiveles.Length > 0)
        {
            for (int i = 0; i < botonesNiveles.Length; i++)
            {
                botonesNiveles[i].interactable = false;
            }
            for (int i = 0; i < PlayerPrefs.GetInt("nivelesDesbloqueados", 1); i++)
            {
                botonesNiveles[i].interactable = true;
            }
        }
    }

    public void AumentarNiveles()
    {
        if (desbloquearNiveles > PlayerPrefs.GetInt("nivelesDesbloqueados", 1))
        {
            PlayerPrefs.SetInt("nivelesDesbloqueados", desbloquearNiveles);
        }
    }

    public void EntrarNivel1()
    {
        Controlador_niveles.instancia.AumentarNiveles();
        SceneManager.LoadScene("Primer_nivel");
        gameObject.SetActive(false);
    }

    public void EntrarNivel2()
    {
        Controlador_niveles.instancia.AumentarNiveles();
        SceneManager.LoadScene("Segundo_nivel");
        gameObject.SetActive(false);
    }

    public void EntrarNivel3()
    {
        SceneManager.LoadScene("Tercer_nivel");
        gameObject.SetActive(false);
    }

    public void RegresarMenu()
    {
        SceneManager.LoadScene("Menu_principal");
        gameObject.SetActive(false);
    }

    public void FinJuego()
    {
        SceneManager.LoadScene("Fin_juego");
        gameObject.SetActive(false);
    }


}
