using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UIElements;

public class Control_Jugador : MonoBehaviour
{
    public Rigidbody control_Jugador;
    private Vector3 direccion;
    public float forwardSpeed; //Velocidad del personaje
    private int carril = 1; //Carril del personaje: 0:Izquierda, 1:En medio y 2:Derecha
    private float distancia_carriles = 1f; //Distancia entre carriles
    private Animator animator;
    public int Vida_maxima = 3; //Estas serán la cantidad de vidas que tendrá nuestro personaje
    public int Vida_actual; //Para tener un control de la vida actual del personaje
    public Segundo_nivel Segundo_nivel;
    public static bool gameover = false; //Para saber si nuestro jugador ya perdió la partida, en el caso que si, si reinicia el nivel o se sale de la partida no se enviaran los datos al servidor, con esto evitamos que se duplique el envio de datos
    private AudioSource audioSource; //Para reproducir un sonido cuando sucede alguna acción
    // Start is called before the first frame update
    void Start()
    {
        control_Jugador = GetComponent<Rigidbody>(); //Con esto obtenemos el movimiento del personaje
        animator = GetComponent<Animator>();
        Vida_actual = Vida_maxima; //Se inicializa la vida actual con la vida maxima

        audioSource = GetComponent<AudioSource>();
    }

    // Update is called once per frame
    void Update()
    {
        direccion.z = forwardSpeed; //Para que el jugador se mueva hacia delante
        animator.SetFloat("VelZ", forwardSpeed);

        //Carriles
        if (Input.GetKeyDown(KeyCode.RightArrow)) //Si presiona la flecha derecha
        {
            carril++;
            if (carril == 3) //Para que no exceda el límite
            {
                carril = 2;
            }
        }

        if (Input.GetKeyDown(KeyCode.LeftArrow)) //Si presiona la flecha izquierda
        {
            carril--;
            if (carril == -1) //Para que no exceda el límite
            {
                carril = 0;
            }
        }

        if (Vida_actual == 0) //Cuando el personaje pierda todas sus vidas
        {
            GameOver(); //Se acaba el juego
        }
    }

    //Para que el jugador se mueva en función de las actualizaciones de física
    void FixedUpdate()
    {
        control_Jugador.MovePosition(control_Jugador.position + direccion * Time.fixedDeltaTime);

        //Para hacer el cambio entre estos carriles
        Vector3 posicion = transform.position.z * transform.forward + transform.position.y * transform.up;
        if (carril == 0)
        {
            posicion += Vector3.left * distancia_carriles; //Nuestro personaje se mueve a la izquierda
        }
        else if (carril == 2)
        {
            posicion += Vector3.right * distancia_carriles; //Nuestro personaje se mueve a la derecha
        }
        transform.position = posicion;
    }

    //Para modificar la vida del personaje
    public void ModificarVida(int vida)
    {
        Vida_actual = Mathf.Clamp(Vida_actual + vida, 0, Vida_maxima);

        if (Vida_actual == 3)
        {
            Salud_nivel2.instancia.MostrarVida3();
        }

        if (Vida_actual == 2)
        {
            Salud_nivel2.instancia.MostrarVida2();
        }
        if (Vida_actual == 1)
        {
            Salud_nivel2.instancia.MostrarVida1();
        }
        if (Vida_actual == 0)
        {
            gameover = true; //El jugador ya perdió la partida
            Segundo_nivel.Recopilacion();
            Salud_nivel2.instancia.MostrarVida0();
        }
    }

    //Para que el personaje se detenga en caso de que se presione el boton de pausa
    public void Detener()
    {
        forwardSpeed = 0;
        animator.enabled = false;
    }

    //Para que el personaje siga avanzando en el caso de que se reanude el juego
    public void Acelerar()
    {
        forwardSpeed = 10f;
        animator.enabled = true;
    }

    //Cuando el jugador pierde todas sus vidas
    public void GameOver()
    {
        forwardSpeed = 0;
        animator.enabled = false;

        Segundo_nivel.MostrarGameOver();
    }

    //Para reproducir un sonido
    public void PlaySound(AudioClip clip)
    {
        audioSource.PlayOneShot(clip);
    }
}