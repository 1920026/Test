using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using DG.Tweening;

public class BattleText_Test : MonoBehaviour
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

    public void WildSpawn(BattleUnit_Test enemyUnit)
    {
        text.text = "";
        text.DOText("あ！　野生の\r\n" + enemyUnit.pokemon.Base.Name + "が　とびだしてきた！", 2f).SetEase(Ease.Linear);
    }

    public void Serve(BattleUnit_Test playerUnit)
    {
        text.text = "";
        text.DOText("ゆけっ！　" + playerUnit.pokemon.Base.Name + "！", 0.7f).SetEase(Ease.Linear);
    }

    public void Select(BattleUnit_Test playerUnit)
    {
        text.text = playerUnit.pokemon.Base.Name + "は　どうする？";
    }

    public void Attack(BattleUnit_Test Unit)
    {
        text.text = "";
        text.DOText(Unit.pokemon.Base.Name + "の\r\nこうげき", 0.3f).SetEase(Ease.Linear);

    }

    public void Defence(BattleUnit_Test Unit)
    {
        text.text = "";
        text.DOText(Unit.pokemon.Base.Name + "の\r\nぼうぎょ", 0.3f).SetEase(Ease.Linear);

    }

    public void Failure()
    {
        text.text = "";
        text.DOText("しかし　うまくきまらなかった", 0.3f).SetEase(Ease.Linear);
    }

    public void Skill(BattleUnit_Test Unit)
    {
        text.text = "";
        text.DOText(Unit.pokemon.Base.Name + "の\r\nスキル", 0.3f).SetEase(Ease.Linear);
    }

    public void Charge(BattleUnit_Test Unit)
    {
        text.text = "";
        text.DOText(Unit.pokemon.Base.Name + "は\r\nチャージした", 0.3f).SetEase(Ease.Linear);

    }

    public void End(BattleUnit_Test Unit)
    {
        text.text = "";
        text.DOText(Unit.pokemon.Base.Name + "は\r\nたおれた", 0.3f).SetEase(Ease.Linear);

    }
}
