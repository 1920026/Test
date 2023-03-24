using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class BGMChange : MonoBehaviour
{
    public AudioSource audioSource;
    public AudioClip bgm0;
    public AudioClip bgm1;
    public AudioClip bgm2;
    public AudioClip battleBgm;

    [SerializeField] PlayerController playerController;
    [SerializeField] GameController gameController;

    int count = 1;

    void Start()
    {
        playerController.OnBgmChanged += BgmChange;
        gameController.OnBgmChanged += BgmChange;
    }


    void BgmChange(string field)
    {

        if (field == "RPG")
        {
            if (count == -1)
            {
                audioSource.Stop();
                audioSource.clip = bgm0;
            }
            else if (count == 1)
            {
                audioSource.Stop();
                audioSource.clip = bgm1;
            }
            count = -count;
            audioSource.Play();
        }
        else if (field == "Battle")
        {
            count = -count;
            audioSource.Stop();
            audioSource.clip = battleBgm;
            audioSource.volume = 0.2f;
            StartCoroutine(BattleBgm());
        }
        else if (field == "Off")
        {
            audioSource.Stop();
            audioSource.volume = 0.1f;
            audioSource.PlayOneShot(bgm2);
        }
    }

    IEnumerator BattleBgm()
    {
        yield return new WaitForSeconds(12.4f);
        audioSource.Play();
        audioSource.loop = true;
    }
}
