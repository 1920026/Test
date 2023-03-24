using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Trainer_Script_Test : MonoBehaviour
{
    // 親を取得するための変数
    GameObject parentGameObject;
    // SpritRender変数(写真　操作)
    SpriteRenderer MainspriteRenderer;

    // PlayerBattleStation_Scriptを取得するための変数
    // public BattleManager battleManager;
    [SerializeField] BattleManager_Test battleManager_Test;

    // 写真　取得
    public Sprite image_2;
    public Sprite image_3;
    public Sprite image_4;

    // 写真変更フラグ　生成
    bool ImageChangeFlag = false;
    // ボールフラグ
    public bool BallFlag = false;






    void Start()
    {
        // 1つ上の親を変数に代入
        parentGameObject = transform.parent.gameObject;
        // SpriteRenderを変数に代入
        MainspriteRenderer = gameObject.GetComponent<SpriteRenderer>();
    }


    void Update()
    {
        // トレーナー移動フラグがONなら
        if (battleManager_Test.TrainerMoveFlag)
        {
            // 左　移動
            transform.Translate(-0.15f, 0, 0);

            // 写真変更フラグがOFFなら
            if (!ImageChangeFlag)
            {
                // 写真変更フラグをON
                ImageChangeFlag = true;
                // 写真変更
                Change();
            }
        }
        // 指定位置を過ぎたら
        if (transform.position.x < -90)
        {   // トレーナー移動フラグ　OFF
            battleManager_Test.TrainerMoveFlag = false;
            // 消去
            Destroy(gameObject);
        }


    }








    // 写真変更
    void Change()
    {
        // コルーチン内で、写真変更
        StartCoroutine(ImageChange());
    }

    IEnumerator ImageChange()
    {
        // 写真　変更
        MainspriteRenderer.sprite = image_2;
        // 秒　待機
        yield return new WaitForSeconds(0.8f);
        // 写真　変更
        MainspriteRenderer.sprite = image_3;
        // 秒　待機
        yield return new WaitForSeconds(0.2f);
        // ちょっと右
        transform.Translate(1.6f, 0, 0);
        // 写真　変更
        MainspriteRenderer.sprite = image_4;
        // ボールフラグ　ON
        BallFlag = true;
    }
}
