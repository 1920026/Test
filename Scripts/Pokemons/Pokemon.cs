using System.Collections;
using System.Collections.Generic;
using UnityEngine;

// レベルに応じたステータスの違うモンスターを生成するクラス
// データのみ
public class Pokemon
{
    // ベースとなるデータ
    public PokemonBase Base { get; set; }

    public int HP { get; set; }
    public int GAUGE { get; set; }

    // コンストラクター：生成時の初期設定
    // ベースのデータを変数に代入
    public Pokemon(PokemonBase pBase)
    {
        // レベルに応じたBase
        Base = pBase;
        // レベルに応じたHP
        HP = MaxHp;
        // レベルに応じたGauge
        GAUGE = FirstGauge;
    }

    // プロパティ
    // レベルに応じたステータスを返す
    // 処理を加える
    public int Attack
    {
        get { return Mathf.FloorToInt(Base.Attack); }
    }
    public int Defense
    {
        get { return Mathf.FloorToInt(Base.Defense); }
    }
    public int MaxHp
    {
        get { return Mathf.FloorToInt(Base.MaxHp); }
    }
    public int FirstGauge
    {
        get { return Mathf.FloorToInt(Base.FirstGauge * 20); }
    }
    public int Speed
    {
        get { return Mathf.FloorToInt(Base.Speed); }
    }

}
