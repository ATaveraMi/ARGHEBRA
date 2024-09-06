using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using TMPro;
using UnityEngine.SceneManagement;
using UnityEngine.Networking;
using System.Data.Common;



public class Disprar : MonoBehaviour
{
    public int scoretxt;
    public TextMeshProUGUI instructionalText;

    float x = -97.8f;
    float y = 2.1f;
    float z = -0.95f;
    public float scale = 0.06f;
    private GameObject currentShape;
    private int shapeIndex = 0; // 0: Triangle, 1: Rectangle, 2: Sphere
    private int challengeIndex = 0;
    public GameObject tornadoPrefab;
    public GameObject islaPrefab;
    public GameObject raftPrefab;
    private GameObject currentChallenge;
    private float moveSpeed = -2f;
    private List<GameObject> activeChallenges = new List<GameObject>();
    public Canvas ScoreCanva;
    public GameObject Ship;
    private float spawnDelay = 1.3f;
    public float speedIncrease = -.1f; // Cuánto incrementar la velocidad cada segundo
    private float maxSpeed = -250f; // Velocidad máxima
    public bool mandarDatos;
    public GameObject gameOver;

    public static Disprar instance;

    public static int score = 0; // Puntuación del jugador
    public TextMeshProUGUI scoreText;

    public GameObject Panel_opciones;

