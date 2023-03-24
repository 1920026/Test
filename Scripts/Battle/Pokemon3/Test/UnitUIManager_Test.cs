using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using DG.Tweening;



// プレートの動き
public class UnitUIManager_Test : MonoBehaviour
{
    // 名前欄
    public Text NameText;
    // HPバー
    public Slider hpSlider;
    // GAUGEバー
    public Slider gaugeSlider;









    // プレート作成
    public void Init(UnitManager_Test unit)
    {
        // プレートの名前をキャラクターの名前にする
        NameText.text = unit.name;
        // HPバーの最大値をキャラクターのHPにする
        hpSlider.maxValue = unit.hp;
        // HPをキャラクターのHPにする
        hpSlider.value = unit.hp;
        // GAUGEを1にする
        gaugeSlider.value = unit.gauge;
    }



    public void UpdateGAUGE(UnitManager_Test unit)
    {
        // GAUGEバーを0.5秒でキャラクターの今のGAUGEにする
        gaugeSlider.DOValue(unit.gauge, 0.5f);

    }




    // HPバー　更新
    public void UpdateHP(UnitManager_Test unit)
    {
        // HPバーを0.9秒でキャラクターの今のHPにする
        hpSlider.DOValue(unit.hp, 0.9f);
    }
}
