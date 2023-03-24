using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Grass_Script : MonoBehaviour
{
    void Update()
    {
        if (transform.position.x > -500.0f)
        {
            transform.Translate(-1.8f, -0.03f, 0);
        }
        else
        {
            Destroy(gameObject);
        }
    }
}
