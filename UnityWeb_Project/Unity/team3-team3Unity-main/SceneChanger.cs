using UnityEngine;
using UnityEngine.SceneManagement;

public class SceneChanger : MonoBehaviour
{
    public string sceneName; // Nombre de la escena a cargar
    public float delayBeforeSceneChange = 45f; // Tiempo en segundos antes de cambiar de escena

    private void Start()
    {
        // Invoca el método para cambiar de escena después de un retraso
        Invoke("ChangeSceneWithDelay", delayBeforeSceneChange);
    }

    private void ChangeSceneWithDelay()
    {
        // Cambia a la nueva escena
        SceneManager.LoadScene("Pirata3");
    }
}
