using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using DG.Tweening;



// キャラクターの動き、パラメータ、フラグ
public class UnitManager_Test : MonoBehaviour
{
    // 戦わせるモンスターをセット
    [SerializeField] PokemonBase _base;
    [SerializeField] bool isPlayerUnit;

    // レベルに応じたモンスターを共有できるようにプロパティ
    public Pokemon pokemon { get; set; }


    // ステータス（定義）

    // 名前
    public new string name;
    // HP
    public int hp;
    // 攻撃力
    public int at;
    // GAUGE
    public int gauge;






    // フラグ
    public bool isDead; // 死亡フラグ
    bool isPlayer; // 自分のモンスターかフラグ
    public bool isGauge; // GAUGEがあるかフラグ


    float px;


    private void Start()
    {
        // BattleSystemで使うからプロパティに入れる
        pokemon = new Pokemon(_base);

        name = pokemon.Base.Name;
        hp = pokemon.HP;
        at = pokemon.Attack;
        gauge = pokemon.GAUGE;
        isPlayer = isPlayerUnit;

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



    void Update()
    {

    }








    // 自分のモンスターか
    public void Init(bool isPlayer)
    {
        // 自分のモンスターかフラグに正誤を入れる
        this.isPlayer = isPlayer;
    }









    // 攻撃
    public void Attack(UnitManager_Test enemy, int enemyCommand, bool enemyDefensedFlag, bool enemySkillFlag)
    {

        // 攻撃アニメーション
        AttackAnimation();
        // ダメージを与える
        enemy.OnDamage(at, enemyCommand, enemyDefensedFlag, enemySkillFlag);
    }


    // 攻撃アニメーション
    void AttackAnimation()
    {
        // path変数に座標を入れる (1.0, 0.0, 0.0)
        // 右に揺れる
        Vector3[] path = { Vector3.right };

        // 自分のモンスターでないなら
        if (!isPlayer)
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
            hp = hp - (damage * 2);
        }
        // 敵がこうげきのとき
        else if ((enemyCommand == 1) | (enemyCommand == 3 & enemySkillFlag))
        {
            // HP = HP-ダメージ
            hp -= damage;
        }
        // 敵がぼうぎょのとき
        else if (enemyCommand == 2 & enemyDefensedFlag)
        {

        }
        // 敵がチャージのとき
        else if (enemyCommand == 4)
        {
            // HP = HP-(ダメージ ×1.5)
            hp = hp - (damage + (damage / 2));
        }

        // HPが0以下になったら
        if (hp <= 0)
        {
            // 死亡フラグ　ON
            isDead = true;
            // HPを0にする
            hp = 0;
        }
    }





    public void Defence(UnitManager_Test unit)
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
            gauge = 0;
        }
        // こうげき、ぼうぎょのとき
        else
        {
            gauge -= 20;
        }

        // ゲージがあるか　更新
        if (gauge > 0)
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
        gauge += 20;

        // ゲージがあるかフラグ　true
        isGauge = true;
    }




    // スキル
    public void Skill(UnitManager_Test enemy, int enemyCommand, bool enemyDefensedFlag, bool enemySkillFlag)
    {
        // 攻撃アニメーション
        AttackAnimation();
        // ダメージを与える
        if (gauge == 0)
        {
            enemy.OnDamage((at), enemyCommand, enemyDefensedFlag, enemySkillFlag);
        }
        else if (gauge == 60)
        {
            enemy.OnDamage((at * 2 + (at / 2)), enemyCommand, enemyDefensedFlag, enemySkillFlag);
        }
        else if (gauge == 100)
        {
            enemy.OnDamage((at * 3 + (at / 2)), enemyCommand, enemyDefensedFlag, enemySkillFlag);
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
