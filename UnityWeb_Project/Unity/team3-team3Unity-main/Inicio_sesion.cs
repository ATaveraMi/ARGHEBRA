using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;
using UnityEngine.SceneManagement;
using UnityEngine.Networking;



public class Inicio_sesion : MonoBehaviour
{
    public TMP_InputField tmp_Nombre;
    public TMP_InputField tmp_Grupo;
    private static int id_jugador; // Con esto hacemos publica el id del jugador para acceder a el despues

    public static int Visualizar_id() //Con esto accedemos al id del jugador
    {
        return id_jugador;
    }

    private void Guardar_id(int id) //Con esto guardamos el id
    {
        id_jugador = id;
    }

    //ESTO ES PARA ENVIAR DATOS DEL SERVER A UNITY

    IEnumerator SendData(user u)
    {
        WWWForm form = new WWWForm();
        form.AddField("user", JsonUtility.ToJson(u));
        Debug.Log(u.name + u.number);

        using (UnityWebRequest www = UnityWebRequest.Post("https://em-dashboard.onrender.com/login_player", form)) //Simula un browser, es una petición web, un request
        {
            yield return www.SendWebRequest(); //Ejecuta la petición
            if (www.result != UnityWebRequest.Result.Success) //Si la petición no fue exitosa dime porque 
            {
                Debug.Log(www.error);
            }
            else //Si la petición fue exitosa
            {
                string response = www.downloadHandler.text;
                Debug.Log(response);

                // Deserializar la respuesta JSON para extraer el id
                ResponseData responseData = JsonUtility.FromJson<ResponseData>(response);
                Debug.Log("ID del Jugador: " + responseData.id);

                // Guardamos el id en este script para despues enviarlo al servidor
                Guardar_id(responseData.id);

                SceneManager.LoadScene("Menu_principal");
                gameObject.SetActive(false);


            }
        }
    }


    public void InicarSesion()
    {
        string lista = tmp_Grupo.text;
        string nombre = tmp_Nombre.text;
        Debug.Log("juega con grupo: " + nombre + " y lista: " + lista);


        // ESTO ES PARA QUE ENVIE DATOS DEL SERVER A UNITY
        user u = new user();
        u.name = nombre;
        u.number = lista;
        StartCoroutine(SendData(u));
    }

    //Esto es para hacer que sea persistente el nombre y el numero de lista
    private void Awake()
    {
        DontDestroyOnLoad(this.gameObject);
    }
}
