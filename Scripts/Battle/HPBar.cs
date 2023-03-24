using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

// HPの増減を描画
public class HPBar : MonoBehaviour
{
    [SerializeField] Slider hpSlider;

    public void SetHP(float hpNormalized)
    {
        // HPバーの最大値をキャラクターのHPにする
        hpSlider.maxValue = hpNormalized;
        // HPをキャラクターのHPにする
        hpSlider.value = hpNormalized;
    }
}
