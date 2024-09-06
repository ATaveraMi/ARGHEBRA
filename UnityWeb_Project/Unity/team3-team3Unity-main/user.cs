using System.Collections;
using System.Collections.Generic;
using UnityEngine;


[System.Serializable] //Para que pueda viajar porla red, se convierte en una serie de unos y ceros
public class user
{
    public string name; //Esto lo cambie por el momento a int pero estaba en string
    public string number;
    // public string gender;

    // public List<level> levels;

    // public override string ToString()
    // {
    //     string txt = "USER:\n";
    //     txt += "Nombre: " + nombre.ToString() + "\n";
    //     txt += "Lista: " + lista.ToString() + "\n";
    //     txt += "GENDER: " + gender.ToString() + "\n";

    //     foreach (level level in levels)
    //         txt += level.ToString() + "\n";

    //     return txt;
    // }
}
