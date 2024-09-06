using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;
using UnityEngine.SceneManagement;
using UnityEngine.Networking;

public class GUI : MonoBehaviour
{
    public TMP_InputField tmp_Lista;
    public TMP_InputField tmp_Grupo;

    IEnumerator SendData(user u)
    {
        WWWForm form = new WWWForm();
        form.AddField("user", JsonUtility.ToJson(u));

        using (UnityWebRequest www = UnityWebRequest.Post("http://127.0.0.1:8001/tc2005b", form)) //Simula un browser, es una petición web, un request
        {
            yield return www.SendWebRequest(); //Ejecuta la petición
            if (www.result != UnityWebRequest.Result.Success) //Si la petición no fue exitosa dime porque 
            {
                Debug.Log(www.error);
            }
            else //Si la petición fue exitosa
            {
                //Esto es para el usuario
                string levels = www.downloadHandler.text;
                // user temp = JsonUtility.FromJson<user>(response); //De JSON hazme un usuario con la informacion de response
                // Debug.Log(temp.id + " " + temp.group);

                //La sesion
                session s = JsonUtility.FromJson<session>(levels);
                Debug.Log(s.id); //Para conocer el id del jugador
                Debug.Log(s.levels[0].score);
            }
        }
    }

    public void BotonJugar()
    {
        string grupo = tmp_Grupo.text;
        string lista = tmp_Lista.text;
        // Debug.Log("juega con grupo: " + grupo + " y lista: " + lista);
        // SceneManager.LoadScene("Gato");
        user u = new user();
        u.id = int.Parse(lista);
        u.group = int.Parse(grupo);
        StartCoroutine(SendData(u));
    }

    void Start()
    {

    }


    void Update()
    {

    }
}
