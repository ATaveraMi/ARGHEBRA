using System.Collections;
using System.Collections.Generic;
using TMPro;
using UnityEngine;
using UnityEngine.Networking;

public class Preguntas_nivel2 : MonoBehaviour
{
    public TextMeshProUGUI pregunta;
    public TextMeshProUGUI opcion1;
    public TextMeshProUGUI opcion2;
    public TextMeshProUGUI opcion3;
    private List<int> numerosAleatorios; // Aquí vamos a almacenar una lista de números aleatorios para que no se repitan las opciones de respuesta
    public string Respuesta_correcta { get; private set; } // Con esto podemos acceder desde otros scripts a la respuesta correcta
    // Start is called before the first frame update
    void Start()
    {
        StartCoroutine(GetQuestion());

        numerosAleatorios = new List<int>();

        // Para verificar que no se repitan los números aleatorios
        while (numerosAleatorios.Count < 3)
        {
            int num = Aleatorio();
            if (!numerosAleatorios.Contains(num))
            {
                numerosAleatorios.Add(num);
            }
        }
    }

    IEnumerator GetQuestion()
    {
        // Hacemos la solicitud al servidor
        UnityWebRequest request = UnityWebRequest.Get("https://em-dashboard.onrender.com/preguntas");
        yield return request.SendWebRequest();

        if (request.result != UnityWebRequest.Result.Success)
        {
            Debug.LogError(request.error);
        }
        else
        {
            // La respuesta en el formato Json
            string json = request.downloadHandler.text;
            Pregunta_Respuesta_N2 response = JsonUtility.FromJson<Pregunta_Respuesta_N2>(json);

            // Colocamos la pregunta y las opciones de respuesta en el canvas
            pregunta.text = response.pregunta;
            opcion1.text = response.respuestas[numerosAleatorios[0]];
            opcion2.text = response.respuestas[numerosAleatorios[1]];
            opcion3.text = response.respuestas[numerosAleatorios[2]];


            // Para que podamos acceder desde otros scripts a la respuesta correcta
            Respuesta_correcta = response.respuestas[0];
        }
    }

    // Para generar un número aleatorio entre 0 y 2 (que son los indices de las opciones de respuesta)
    int Aleatorio()
    {
        int num = Random.Range(0, 3);
        return num;
    }
}
