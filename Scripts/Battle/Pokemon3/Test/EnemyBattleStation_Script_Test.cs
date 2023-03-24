using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class EnemyBattleStation_Script_Test : MonoBehaviour
{

    public UnitUIManager_Test enemyUI;

    int count;
    public bool textFlag;

    void Update()
    {
        if (transform.position.x < -65.0f)
        {
            transform.Translate(0.2f, 0, 0);

        }
        // enemyMonssterが指定位置に来たら
        else if (enemyUI.transform.position.x < -74.0f)
        {
            ++count;
            // 1回のみ通す
            if (count == 1)
            {
                textFlag = true;
            }

            enemyUI.transform.Translate(0.4f, 0, 0);
        }


    }
}
