using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;
using UnityEngine.SceneManagement;
using UnityEngine.Networking;

public class ScoreManager1 : MonoBehaviour
{
    public static ScoreManager1 instance;
    public TMP_Text scoreText;

    public TextMeshPro anothertext;

    public TextMeshProUGUI restartText;
    private int score = 0;

    private float startTime;  // Variable para almacenar el tiempo de inicio


    void Awake()
    {
        if (instance == null)
        {
            instance = this;
            DontDestroyOnLoad(gameObject);
        }
        else if (instance != this)
        {
            Destroy(gameObject);
            return;
        }
        UpdateScoreText();
        ResetTimer();
    }


    void ResetTimer()
    {
        startTime = Time.time;  // Reinicia el temporizador al tiempo actual
    }

    public void AddScore(int points)
    {
        score += points;
        UpdateScoreText();
        Debug.Log("Nuevo score: " + score);

        // Comprueba si el puntaje es igual a 10 y termina el juego
       
    }

    public void UpdateScoreText()
    {
        if (scoreText != null)
        {
            restartText.text=
            scoreText.text = "Score: " + score;
        }
        else
        {
            Debug.LogError("ScoreText no está asignado en ScoreManager.", this);
        }
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
        ts.time = Time.time - startTime;  // Calcula el tiempo transcurrido
        ts.level = 1;  // Asumiendo un nivel fijo para el ejemplo, ajusta según sea necesario
        ts.jugador_id = Inicio_sesion.Visualizar_id();
        Debug.Log("Se envio correctamente el id el cual es: " + ts.jugador_id);

        StartCoroutine(SendData(ts));
    }

    // Método para llamar cuando el jugador pierde o el juego termina
    public void PlayerLost()
    {
        Debug.Log("El jugador ha perdido o alcanzado el puntaje objetivo. Enviando datos...");
        sendScore();

        // Opcional: Puedes hacer algo más aquí, como reiniciar el juego o mostrar un menú de fin de juego.
    }
}
