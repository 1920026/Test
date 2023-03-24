using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class BattleSystem_Test : MonoBehaviour
{
    [SerializeField] BattleUnit_Test playerUnit;
    [SerializeField] BattleUnit_Test enemyUnit;
    [SerializeField] BattleHud_Test playerHud;
    [SerializeField] BattleHud_Test enemyHud;


    // UI 取得
    public BattleText_Test textBox;
    public ObjectGenerator objectGenerator;
    public EnemyBattleStation_Script enemyBattleStation_Script;

    // モンスター生成場所
    public Transform playerBattleStation_Transform;
    public Transform enemyBattleStation_Transform;



    // 効果音
    public AudioSource audioSource;
    public AudioClip hitSound;
    public AudioClip hitSuperSound;
    public AudioClip hitPoorSound;
    public AudioClip selectSound;
    public AudioClip defenseSound;
    public AudioClip chargeSound;

    // フラグ
    public bool TrainerMoveFlag = false; // トレーナー移動フラグ
    public bool canPlayerSelect = false; // ボタン選択フラグ
    bool playerTurnFlag = false; // Playerターンフラグ
    bool enemyTurnFlag = false; // Enemyターンフラグ
    bool playerDefensedFlag = false; // ぼうぎょフラグ（2回連続でできないように）
    bool enemyDefensedFlag = false;

    bool playerSkillFlag = false; // スキルフラグ（2回連続でできないように）
    bool enemySkillFlag = false;



    int randomMonster;
    private int first; // 先制攻撃
    int playerCommand; // Playerの技選択
    int enemyCommand; // Enemyの技選択



    int count0;
    int count1;
    int count2;






    private void Start()
    {
        // モンスターの生成と描画
        playerUnit.Setup();
        enemyUnit.Setup();
        // Hudの描画
        playerHud.SetData(playerUnit.pokemon);
        enemyHud.SetData(enemyUnit.pokemon);
    }



    private void Update()
    {
        ++count0;

        // テキストフラグ　ON　なら
        if (enemyBattleStation_Script.textFlag)
        {
            enemyBattleStation_Script.textFlag = false;
            // enemyMonster　明るく
            // enemyUnit.GetComponent<Image>().color =  new Color(1, 1, 1, 1);
            // あ！野生のenemyMonsterがあらわれた！
            textBox.WildSpawn(enemyUnit);
        }
        else if (count0 == 350)
        {
            // トレーナー移動フラグ　ON
            TrainerMoveFlag = true;

        }
        // トレーナー移動フラグ　ON　なら
        else if (TrainerMoveFlag)
        {
            ++count1;
            if (count1 == 1)
            {
                // ゆけっ！platerMonster！
                textBox.Serve(playerUnit);
            }
        }
        // バトルボタン　押していいなら
        else if (canPlayerSelect)
        {
            ++count2;
            if (count2 == 1)
            {
                // playerMonsterはどうする？
                textBox.Select(playerUnit);
            }
        }
    }


    // 自分のモンスター生成
    public IEnumerator PlayerSetup()
    {

        // モンスターボールから出現
        playerUnit.spawn();

        // 3秒　待機
        yield return new WaitForSeconds(3f);

        // メニューボックス　生成
        objectGenerator.Generate_Menu();

        // バトルボタン（攻撃等）を押していいかどうか
        canPlayerSelect = true;
    }

    /*
    // こうげきボタン
    public void OnAttackButton()
    {
        // 選択音
        audioSource.PlayOneShot(selectSound);

        playerCommand = 1;

        StartTurn();

    }

    // ぼうぎょボタン
    public void OnDefenseButton()
    {
        // 選択音
        audioSource.PlayOneShot(selectSound);

        // 前のターンにぼうぎょを使っていたら
        if (playerDefensedFlag)
        {
            // ぼうぎょ　失敗
            // 次のターン　ぼうぎょできるようにする
            playerDefensedFlag = false;
        }
        // 前のターンにぼうぎょを使っていなかったら
        else
        {
            // ぼうぎょ　成功
            // 次のターン　ぼうぎょできないようにする
            playerDefensedFlag = true;
        }

        playerCommand = 2;

        StartTurn();
    }

    // スキルボタン
    public void OnSkillButton()
    {
        // 選択音
        audioSource.PlayOneShot(selectSound);

        // 前のターンにスキルを使っていたら
        if (playerSkillFlag)
        {
            // スキル　失敗
            // 次のターン　スキルできるようにする
            playerSkillFlag = false;
        }
        // 前のターンにスキルを使っていなかったら
        else
        {
            // スキル　成功
            // 次のターン　スキルできないようにする
            playerSkillFlag = true;

        }

        playerCommand = 3;

        StartTurn();
    }

    // チャージボタン
    public void OnChargeButton()
    {
        // 選択音
        audioSource.PlayOneShot(selectSound);

        playerCommand = 4;

        StartTurn();
    }









    // こうげき時のHit音
    void HitSound(int enemyCommand, bool enemyDefensedFlag, bool enemySkillFlag)
    {
        // 技失敗 or チャージ　のとき
        if (((enemyCommand == 2 & !enemyDefensedFlag) | (enemyCommand == 3 & !enemySkillFlag)) | enemyCommand == 4)
        {
            // Hit Super 音
            audioSource.PlayOneShot(hitSuperSound);
        }
        // こうげき　or スキル　のとき
        else if (enemyCommand == 1 | enemyCommand == 3)
        {
            // Hit 音
            audioSource.PlayOneShot(hitSound);
        }
        // ぼうぎょ　のとき
        else if (enemyCommand == 2 & enemyDefensedFlag)
        {
            // Hit Poor 音
            audioSource.PlayOneShot(hitPoorSound);
        }
    }

    
    // コマンド0～4
    // 技失敗
    IEnumerator Command0(BattleUnit_Test playerUnit, BattleHud_Test playerHud, int playerCommand, BattleUnit_Test enemyUnit, BattleHud_Test enemyHud, int enemyCommand)
    {
        // GAUGE　消費
        playerUnit.ConsumptionGauge(playerCommand);
        // GAUGEバー　更新
        playerHud.UpdateGAUGE(playerUnit.pokemon);
        // PlayerMonsterのぼうぎょ!
        textBox.Defence(playerUnit);
        // 1秒　待機
        yield return new WaitForSeconds(1f);
        // しかし　うまくきまらなかった
        textBox.Failure();
    }
    // こうげき
    IEnumerator Command1(BattleUnit_Test playerUnit, BattleHud_Test playerHud, int playerCommand, BattleUnit_Test enemyUnit, BattleHud_Test enemyHud, int enemyCommand, bool enemyDefensedFlag, bool enemySkillFlag)
    {
        // GAUGE　消費
        playerMonster.ConsumptionGauge(playerCommand);
        // GAUGEバー　更新
        playerUI.UpdateGAUGE(playerMonster);
        // PlayerMonsterのこうげき！
        textBox.Attack(playerMonster);
        // 0.7秒　待機
        yield return new WaitForSeconds(0.7f);
        // playerが敵を攻撃
        playerMonster.Attack(enemyMonster, enemyCommand, enemyDefensedFlag, enemySkillFlag);
        // 0.3秒　待機
        yield return new WaitForSeconds(0.3f);
        // Hit 音
        HitSound(enemyCommand, enemyDefensedFlag, enemySkillFlag);
        // 敵　揺れる
        enemyMonster.Shake();
        // 敵のHPバー　更新
        enemyUI.UpdateHP(enemyMonster);

    }
    // ぼうぎょ
    IEnumerator Command2(UnitManager playerMonster, UnitUIManager playerUI, int playerCommand, bool playerDefensedFlag, UnitManager enemyMonster, UnitUIManager enemyUI, int enemyCommand)
    {
        // GAUGE　消費
        playerMonster.ConsumptionGauge(playerCommand);
        // GAUGEバー　更新
        playerUI.UpdateGAUGE(playerMonster);
        // PlayerMonsterのぼうぎょ!
        textBox.Defence(playerMonster);
        // 0.3秒　待機
        yield return new WaitForSeconds(0.3f);
        // ぼうぎょフラグ　True なら
        if (playerDefensedFlag)
        {
            // Defense 音
            audioSource.PlayOneShot(defenseSound);
        }
        else
        {
            // 0.7秒　待機
            yield return new WaitForSeconds(0.7f);
            // しかし　うまくきまらなかった
            textBox.Failure();
        }
    }
    // スキル
    IEnumerator Command3(UnitManager playerMonster, UnitUIManager playerUI, int playerCommand, bool playerSkillFlag, UnitManager enemyMonster, UnitUIManager enemyUI, int enemyCommand, bool enemyDefensedFlag, bool enemySkillFlag)
    {
        // GAUGE　消費
        playerMonster.ConsumptionGauge(playerCommand);
        // GAUGEバー　更新
        playerUI.UpdateGAUGE(playerMonster);
        // PlayerMonsterのスキル!
        textBox.Skill(playerMonster);
        // 0.7秒　待機
        yield return new WaitForSeconds(0.7f);
        // スキルフラグ　True なら
        if (playerSkillFlag)
        {
            // playerが敵をスキル攻撃
            playerMonster.Skill(enemyMonster, enemyCommand, enemyDefensedFlag, enemySkillFlag);
            // 0.3秒　待機
            yield return new WaitForSeconds(0.3f);
            // Hit 音
            HitSound(enemyCommand, enemyDefensedFlag, enemySkillFlag);
            // 敵　揺れる
            enemyMonster.Shake();
            // 敵のHPバー　更新
            enemyUI.UpdateHP(enemyMonster);
        }
        else
        {
            // 0.3秒　待機
            yield return new WaitForSeconds(0.3f);
            // しかし　うまくきまらなかった
            textBox.Failure();
        }
    }
    // チャージ
    IEnumerator Command4(UnitManager playerMonster, UnitUIManager playerUI, int playerCommand, UnitManager enemyMonster, UnitUIManager enemyUI, int enemyCommand)
    {
        // PlayerMonsterはチャージした！
        textBox.Charge(playerMonster);
        // 0.3秒　待機
        yield return new WaitForSeconds(0.3f);
        // チャージ
        playerMonster.ChargeGauge();
        // チャージ　音
        audioSource.PlayOneShot(chargeSound);
        // GAUGEバー　更新
        playerUI.UpdateGAUGE(playerMonster);
        // 0.5秒　待機
        //yield return new WaitForSeconds(0.5f);
    }
















    // 自分のモンスターの行動（コルーチン内）
    public IEnumerator PlayerTurn()
    {
        playerTurnFlag = true;

        // 1秒　待機
        yield return new WaitForSeconds(1f);

        // ぼうぎょ以外を選んだなら
        if (playerCommand != 2)
        {
            // 1ターンはさめばOK
            playerDefensedFlag = false;
        }
        // スキル以外を選んだなら
        if (playerCommand != 3)
        {
            // 1ターンはさめばOK
            playerSkillFlag = false;
        }
        /*
        // Playerの技失敗
        if (playerCommand == 0)
        {
            StartCoroutine(Command0(playerMonster, playerUI, playerCommand, enemyMonster, enemyUI, enemyCommand));
        }
        */
    // PlayerMonsterのこうげき
    /*
    if (playerCommand == 1)
    {
        StartCoroutine(Command1(playerMonster, playerUI, playerCommand, enemyMonster, enemyUI, enemyCommand, enemyDefensedFlag, enemySkillFlag));
    }
    // PlayerMonsterのぼうぎょ
    else if (playerCommand == 2)
    {
        StartCoroutine(Command2(playerMonster, playerUI, playerCommand, playerDefensedFlag, enemyMonster, enemyUI, enemyCommand));
    }
    // PlayerMonsterのスキル
    else if (playerCommand == 3)
    {
        StartCoroutine(Command3(playerMonster, playerUI, playerCommand, playerSkillFlag, enemyMonster, enemyUI, enemyCommand, enemyDefensedFlag, enemySkillFlag));
    }
    // PlayerMonsterのチャージ
    else if (playerCommand == 4)
    {
        StartCoroutine(Command4(playerMonster, playerUI, playerCommand, enemyMonster, enemyUI, enemyCommand));
    }

    // 遅延処理
    // 0.7秒　待機
    yield return new WaitForSeconds(0.7f);

    // 敵が倒れたら
    if (enemyMonster.isDead)
    {
        // バトル終了
        StartCoroutine(EndBattle(playerMonster));
    }
    // 敵がまだなら
    else if (playerTurnFlag & !enemyTurnFlag)
    {
        // 1.3秒　待機
        yield return new WaitForSeconds(1.3f);
        // コルーチン内で、敵の攻撃開始
        StartCoroutine(EnemyTurn());
    }
    // ターン終了
    else if (playerTurnFlag & enemyTurnFlag)
    {
        StartCoroutine(EndTurn());
    }
}




// 敵の行動（コルーチン内）
IEnumerator EnemyTurn()
{
    enemyTurnFlag = true;

    // 1秒　待機
    yield return new WaitForSeconds(1f);
    /*
    // Enemyの技失敗
    if (enemyCommand == 0)
    {
        StartCoroutine(Command0(enemyMonster, enemyUI, enemyCommand, playerMonster, playerUI, playerCommand));
    }
    */
    // EnemyMonsterのこうげき
    /*
    if (enemyCommand == 1)
    {
        StartCoroutine(Command1(enemyMonster, enemyUI, enemyCommand, playerMonster, playerUI, playerCommand, playerDefensedFlag, playerSkillFlag));
    }
    // EnemyMonsterのぼうぎょ
    else if (enemyCommand == 2)
    {
        StartCoroutine(Command2(enemyMonster, enemyUI, enemyCommand, enemyDefensedFlag, playerMonster, playerUI, playerCommand));
    }
    // EnemyMonsterのスキル
    else if (enemyCommand == 3)
    {
        StartCoroutine(Command3(enemyMonster, enemyUI, enemyCommand, enemySkillFlag, playerMonster, playerUI, playerCommand, playerDefensedFlag, playerSkillFlag));
    }
    // EnemyMonsterのチャージ
    else if (enemyCommand == 4)
    {
        StartCoroutine(Command4(enemyMonster, enemyUI, enemyCommand, playerMonster, playerUI, playerCommand));
    }

    // 遅延処理
    // 0.7秒　待機
    yield return new WaitForSeconds(0.7f);

    // 自分が倒れたら
    if (playerMonster.isDead)
    {
        // バトル終了
        StartCoroutine(EndBattle(playerMonster));
    }
    // 自分がまだなら
    else if (!playerTurnFlag & enemyTurnFlag)
    {
        // 1.3秒　待機
        yield return new WaitForSeconds(1.3f);
        // コルーチン内で、自分の攻撃開始
        StartCoroutine(PlayerTurn());
    }
    // ターン終了
    else if (playerTurnFlag & enemyTurnFlag)
    {
        StartCoroutine(EndTurn());
    }
}




// 敵のコマンド
void EnemyCommand()
{
    // 敵のコマンド
    // 敵のゲージが0なら
    if (enemyMonster.gauge == 0)
    {
        // 0スキル、チャージ　選択　可能
        int[] array = { 3, 4 };
        int index = Random.Range(0, 2); // 0～1　ランダム
        enemyCommand = array[index];
    }
    // 敵のゲージが3,5なら
    else if (enemyMonster.gauge == 60 | enemyMonster.gauge == 100)
    {
        // 1～4　全選択　可能
        enemyCommand = Random.Range(1, 5);　// 1～4　ランダム
    }
    else
    {
        // スキル以外　選択　可能
        int[] array = { 1, 2, 4 };
        int index = Random.Range(0, 3); // 0～2　ランダム
        enemyCommand = array[index];
    }

    // 敵コマンドがぼうぎょなら
    if (enemyCommand == 2)
    {
        //前のターンにぼうぎょを使っていたら
        if (enemyDefensedFlag)
        {
            // ぼうぎょ　失敗
            // 次のターン　使えるようにする
            enemyDefensedFlag = false;
        }
        // 前のターンにぼうぎょを使っていなかったら
        else
        {
            // ぼうぎょ　成功
            // 次のターン　ぼうぎょできないようにする
            enemyDefensedFlag = true;
        }
    }
    else
    {
        enemyDefensedFlag = false;
    }

    // 敵コマンドがスキルなら
    if (enemyCommand == 3)
    {
        //前のターンにスキルを使っていたら
        if (enemySkillFlag)
        {
            // スキル　失敗
            // 次のターン　スキル　できるようにする
            enemySkillFlag = false;
        }
        // 前のターンにスキルを使っていなかったら
        else
        {
            // スキル　成功
            // 次のターン　スキルできないようにする
            enemySkillFlag = true;
        }
    }
    else
    {
        enemySkillFlag = false;
    }



}









// ターン開始
void StartTurn()
{
    // バトルボタンを押していいなら
    if (canPlayerSelect)
    {
        // バトルボタン押したらダメにする
        canPlayerSelect = false;

        // テキスト　削除
        textBox.None();
        // メニューボックス　削除
        Destroy(objectGenerator.menuBoxObj);
        // たたかうメニューボックス　削除
        Destroy(objectGenerator.battleMenuBoxObj);

        // 敵のコマンド
        EnemyCommand();

        // 先制攻撃
        first = Random.Range(1, 3); // 1,2のランダム

        // ぼうぎょ チャージ　優先
        if (playerCommand == 2 | playerCommand == 4)
        {
            first = 1;
        }
        else if (enemyCommand == 2 | enemyCommand == 4)
        {
            first = 2;
        }

        // 先制が1なら
        if (first == 1)
        {
            // コルーチン内で、自分の攻撃開始
            StartCoroutine(PlayerTurn());
        }

        // 先制が2なら
        if (first == 2)
        {
            // コルーチン内で、敵の攻撃開始
            StartCoroutine(EnemyTurn());
        }
    }
}












// ターン終了
IEnumerator EndTurn()
{
    playerTurnFlag = false;
    enemyTurnFlag = false;

    // 2秒　待機
    yield return new WaitForSeconds(2f);
    // メニューボックス　生成
    objectGenerator.Generate_Menu();
    // バトルボタン押していい
    canPlayerSelect = true;
    // PlayerMonsterはどうする？
    textBox.Select(playerMonster);

}









// バトル終了
IEnumerator EndBattle(UnitManager Monster)
{
    canPlayerSelect = false;
    playerTurnFlag = false;
    enemyTurnFlag = false;

    yield return new WaitForSeconds(1f);

    textBox.End(Monster);
    Debug.Log("ゲーム終了");
}
*/

}
