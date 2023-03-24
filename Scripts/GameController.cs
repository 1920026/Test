using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;
using System;

public enum GameState { FreeRoam, Battle, Dialog, Interval }




// RPG
public class GameController : MonoBehaviour
{
    GameState state;


    // public GameObject player;

    [SerializeField] PlayerController playerController;
    [SerializeField] GameObject battleSystem_prefab;
    GameObject battleSystem;
    GameObject battleManager_object;
    BattleManager battleManager;
    [SerializeField] Camera mainCamera;

    public event Action<string> OnBgmChanged;

    /*
    public LoadNextArea_Script house1_LNA;
    public LoadBackArea_Script house1_LBA;

    Vector3 beforePlayerPosition;
    */




    void Start()
    {
        DontDestroyOnLoad(this);

        playerController.OnEncountered += StartBattle;

        /*
        DialogManager.Instance.OnShowDialog += () =>
        {
            state = GameState.Dialog;
        };

        DialogManager.Instance.OnCloseDialog += () =>
        {
            if (state == GameState.Dialog)
            {
                state = GameState.FreeRoam;
            }
        };
        */

        // Sceneを遷移してもオブジェクトが消えないようにする
        // DontDestroyOnLoad(player);

        // player.transform.position = Vector3.zero;

    }

    void StartBattle()
    {
        state = GameState.Interval;
        StartCoroutine(StartTransition());
    }
    IEnumerator StartTransition()
    {
        yield return new WaitForSeconds(2.7f);
        state = GameState.Battle;
        // battleSystem.gameObject.SetActive(true);
        battleSystem = Instantiate(battleSystem_prefab);
        battleManager_object = GameObject.Find("BattleManager");
        battleManager = battleManager_object.GetComponent<BattleManager>();
        battleManager.OnBattleOver += EndBattle;
        mainCamera.gameObject.SetActive(false);

        // battleManager.Init();
    }

    void EndBattle(bool won)
    {
        StartCoroutine(EndTransition());
    }
    IEnumerator EndTransition()
    {
        yield return new WaitForSeconds(1.0f);
        state = GameState.FreeRoam;
        // battleSystem.gameObject.SetActive(false);
        Destroy(battleSystem);
        mainCamera.gameObject.SetActive(true);
        OnBgmChanged("RPG");

    }






    void Update()
    {
        if (state == GameState.Battle)
        {
            battleManager.HandleUpdate();
            /*
            // コルーチン内でバトル関数　開始
            StartCoroutine(Battle());
            */
        }
        else if (state == GameState.FreeRoam)
        {
            playerController.HandleUpdate();
        }
        else if (state == GameState.Dialog)
        {
            DialogManager.Instance.HandleUpdate();
        }
        else if (state == GameState.Interval)
        {

        }


        /*
        if (loadNextArea.LoadNextAreaFlag)
        {
            beforePlayerPosition = player.transform.position;
            StartCoroutine(LoadArea("next"));
        }

        if (loadBackArea.LoadBackAreaFlag)
        {
            StartCoroutine(LoadArea("back"));
        }
        */



    }


    /*
    IEnumerator LoadArea(string next_or_back)
    {
        yield return new WaitForSeconds(0.01f);
        if (next_or_back == "next")
        {
            house1_LNA.loadNextAreaFlag = false;
            player.transform.position = loadNextArea.firstPlayerPosition;
        }
        else if (next_or_back == "back")
        {
            loadBackArea.LoadBackAreaFlag = false;
            player.transform.position = beforePlayerPosition;
        }

    }
    */









    IEnumerator Battle()
    {
        // 10秒　待機
        yield return new WaitForSeconds(0.5f);
        // バトルシーンへ遷移
        SceneManager.LoadScene("BattleScene");
        Debug.Log("Scene遷移");
    }












}
