using UnityEngine;
using TMPro;

public class ScoreManager : MonoBehaviour
{
    // Instancia estática para acceso global
    public static ScoreManager instance;

    // Referencia al componente TextMeshProUGUI para mostrar el puntaje
    public TMP_Text scoreText;

    // Variable para almacenar el puntaje actual
    private int score = 0;

    void Awake()
    {
        // Implementación del patrón Singleton para asegurar una única instancia
        if (instance == null)
        {
            instance = this;
            DontDestroyOnLoad(gameObject); // Opcional: mantener la instancia a través de cargas de escena
        }
        else if (instance != this)
        {
            Destroy(gameObject);
            return;
        }

        // Inicializa el texto de puntaje si es necesario
        UpdateScoreText();
    }

    // Método público para añadir puntaje
    public void AddScore(int points)
    {
        score += points; // Añade los puntos al puntaje total
        UpdateScoreText(); // Actualiza el texto de puntaje

        // Opcional: Mensaje de consola con el nuevo puntaje
        Debug.Log("Nuevo score: " + score);
    }

    // Método para actualizar el texto de puntaje en la UI
    private void UpdateScoreText()
    {
        if (scoreText != null) // Verifica que scoreText esté asignado
        {
            scoreText.text = "Score: " + score; // Actualiza el texto
        }
        else
        {
            Debug.LogError("ScoreText no está asignado en ScoreManager.", this);
        }
    }
}
