using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.Networking;
using System.Data.Common;

public class Segundo_nivel : MonoBehaviour
{
    public Control_Jugador control_Jugador;
    public GameObject Panel_opciones; //Para manipular el panel de opciones
    public GameObject Salud; //Para manipular el panel de salud
    public GameObject Pausa; //Para manipular el panel de pausa
    public GameObject gameOver;
    public Timer timer; //Para acceder a nuestro tiempo de juego

    //Con esta función vamos a pausar el juego
    public void Pausar()
    {
        control_Jugador.Detener();

        Panel_opciones.SetActive(true); //Con esto activamos el panel de opciones para poder reanudar, reiniciar o salir

        Salud.SetActive(false); //Con esto desactivamos el panel de salud 
        Pausa.SetActive(false); //Con esto desactivamos el panel de pausa

        timer.PausarTiempo();

    }

    //Con esta función vamos a reanudar el juego
    public void Reanudar()
    {
        control_Jugador.Acelerar();

        Panel_opciones.SetActive(false); //Con esto desactivamos el panel de opciones para poder continuar con el juego

        Salud.SetActive(true); //Con esto activamos el panel de salud
        Pausa.SetActive(true); //Con esto activamos el panel de pausa

        timer.ReanudarTiempo();
    }

    //Con esta función vamos a reiniciar el nivel
    public void ReiniciarNivel()
    {
        if (!Control_Jugador.gameover && !Colision_meta_Nivel2.ganador)
        {
            Recopilacion(); //Mandamos el tiempo y score al servidor
        }

        SceneManager.LoadScene("Segundo_nivel");

        Daño_respuesta_Nivel2.correctas = 0; //Si reiniciamos el nivel tambien se reinicia el score

        //Para reiniciar las variables y volver a enviar los datos al servidor en caso de otra partida
        Control_Jugador.gameover = false;
        Colision_meta_Nivel2.ganador = false;
    }

    //Con esta función regresamos al menu de los niveles
    public void RegresarMenu()
    {
        if (!Control_Jugador.gameover && !Colision_meta_Nivel2.ganador)
        {
            Recopilacion(); //Mandamos el tiempo y score al servidor
        }

        SceneManager.LoadScene("Menu_niveles");
        gameObject.SetActive(false);

        Daño_respuesta_Nivel2.correctas = 0; //Si nos salimos del nivel tambien se reinicia el score

        //Para reiniciar las variables y volver a enviar los datos al servidor en caso de otra partida
        Control_Jugador.gameover = false;
        Colision_meta_Nivel2.ganador = false;
    }

    //Para mostrar el panel de game over
    public void MostrarGameOver()
    {
        gameOver.SetActive(true);

        Salud.SetActive(false); //Con esto desactivamos el panel de salud 
        Pausa.SetActive(false); //Con esto desactivamos el panel de pausa
    }

    //Con esta función vamos al siguiente nivel
    public void next()
    {
        SceneManager.LoadScene("Tercer_nivel");
        gameObject.SetActive(false);
    }

    //Con esto vamos a enviar los datos de tiempo y score final al servidor
    IEnumerator SendData(TimeScore ts)
    {
        WWWForm form = new WWWForm();
        form.AddField("TimeScore", JsonUtility.ToJson(ts));

        using (UnityWebRequest www = UnityWebRequest.Post("https://pruebaswebjulian.com/add_score", form)) //Simula un browser, es una petición web, un request
        {
            yield return www.SendWebRequest(); //Ejecuta la petición
            if (www.result != UnityWebRequest.Result.Success) //Si la petición no fue exitosa dime porque 
            {
                Debug.Log(www.error);
            }
            else //Si la petición fue exitosa
            {
                //Esto es para enviar datos de unity al server
                string informacion = www.downloadHandler.text;
                TimeScore recap = JsonUtility.FromJson<TimeScore>(informacion); //De JSON hazme un usuario con la informacion de response
            }
        }
    }

    //Con esta función vamos a recopilar la información del tiempo y score final
    public void Recopilacion()
    {
        TimeScore ts = new TimeScore();
        ts.score = Daño_respuesta_Nivel2.correctas;
        ts.time = float.Parse(timer.tmp_elapsed.text.Substring(8));
        ts.level = 2;
        ts.jugador_id = Inicio_sesion.Visualizar_id();

        StartCoroutine(SendData(ts));
    }
}
