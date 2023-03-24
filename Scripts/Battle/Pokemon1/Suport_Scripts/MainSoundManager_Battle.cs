using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MainSoundManager_Battle : MonoBehaviour
{

    void Start()
    {
        StartCoroutine(MainSound());


    }


    void Update()
    {

    }

    IEnumerator MainSound()
    {
        yield return new WaitForSeconds(9.9f);
        // BGM再生
        GetComponent<AudioSource>().Play();

    }
}
