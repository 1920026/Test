using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using DG.Tweening;

public class TextBox_Script : MonoBehaviour
{
    Text text;



    void Start()
    {
        text = gameObject.GetComponent<Text>();
    }


    void Update()
    {

    }



    public void None()
    {
        text.text = "";
    }

    public void WildSpawn(UnitManager enemyMonster)
    {
        text.text = "";
        text.DOText("あ！　野生の\r\n" + enemyMonster.name + "が　とびだしてきた！", 2f).SetEase(Ease.Linear);
    }

    public void Serve(UnitManager playerMonster)
    {
        text.text = "";
        text.DOText("ゆけっ！　" + playerMonster.name + "！", 0.7f).SetEase(Ease.Linear);
    }

    public void Select(UnitManager playerMonster)
    {
        text.text = playerMonster.name + "は　どうする？";
    }

    public void Attack(UnitManager Monster)
    {
        text.text = "";
        text.DOText(Monster.name + "の\r\nこうげき", 0.3f).SetEase(Ease.Linear);

    }

    public void Defence(UnitManager Monster)
    {
        text.text = "";
        text.DOText(Monster.name + "の\r\nぼうぎょ", 0.3f).SetEase(Ease.Linear);

    }

    public void Failure()
    {
        text.text = "";
        text.DOText("しかし　うまくきまらなかった", 0.3f).SetEase(Ease.Linear);
    }

    public void Skill(UnitManager Monster)
    {
        text.text = "";
        text.DOText(Monster.name + "の\r\nスキル", 0.3f).SetEase(Ease.Linear);
    }

    public void Charge(UnitManager Monster)
    {
        text.text = "";
        text.DOText(Monster.name + "は\r\nチャージした", 0.3f).SetEase(Ease.Linear);

    }

    public void End(UnitManager Monster)
    {
        text.text = "";
        text.DOText(Monster.name + "は\r\nたおれた", 0.3f).SetEase(Ease.Linear);

    }

    public void Escape()
    {
        text.text = "";
        text.DOText("うまく　にげきれた", 0.3f).SetEase(Ease.Linear);
    }
}
