using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.Audio;
using UnityEngine.SceneManagement;

public class MainPanel : MonoBehaviour
{
    [Header("Options")]
    public Slider volumeFx;
    public Slider volumeMaster;
    public Toggle mute;
    public AudioMixer mixer;
    public AudioSource fxSource;
    public AudioClip clickSound;
    private float lastvolume;
    [Header("Panels")]
    public GameObject mainPanel;
    public GameObject optionsPanel;

    private void Awake()
    {
        volumeFx.onValueChanged.AddListener(ChangevolumeFx);
        volumeMaster.onValueChanged.AddListener(ChangevolumeMaster);
    }

    public void Jugar()
    {
        SceneManager.LoadScene("Menu_niveles");
        gameObject.SetActive(false);
    }

    public void ExitGame()
    {
        Application.Quit();
    }

    public void SetMute()
    {
        if (mute.isOn)
        {
            mixer.GetFloat("VolMaster", out lastvolume);
            mixer.SetFloat("VolMaster", -80);
        }
        else
            mixer.SetFloat("VolMaster", lastvolume);
    }

    public void openPanel(GameObject panel)
    {
        mainPanel.SetActive(false);
        optionsPanel.SetActive(false);


        panel.SetActive(true);
        PlaySoundButton();
    }

    public void ChangevolumeMaster(float v)
    {
        mixer.SetFloat("VolMaster", v);
    }
    public void ChangevolumeFx(float v)
    {
        mixer.SetFloat("VolFX", v);
    }
    public void PlaySoundButton()
    {
        fxSource.PlayOneShot(clickSound);
    }
}
