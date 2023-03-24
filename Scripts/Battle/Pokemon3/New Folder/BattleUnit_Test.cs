using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using DG.Tweening;

public class BattleUnit_Test : MonoBehaviour
{
    // 戦わせるモンスターをセット
    [SerializeField] PokemonBase _base;
    [SerializeField] bool isPlayerUnit;

    // レベルに応じたモンスターを共有できるようにプロパティ
    public Pokemon pokemon { get; set; }

    float px;

    public bool isDead; // 死亡フラグ
    public bool isGauge; // GAUGEがあるかフラグ



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
            // GetComponent<Image>().color = new Color(0.4f, 0.4f, 0.4f, 1);
        }
    }









    // 攻撃
    public void Attack(BattleUnit_Test enemyUnit, int enemyCommand, bool enemyDefensedFlag, bool enemySkillFlag)
    {

        // 攻撃アニメーション
        AttackAnimation();
        // ダメージを与える
        enemyUnit.OnDamage(pokemon.Attack, enemyCommand, enemyDefensedFlag, enemySkillFlag);
    }


    // 攻撃アニメーション
    void AttackAnimation()
    {
        // path変数に座標を入れる (1.0, 0.0, 0.0)
        // 右に揺れる
        Vector3[] path = { Vector3.right };

        // 自分のモンスターでないなら
        if (!isPlayerUnit)
        {
            // x座標に-1をかける　反転
            // 左に揺れる
            path[0] = -path[0];
        }

        // 座標変更
        // transform.DOLocalPath((x座標, y座標, z座標), 秒).往復
        transform.DOLocalPath(path, 0.3f).SetOptions(true);
    }


    // ダメージを与える
    public void OnDamage(int damage, int enemyCommand, bool enemyDefensedFlag, bool enemySkillFlag)
    {
        // 敵が技失敗のとき
        if ((enemyCommand == 2 & !enemyDefensedFlag) | (enemyCommand == 3 & !enemySkillFlag))
        {
            // HP = HP-(ダメージ×2)
            pokemon.HP = pokemon.HP - (damage * 2);
        }
        // 敵がこうげきのとき
        else if ((enemyCommand == 1) | (enemyCommand == 3 & enemySkillFlag))
        {
            // HP = HP-ダメージ
            pokemon.HP -= damage;
        }
        // 敵がぼうぎょのとき
        else if (enemyCommand == 2 & enemyDefensedFlag)
        {

        }
        // 敵がチャージのとき
        else if (enemyCommand == 4)
        {
            // HP = HP-(ダメージ ×1.5)
            pokemon.HP = pokemon.HP - (damage + (damage / 2));
        }

        // HPが0以下になったら
        if (pokemon.HP <= 0)
        {
            // 死亡フラグ　ON
            isDead = true;
            // HPを0にする
            pokemon.HP = 0;
        }
    }





    public void Defence(UnitManager unit)
    {

    }

    void DefenceAnimation()
    {


    }



    // ゲージ　消費
    public void ConsumptionGauge(int playerCommand)
    {
        // スキルのとき
        if (playerCommand == 3)
        {
            pokemon.GAUGE = 0;
        }
        // こうげき、ぼうぎょのとき
        else
        {
            pokemon.GAUGE -= 20;
        }

        // ゲージがあるか　更新
        if (pokemon.GAUGE > 0)
        {
            // ゲージがあるかフラグ　true
            isGauge = true;
        }
        else
        {
            // ゲージがあるかフラグ　false
            isGauge = false;
        }
    }


    // チャージ
    public void ChargeGauge()
    {
        pokemon.GAUGE += 20;

        // ゲージがあるかフラグ　true
        isGauge = true;
    }




    // スキル
    public void Skill(UnitManager enemy, int enemyCommand, bool enemyDefensedFlag, bool enemySkillFlag)
    {
        // 攻撃アニメーション
        AttackAnimation();
        // ダメージを与える
        if (pokemon.GAUGE == 0)
        {
            enemy.OnDamage((pokemon.Attack), enemyCommand, enemyDefensedFlag, enemySkillFlag);
        }
        else if (pokemon.GAUGE == 60)
        {
            enemy.OnDamage((pokemon.Attack * 2 + (pokemon.Attack / 2)), enemyCommand, enemyDefensedFlag, enemySkillFlag);
        }
        else if (pokemon.GAUGE == 100)
        {
            enemy.OnDamage((pokemon.Attack * 3 + (pokemon.Attack / 2)), enemyCommand, enemyDefensedFlag, enemySkillFlag);
        }
    }













    // 受け身アニメーション
    public void Shake()
    {
        // 揺れ
        // transform.DOShakePosition(秒, 強さ, 回数, ランダム, スナップ, フェードアウト)
        transform.DOShakePosition(0.3f, 0.5f, 20, 0, false, false);
    }





    // 出現
    public void spawn()
    {
        px = transform.position.x;

        transform.position = new Vector3(px, -3f, 0f);
        // 大きさを(0.0, 0.0, 0.0)にする
        transform.localScale = Vector3.zero;
        // UnityEditor.EditorApplication.isPaused = true;
        transform.DOMove(new Vector3(px, -1.5f, 0), 0.6f);
        // 大きさを0.3秒で(1.0, 1.0, 1.0)にする
        transform.DOScale(Vector3.one, 0.6f);
    }
}
