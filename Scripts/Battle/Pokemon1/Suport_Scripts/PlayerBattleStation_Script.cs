using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class PlayerBattleStation_Script : MonoBehaviour
{


    // プレート　取得
    public UnitUIManager playerUI;
    public ObjectGenerator objectGenerator;



    // カウント変数
    int count;


    void Update()
    {
        count += 1;

        // フィールド　移動
        if (transform.position.x > -74)
        {
            // 左へ
            transform.Translate(-0.2f, 0, 0);

        }
        // プレート　移動
        else if (playerUI.transform.position.x > -65 && objectGenerator.plateFlag)
        {
            // 左へ
            playerUI.transform.Translate(-0.3f, 0, 0);
        }
    }

}
