using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class White_Script : MonoBehaviour
{

    SpriteRenderer spriteRenderer;


    void Start()
    {

    }


    void Update()
    {

    }



    // 色（透明度）変化
    // White_Scriptクラスを持つWhiteオブジェクトを引数へ
    public IEnumerator Change(White_Script white)
    {
        for (float i = 1; i >= 0; i -= 0.015f)
        {
            // その引数のSpriteRenderコンポーネントを使う
            spriteRenderer = white.GetComponent<SpriteRenderer>();
            spriteRenderer.color = new Color(255, 255, 255, i);
            yield return new WaitForSeconds(0.01f);
        }
        Destroy(gameObject);
    }
}