    public GameObject gameOverscene;
    public Timer timer;


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
        
    }


    public void Pausar()
    {
        
        Panel_opciones.SetActive(true); //Con esto activamos el panel de opciones para poder reanudar, reiniciar o salir
        Ship.SetActive(false);
        for (int i = activeChallenges.Count - 1; i >= 0; i--)
        {
            activeChallenges[i].SetActive(false);
        }
        Time.timeScale = 0;
        currentShape.SetActive(false);
        Debug.Log("Si funciona");
       

    }

    public void UnPause()
    {
        Panel_opciones.SetActive(false); //Con esto activamos el panel de opciones para poder reanudar, reiniciar o salir
        Ship.SetActive(true);
        Time.timeScale = 1;
        currentShape.SetActive(true);
        Debug.Log("Si funciona");
        for (int i = activeChallenges.Count - 1; i >= 0; i--)
        {
            activeChallenges[i].SetActive(true);
        }
        Debug.Log("Hola");
    }
    public void ReiniciarNivel()
    {
        if (ScoreManager1.instance != null)
        {
            ScoreManager1.instance.sendScore();  // Llama a sendScore cuando el juego se detiene
        }
        score = 0;
        
        SceneManager.LoadScene("PrimerNivel_cambio");
        //Time.timeScale = 1;
        //scoreText.text="";


    }
    public void RegresarMenu()
    {
        if (ScoreManager1.instance != null)
        {
            ScoreManager1.instance.sendScore();  // Llama a sendScore cuando el juego se detiene
        } //Mandamos el tiempo y score al servidor

        SceneManager.LoadScene("Menu_niveles");
        //gameObject.SetActive(false);
        
    }

    // Start is called before the first frame update
    void Start()
    {
        ShowInstruction();
        /*if (scoreText == null)
        {
            scoreText = GameObject.FindWithTag("Score").GetComponent<TMP_Text>();
            if (scoreText == null)
            {
                Debug.LogError("Failed to find score text component.");
            }
        }*/
        ScoreManager1.instance.UpdateScoreText();  // Actualiza el texto de puntuación al iniciar
        mandarDatos = true;
        CreateTriangle();
        StartCoroutine(SpawnChallengeRoutine());
    }
    void ShowInstruction()
    {
        // Establece el mensaje
        instructionalText.text = "Usa las flechas para cambiar de figura. Dispara con la barra espaciadora.";
        StartCoroutine(ClearTextAfterTime(7));  // Llama a la Coroutine para limpiar el texto después de 7 segundos
    }

    IEnumerator ClearTextAfterTime(float time)
    {
        yield return new WaitForSeconds(time);
        instructionalText.text = "";  // Limpia el texto
    }


    void CreateSphere()
    {
        currentShape = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
        currentShape.transform.position = new Vector3(x, 2.125f, z);
        currentShape.transform.localScale = new Vector3(0.1f, 0.1f, 0.1f);
        currentShape.GetComponent<Renderer>().material.color = Color.yellow;

    }
    public void MostrarGameOver()
    {
        gameOver.SetActive(true);


    }
    public void GameOver()
    {
        Time.timeScale = 0;
        gameOverscene.SetActive(true);
        if (ScoreManager1.instance != null)
        {
            ScoreManager1.instance.sendScore();  // Llama a sendScore cuando el juego se detiene
        }
        Invoke("MostrarGameOver", 3);

        

        /* if (timer1 != null)
         {
             timer1.PausarTiempo();
         }*/


        //Primer_nivel.MostrarGameOver();
    }

    void CreateRectangle()
    {
        currentShape = GameObject.CreatePrimitive(PrimitiveType.Cube);

        currentShape.transform.localScale = new Vector3(0.1f, 0.075f, 0.25f);
        currentShape.transform.position = new Vector3(x, y, z);

        currentShape.GetComponent<Renderer>().material.color = Color.green;
        BoxCollider boxCollider = currentShape.GetComponent<BoxCollider>();
        if (boxCollider != null)
        {
            // Ajusta el tamaño del BoxCollider aquí
            boxCollider.size = new Vector3(4, 2, 2); // Ajusta estos valores según necesites
        }



    }


    void CreateTriangle()
    {
        currentShape = new GameObject("Pyramid");
        MeshFilter meshFilter = currentShape.AddComponent<MeshFilter>();
        MeshRenderer meshRenderer = currentShape.AddComponent<MeshRenderer>();

        Mesh mesh = new Mesh();

        // Definir los vértices de la pirámide
        Vector3[] vertices = new Vector3[]
        {
        new Vector3(0, 1, 0),    // Vértice superior
        new Vector3(-1, -1, 1),  // Esquina base 1
        new Vector3(1, -1, 1),   // Esquina base 2
        new Vector3(1, -1, -1),  // Esquina base 3
        new Vector3(-1, -1, -1)  // Esquina base 4
        };

        // Definir los triángulos que componen las 4 caras de la pirámide
        int[] triangles = new int[]
        {
        // Base (cuadrado)
        1, 2, 3,
        1, 3, 4,
        // Lados (triángulos)
        0, 1, 2,
        0, 2, 3,
        0, 3, 4,
        0, 4, 1
        };


        mesh.vertices = vertices;
        mesh.triangles = triangles;


        mesh.RecalculateNormals();

        meshRenderer.material = new Material(Shader.Find("Standard"));
        meshRenderer.material.color = Color.red;

        meshFilter.mesh = mesh;
        currentShape.transform.position = new Vector3(x, y, z);
        currentShape.transform.localScale = Vector3.one * scale;

        BoxCollider boxCollider = currentShape.AddComponent<BoxCollider>();

        boxCollider.size = new Vector3(3, 1, 3);
        boxCollider.center = new Vector3(0, 0, 0);


    }

    void FireShape()
    {
        Rigidbody rb = currentShape.GetComponent<Rigidbody>();
        if (rb == null)
        {
            rb = currentShape.AddComponent<Rigidbody>();
        }

        // Asegura que el objeto pueda moverse libremente
        rb.isKinematic = false;
        rb.useGravity = false;
        rb.mass = 1;



        rb.AddForce(3000, 0, 0); // Fuerza negativa en el eje x para disparar hacia la derecha

        Destroy(currentShape, .6f);
    }




    IEnumerator SpawnChallengeRoutine()
    {
        while (true) // Bucle infinito, cambia esto si quieres detener la generación en algún punto
        {
            yield return new WaitForSeconds(2f); // Espera 2 segundos

            // Limpia la lista de cualquier objeto que haya sido destruido
            activeChallenges.RemoveAll(item => item == null);



            if (activeChallenges.Count < 3)
            {
                SpawnRandomObject();
            }
        }
    }

    void IncrementSpeed()
    {
        if (moveSpeed > maxSpeed)
        {
            moveSpeed -= speedIncrease; // Disminuye el valor (aumenta la velocidad) con cuidado
        }
    }
    void SpawnRandomObject()
    {
        GameObject[] prefabs = { tornadoPrefab, islaPrefab, raftPrefab };
        int index = Random.Range(0, prefabs.Length);
        Vector3 spawnPosition = new Vector3(-45, 2.06f, -0.95f); // Posición predeterminada

        if (prefabs[index] == islaPrefab)
        {
            spawnPosition.z = -2.4f;
            spawnPosition.y = 2.4f;
        }

        GameObject newChallenge = Instantiate(prefabs[index], spawnPosition, Quaternion.identity);

        if (prefabs[index] == raftPrefab)
        {
            newChallenge.transform.rotation = Quaternion.Euler(90, 90, 0);
        }
        else if (prefabs[index] == islaPrefab)
        {
            newChallenge.transform.rotation = Quaternion.Euler(0, 180, 0);
        }

        activeChallenges.Add(newChallenge);
        IncrementSpeed(); // Incrementa la velocidad cada vez que se crea un nuevo desafío
    }





    // Update is called once per frame
    void Update()
    {


        if (Input.GetKeyDown(KeyCode.RightArrow))
        {
            ChangeShape(1); // Cambia a la siguiente forma
        }
        else if (Input.GetKeyDown(KeyCode.LeftArrow))
        {
            ChangeShape(-1); // Regresa a la forma anterior
        }
        else if (Input.GetKeyDown(KeyCode.Space) && currentShape != null)
        {
            FireShape();

            if (shapeIndex == 0)
            {
                CreateTriangle();
            }
            else if (shapeIndex == 1)
            {
                CreateRectangle();
            }
            else
            {
                CreateSphere();
            }
        }

        /* if (moveSpeed > maxSpeed) // Recuerda que moveSpeed es negativo, por eso usamos > en lugar de <
         {
             moveSpeed += speedIncrease * Time.deltaTime; // Ajusta la velocidad basándose en speedIncrease y deltaTime
         }*/

        for (int i = activeChallenges.Count - 1; i >= 0; i--)
        {
            if (activeChallenges[i] != null)
            {
                if (activeChallenges[i].transform.position.x <= -95)
                {
                    // Llama a GameOver y detén el juego completamente.
                    if (mandarDatos)
                    {
                        mandarDatos = false;
                        GameOver();
                    }
                    Time.timeScale = 0; // Detiene la escala de tiempo, pausando todas las operaciones basadas en el tiempo
                    return; // Sale de Update para evitar ejecutar código adicional después de GameOver
                }

                // Usa moveSpeed, que ahora se incrementa con el tiempo

            }
            else
            {
                // Elimina el desafío de la lista si ha sido destruido
                activeChallenges.RemoveAt(i);
            }
            activeChallenges[i].transform.position += new Vector3(-0.1f,0,0);
            
        }
    }


    void ChangeShape(int direction)
    {
        // Destruye la forma actual si existe
        if (currentShape != null)
        {
            Destroy(currentShape);
        }

        shapeIndex = (shapeIndex + direction + 3) % 3;

        // Crea la nueva forma 
        switch (shapeIndex)
        {
            case 0:
                CreateTriangle();
                break;
            case 1:
                CreateRectangle();
                break;
            case 2:
                CreateSphere();
                break;
        }
    }



}