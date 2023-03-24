using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using DG.Tweening;


// ジェネレータースクリプト（工場）
public class ObjectGenerator_Test : MonoBehaviour
{
    // サポート用プレハブ
    public MonsterBall_Script monsterballPlefab;
    public BlackCurtain_Script blackcurtainPlefab;
    public Grass_Script grassPlefab;
    public White_Script whitePlefab;

    public GameObject menuBoxPlefab;
    public GameObject battleMenuBoxPlefab;
    public GameObject statusMenuBoxPlefab;


    // サポート用変数
    public BattleManager_Test battleManager; // battleManagerオブジェクトのBattleManagerスクリプトを取得
    public Trainer_Script_Test Trainer; // TrainerオブジェクトのTrainer_Scriptスクリプトを取得
    GameObject canvas; // 検索して取得
    White_Script white; // plefabから生成
    MonsterBall_Script monsterball;　// plefabから生成
    BlackCurtain_Script blackcurtain; // plefabから生成
    Grass_Script grass; // plefabから生成
    public GameObject menuBoxObj;
    public GameObject battleMenuBoxObj;
    public GameObject statusMenuBoxObj;

    // SE
    public AudioSource audioSource; // AudioSourceコンポーネント取得用
    public AudioClip monsterball_open_sound; // サウンドを取得
    public AudioClip selectSound;


    // フラグ
    bool ballSpawnFlag = false;
    public bool plateFlag = false;
    bool canPushBattle;
    bool canPushStatus;









    void Start()
    {
        // キャンバス　取得
        canvas = GameObject.Find("BattleCanvas");

        // 黒幕　作成
        blackcurtain = Instantiate(blackcurtainPlefab);
        // キャンバスの子オブジェクトとして追加、false = 相対位置
        blackcurtain.transform.SetParent(canvas.transform, false);
        // キャンバスの子オブジェクトの3番目に追加
        blackcurtain.transform.SetAsLastSibling();

        // 草　作成
        grass = Instantiate(grassPlefab);
        // キャンバスの子オブジェクトとして追加
        grass.transform.SetParent(canvas.transform, false);
        // キャンバスの子オブジェクトの3番目に追加
        grass.transform.SetSiblingIndex(2);


    }


    void Update()
    {
        // ボールフラグ　ON　なら
        if (Trainer.BallFlag)
        {
            Trainer.BallFlag = false;
            // モンスターボール　作成
            monsterball = Instantiate(monsterballPlefab);
            // キャンバスの子オブジェクトとして追加
            monsterball.transform.SetParent(canvas.transform, false);
            // キャンバスの子オブジェクトの3番目に追加
            monsterball.transform.SetSiblingIndex(2);

            // ボールあるフラグ　ON
            ballSpawnFlag = true;
        }

        // ボールがあって、出現フラグ　ON　なら
        if (ballSpawnFlag && monsterball.spawnFlag)
        {
            ballSpawnFlag = false;
            monsterball.spawnFlag = false;

            // モンスターボール　開　音
            audioSource.PlayOneShot(monsterball_open_sound);

            // 白　作成
            white = Instantiate(whitePlefab);
            // キャンバスの子オブジェクトとして追加
            white.transform.SetParent(canvas.transform, false);
            // キャンバスの子オブジェクトの3番目に追加
            white.transform.SetSiblingIndex(2);

            // 自分のモンスター　作成
            StartCoroutine(battleManager.PlayerSetup());
            plateFlag = true;

            // コルーチン内で、白の透明度変化
            StartCoroutine(white.Change(white));
        }
    }





    // メニューボックス　作成
    public void Generate_Menu()
    {
        // メニューボックス　作成
        menuBoxObj = Instantiate(menuBoxPlefab);
        // キャンバスの子オブジェクトとして追加
        menuBoxObj.transform.SetParent(canvas.transform, false);

        // 子オブジェクトを取得
        Transform children = menuBoxObj.GetComponentInChildren<Transform>();
        // 子オブジェクトがいなければ終了
        if (children.childCount == 0)
        {
            return;
        }
        // 子オブジェクト　1個ずつ取得
        foreach (Transform ob in children)
        {
            // たたかうボタン
            if (ob.name == "BattleButton_UI")
            {
                Button battleButton = ob.GetComponent<Button>();
                // OnBattleButton関数を入れる
                battleButton.onClick.AddListener(() => OnBattleButton());
            }

            // ステータスボタン
            if (ob.name == "StatusButton_UI")
            {
                Button statusButton = ob.GetComponent<Button>();
                // OnStatusButton関数を入れる
                statusButton.onClick.AddListener(() => OnStatusButton());
            }

        }

    }




    // たたかうボタン
    void OnBattleButton()
    {
        // 選択音
        audioSource.PlayOneShot(selectSound);

        // ボタンを押していいなら（ターンが終了したら）
        if (battleManager.canPlayerSelect)
        {
            // ステータスメニューが残っているなら
            if (statusMenuBoxObj)
            {
                // ステータスメニュー　削除
                Destroy(statusMenuBoxObj);
            }

            // たたかうメニューがないなら
            if (!battleMenuBoxObj)
            {
                // たたかうメニュー　作成
                Generate_BattleMenu();
            }
        }
    }

