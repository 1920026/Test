using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MonsterBall_Script : MonoBehaviour
{

    // 変数
    int count;
    float acc = -0.0375f;
    float vel = 0.3f;
    float px;
    float py;

    public AudioSource audioSource;
    public AudioClip sound;


    public bool spawnFlag = false;


    void Start()
    {
        audioSource.PlayOneShot(sound);
    }


    void Update()
    {
        count += 1;

        // 回転
        transform.Rotate(new Vector3(0, 0, 40));

        if (0 < count && count < 5)
        {
            px = 0.2f;
        }
        else if (5 <= count && count < 38)
        {
            px = 0.07f;
            acc = -0.01f;
        }
        else if (38 <= count && count < 54)
        {
            px = 0.15f;
            acc = -0.06f;
        }
        else
        {
            spawnFlag = true;
            Destroy(gameObject);

        }

        vel += acc;
        py = vel;
        transform.Translate(px, py, 0, Space.World);
    }
}
