using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Disapper : MonoBehaviour
{
    [SerializeField] PlayerController playerController;

    public bool end;

    void Start()
    {
        playerController.OnDisappered += Disappered;
    }

    void Disappered()
    {
        //Destroy(gameObject);
        end = true;
        gameObject.GetComponent<SpriteRenderer>().color = new Color(0, 0, 0, 1);
    }
}
