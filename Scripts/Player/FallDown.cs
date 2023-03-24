using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class FallDown : MonoBehaviour
{
    public AudioSource audioSource;
    [SerializeField] PlayerController playerController;

    void Start()
    {
        playerController.OnFalled += Falled;
    }

    void Falled()
    {
        playerController.transform.position = new Vector3(1000.5f, 1000.8f, 0);
        audioSource.Stop();
    }
}
