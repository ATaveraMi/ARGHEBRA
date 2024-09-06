using System.Collections;
using System.Collections.Generic;
using UnityEngine;


[System.Serializable] //Para que pueda viajar porla red, se convierte en una serie de unos y ceros

public class TimeScore
{
    public int score;
    public float time;
    public int level;
    public int jugador_id;
}