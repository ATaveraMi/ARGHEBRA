using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;
using UnityEngine.Networking;

public class ScoreManager2 : MonoBehaviour
{
    public Transform player; // Referencia al transform del jugador
    public TextMeshProUGUI scoreText; // Referencia al componente TextMeshProUGUI donde se mostrará el puntaje
    public float distanceToIncrementScore = 50f; // Distancia para aumentar el puntaje

    private int score = 0; // Puntaje actual
    private float lastIncrementPosition = 0f; // Posición del jugador en el último incremento de puntaje
    private float startTime; // Tiempo de inicio para el temporizador
    private bool gameEnded = false; // Controla si el juego ha terminado

    private void Start()
    {
        startTime = Time.time; // Establece el tiempo de inicio al cargar el juego
        UpdateScoreText();
        lastIncrementPosition = player.position.z; // Establecer la posición inicial del último incremento en el eje Z
    }

    private void Update()
    {
        if (!gameEnded) // Continúa las operaciones solo si el juego no ha terminado
        {
            // Calcular la distancia recorrida desde el último incremento de puntaje en el eje Z
            float distanceSinceLastIncrement = Mathf.Abs(player.position.z - lastIncrementPosition);

            // Si la distancia recorrida en el eje Z supera la distancia para aumentar el puntaje
            if (distanceSinceLastIncrement >= distanceToIncrementScore)
            {
                score++; // Incrementar el puntaje
                lastIncrementPosition = player.position.z; // Actualizar la posición del último incremento
                UpdateScoreText(); // Actualizar el texto del puntaje en el UI
            }

            // Verificar si han transcurrido 144 segundos desde el inicio del juego
            if (Time.time - startTime >= 20f)
            {
                EndGame();
            }
        }
    }

    private void EndGame()
    {
        gameEnded = true; // Marcar el juego como terminado
        Debug.Log("El tiempo ha alcanzado 144 segundos. Finalizando el juego y enviando puntaje.");
        sendScore(); // Envía el puntaje
        // Aquí puedes añadir más lógica para manejar lo que ocurre cuando el juego termina (e.g., mostrar menú de fin, reiniciar, etc.)
    }

    private void UpdateScoreText()
    {
        // Actualizar el texto del puntaje en el UI con el valor actual del puntaje
        scoreText.text = "Score: " + score.ToString();
    }

    IEnumerator SendData(TimeScore ts)
    {
        WWWForm form = new WWWForm();
        form.AddField("TimeScore", JsonUtility.ToJson(ts));

        using (UnityWebRequest www = UnityWebRequest.Post("https://em-dashboard.onrender.com/add_score", form))
        {
            yield return www.SendWebRequest();
            if (www.result != UnityWebRequest.Result.Success)
            {
                Debug.Log(www.error);
            }
            else
            {
                string informacion = www.downloadHandler.text;
                TimeScore recap = JsonUtility.FromJson<TimeScore>(informacion);
            }
        }
    }

    public void sendScore()
    {
        TimeScore ts = new TimeScore();
        ts.score = score;
        ts.time = Time.time - startTime;  // Calcula el tiempo transcurrido desde el inicio
        ts.level = 3;  // Asumiendo un nivel fijo para el ejemplo, ajusta según sea necesario
        ts.jugador_id = Inicio_sesion.Visualizar_id();
        Debug.Log("Se envio correctamente el id el cual es: " + ts.jugador_id);

        StartCoroutine(SendData(ts));
    }
}
