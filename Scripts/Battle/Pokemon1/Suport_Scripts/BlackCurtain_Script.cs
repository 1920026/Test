using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class BlackCurtain_Script : MonoBehaviour
{
    // 子オブジェクトを受け取るための変数
    GameObject up;
    GameObject down;

    // スピードの変数
    private float x;


    void Start()
    {
        // 子オブジェクトを変数に代入
        this.up = transform.GetChild(0).gameObject;
        this.down = transform.GetChild(1).gameObject;
    }


    void Update()
    {
        x += 0.002f;

        // 上カーテン　移動
        if (up.transform.position.y < 10)
        {
            up.transform.Translate(0, x, 0);
        }

        // 下カーテン　移動
        if (down.transform.position.y > -10)
        {
            down.transform.Translate(0, -x, 0);
        }

        else
        {
            // 消去
            Destroy(gameObject);
        }




    }
}
