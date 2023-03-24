using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

// バトルで使うモンスターを保持
// モンスターの画像を反映
public class BattleUnit : MonoBehaviour
{
    // 戦わせるモンスターをセット
    [SerializeField] PokemonBase _base;
    [SerializeField] bool isPlayerUnit;

    // レベルに応じたモンスターを共有できるようにプロパティ
    public Pokemon pokemon { get; set; }

    public void Setup()
    {
        // BattleSystemで使うからプロパティに入れる
        pokemon = new Pokemon(_base);
        // 画像
        if (isPlayerUnit)
        {
            GetComponent<Image>().sprite = pokemon.Base.BackSprite;
        }
        else
        {
            GetComponent<Image>().sprite = pokemon.Base.FrontSprite;
        }
    }
}
