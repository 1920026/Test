using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using DG.Tweening;

// Hud の描画、更新
public class BattleHud_Test : MonoBehaviour
{
    [SerializeField] Text nameText;
    [SerializeField] Slider hpSlider;
    [SerializeField] Slider gaugeSlider;

    public void SetData(Pokemon pokemon)
    {
        // プレートの名前をキャラクターの名前にする
        nameText.text = pokemon.Base.Name;
        // HPバーの最大値をレベルに応じたキャラクターのHPにする
        hpSlider.maxValue = pokemon.MaxHp;
        //  今のHPをレベルに応じたキャラクターのHPにする
        hpSlider.value = pokemon.HP;
        // ゲージの最大値をレベルに応じたキャラクターのHPにする
        gaugeSlider.maxValue = pokemon.FirstGauge;
        //  今のHPをレベルに応じたキャラクターのHPにする
        gaugeSlider.value = pokemon.GAUGE;
    }


    public void UpdateGAUGE(Pokemon pokemon)
    {
        // GAUGEバーを0.5秒でキャラクターの今のGAUGEにする
        gaugeSlider.DOValue(pokemon.GAUGE, 0.5f);

    }


    // HPバー　更新
    public void UpdateHP(Pokemon pokemon)
    {
        // HPバーを0.9秒でキャラクターの今のHPにする
        hpSlider.DOValue(pokemon.HP, 0.9f);
    }
}