    // たたかうメニュー　作成
    void Generate_BattleMenu()
    {
        // メニューボックス　作成
        battleMenuBoxObj = Instantiate(battleMenuBoxPlefab);
        // キャンバスの子オブジェクトとして追加
        battleMenuBoxObj.transform.SetParent(canvas.transform, false);

        // 子オブジェクトを取得
        Transform children = battleMenuBoxObj.GetComponentInChildren<Transform>();
        // 子オブジェクトがいなければ終了
        if (children.childCount == 0)
        {
            return;
        }
        // 子オブジェクト　1個ずつ取得
        foreach (Transform ob in children)
        {
            // こうげきボタン
            if (ob.name == "AttackButton_UI")
            {
                Button attackButton = ob.GetComponent<Button>();
                // OnAttackButton関数を入れる
                attackButton.onClick.AddListener(() => battleManager.OnAttackButton());
                // ゲージがあるなら有効、ないなら無効
                attackButton.interactable = battleManager.playerMonster.isGauge;
            }

            // ぼうぎょボタン
            if (ob.name == "DefenseButton_UI")
            {
                Button defenseButton = ob.GetComponent<Button>();
                // OnDefenseButton関数を入れる
                defenseButton.onClick.AddListener(() => battleManager.OnDefenseButton());
                // ゲージがあるなら有効、ないなら無効
                defenseButton.interactable = battleManager.playerMonster.isGauge;
            }

            // スキルボタン
            if (ob.name == "SkillButton_UI")
            {
                Button skillButton = ob.GetComponent<Button>();
                // OnDefenseButton関数を入れる
                skillButton.onClick.AddListener(() => battleManager.OnSkillButton());
                // ゲージが0・60・100なら有効
                if (battleManager.playerMonster.gauge == 0)
                {
                    skillButton.interactable = true;
                    // 孫オブジェクトを取得
                    foreach (Transform skillButton_Text_UI in ob)
                    {
                        Text skillButton_Text = skillButton_Text_UI.GetComponent<Text>();
                        skillButton_Text.text = "スキル0";
                    }
                }
                else if (battleManager.playerMonster.gauge == 60)
                {
                    skillButton.interactable = true;
                    // 色　変更
                    Image image = ob.GetComponent<Image>();
                    image.color = new Color(1, 0.6f, 0.4f);
                    // 孫オブジェクトを取得
                    foreach (Transform skillButton_Text_UI in ob)
                    {
                        Text skillButton_Text = skillButton_Text_UI.GetComponent<Text>();
                        skillButton_Text.text = "スキル3";
                    }
                }
                else if (battleManager.playerMonster.gauge == 100)
                {
                    skillButton.interactable = true;
                    // 色　変更
                    Image image = ob.GetComponent<Image>();
                    image.color = new Color(1, 0.35f, 0.35f);
                    // 孫オブジェクトを取得
                    foreach (Transform skillButton_Text_UI in ob)
                    {
                        Text skillButton_Text = skillButton_Text_UI.GetComponent<Text>();
                        skillButton_Text.text = "スキル5";
                    }
                }
                else
                {
                    skillButton.interactable = false;
                }
            }

            // チャージボタン
            if (ob.name == "ChargeButton_UI")
            {
                Button chargeButton = ob.GetComponent<Button>();
                // OnDefenseButton関数を入れる
                chargeButton.onClick.AddListener(() => battleManager.OnChargeButton());
            }



        }
    }


















    // ステータスボタン
    void OnStatusButton()
    {
        // 選択音
        audioSource.PlayOneShot(selectSound);

        // ボタンを押していいなら（ターンが終了したら）
        if (battleManager.canPlayerSelect)
        {
            // たたかうメニューが残っているなら
            if (battleMenuBoxObj)
            {
                // たたかうメニュー　削除
                Destroy(battleMenuBoxObj);
            }

            // ステータスメニューがないなら
            if (!statusMenuBoxObj)
            {
                Generate_StatusMenu();
            }
        }
    }

    void Generate_StatusMenu()
    {
        // メニューボックス　作成
        statusMenuBoxObj = Instantiate(statusMenuBoxPlefab);
        // キャンバスの子オブジェクトとして追加
        statusMenuBoxObj.transform.SetParent(canvas.transform, false);

        /*
        // 子オブジェクトを取得
        Transform children = statusMenuBoxObj.GetComponentInChildren<Transform>();
        // 子オブジェクトがいなければ終了
        if (children.childCount == 0)
        {
            return;
        }
        // 子オブジェクト　1個ずつ取得
        foreach (Transform ob in children)
        {
            if (ob.name == "PlayerStatus_Text")
            {

            }
        }
        */

    }







}
