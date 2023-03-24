//******************************************************  注意  ************************************************************
// Google Documentでないとエラー
// フォルダ内が空だとエラー
// パソコンでは、表示されない
// 1回で送れるのは、5つまで
// 〇-〇問題 で問題指定　名前検索
// 〇-〇解答 で解答指定　名前検索
// フォルダ名は、変更禁止
// ファイル名は、指定様式で
// 問題ファイル：〇-〇.doc、問題画像：〇-〇(2).jpg、解答：〇-〇解答(3).doc、解答動画：〇-〇解答.mov
// 画像・動画の拡張子は、なんでもいい
// GIFは静止画になる
//**************************************************************************************************************************

// LINE developersのメッセージ送受信設定に記載のアクセストークン
// Messaging API設定の一番下で発行できるLINE Botのアクセストークン
const LINE_TOKEN = '**************';
const LINE_URL = 'https://api.line.me/v2/bot/message/reply';
const url_richmenu = 'https://api.line.me/v2/bot/richmenu';
const url_richmenu_data = 'https://api-data.line.me/v2/bot/richmenu/';
const url_user = 'https://api.line.me/v2/bot/user';

// ME2種　問題
const questionId = "***********";
// ME2種　解答
const answerId = "*************";

let field_dic = {
  "物理・生体物性": 1,
  "電気・電子工学": 2,
  "生体計測": 3,
  "治療機器": 4,
  "呼吸・麻酔": 5,
  "体外循環": 6,
  "血液浄化法": 7,
  "画像診断": 8,
  "安全管理学": 9,
  "消毒・滅菌": 10,
  "医学的知識": 11
};

const messages = [];
const errorMessages = [];









//postリクエストを受取ったときに発火する関数
function doPost(e) {
  const event = JSON.parse(e.postData.contents).events[0];

  // 応答用Tokenを取得
  const replyToken = event.replyToken;
  // イベントタイプ　取得
  const event_type = event.type;
  // ユーザーID　取得
  const user_id = event.source.userId;
  // ユーザー名　取得
  const user_name = getUserProfile(user_id, LINE_TOKEN);

  try {

    // フォローイベント　のとき
    if (event_type == "follow") {
      const data = SpreadsheetApp.openById("******************").getSheetByName("シート1");

      const last_row = data.getLastRow();
      for (let i = last_row; i >= 1; i--) {
        if (data.getRange(i, 1).getValue() != '') {
          const j = i + 1;
          data.getRange(j, 1).setValue(user_name);
          data.getRange(j, 2).setValue(user_id);
          data.getDataRange().removeDuplicates([2])
          break;
        }
      }
    }





    // メッセージイベント　のとき
    if (event_type == "message") {

      // メッセージを取得
      const userMessage = event.message.text;

      // スプレッドシートに内容を保存
      //　メッセージを改行ごとに分割
      const all_msg = userMessage.split("\n");
      all_msg.unshift(user_name);
      // 行数　取得
      const msg_num = all_msg.length;
      // 新しくデータを入れたいセルの列の番号を取得
      const dataNum = position();
      // 最終列の番号まで、順番にスプレッドシートの左からデータを新しく入力
      for (let i = 0; i < msg_num; i++) {
        SpreadsheetApp.getActiveSheet().getRange(dataNum, i + 1).setValue(all_msg[i]);
      }



      // 問題・解答ファイル
      let file_list;



      if (userMessage in field_dic) {
        // random関数で生成したfile_listを取得
        file_list = random(userMessage);
      }
      else if (userMessage == "問題") {
        // random関数で生成したfile_listを取得
        file_list = random("all");
      }
      else {
        // question関数で生成したfile_listを取得
        file_list = questionAnswer(userMessage);
      }

      // ファイル　すべて送信
      for (let i = 0; i < file_list.length; ++i) {
        messages.push(file_list[i]); // 送信
      }
    }
  } catch (e) {
    sendText("エラー");
    for (let i = 0; i < errorMessages.length; ++i) {
      sendText(errorMessages[i]);
    }
    sendText(e.stack);
  }









  //lineで返答する
  UrlFetchApp.fetch(LINE_URL, {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': `Bearer ${LINE_TOKEN}`
    },
    'method': 'post',
    'payload': JSON.stringify({
      'replyToken': replyToken,
      'messages': messages
    }),
  });
  ContentService.createTextOutput(JSON.stringify({ 'content': 'post ok' })).setMimeType(ContentService.MimeType.JSON);

  // 共有リンク 制限
  lock();
}







// テキスト 送信
function sendText(text) {
  const msg = {
    'type': 'text',
    'text': text
  }
  messages.push(msg);
}

// 単発
function sendMessages(messages, replyToken) {
  //lineで返答する
  UrlFetchApp.fetch(LINE_URL, {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': `Bearer ${LINE_TOKEN}`
    },
    'method': 'post',
    'payload': JSON.stringify({
      'replyToken': replyToken,
      'messages': messages
    }),
  });
  ContentService.createTextOutput(JSON.stringify({ 'content': 'post ok' })).setMimeType(ContentService.MimeType.JSON);
}




// エラーコード 行数 取得
function getRowNum() {
  let e = new Error();
  e = e.stack.split("\n")[2].split(":");
  e.pop()
  return e.pop();
}












// 共有リンク 制限
function lock() {
  let files = all_list("question", "file_dics_list");
  let afiles = all_list("answer", "file_dics_list");

  for (let i = 0; i < files.length; ++i) {
    for (let l = 0; l < files[i].length; ++l) {
      DriveApp.getFileById(files[i][l].id).setSharing(DriveApp.Access.PRIVATE, DriveApp.Permission.EDIT);
    }
  }

  for (let i = 0; i < afiles.length; ++i) {
    for (let l = 0; l < afiles[i].length; ++l) {
      DriveApp.getFileById(afiles[i][l].id).setSharing(DriveApp.Access.PRIVATE, DriveApp.Permission.EDIT);
    }
  }
}











// ユーザーのプロフィール　取得
function getUserProfile(user_id, LINE_TOKEN) {
  const url = 'https://api.line.me/v2/bot/profile/' + user_id;
  const userProfile = UrlFetchApp.fetch(url, {
    'headers': {
      'Authorization': 'Bearer ' + LINE_TOKEN,
    },
  })
  return JSON.parse(userProfile).displayName;
}








// セル 決定
function position() {
  // 1. 今開いている（紐付いている）スプレッドシートを定義
  const sheet = SpreadsheetApp.getActiveSpreadsheet();
  // 2. ここでは、デフォルトの「シート1」の名前が書かれているシートを呼び出し
  const listSheet = sheet.getSheetByName("シート1");
  // 3. 最終列の列番号を取得（縦）|||
  const numColumn = listSheet.getLastColumn() + 1;
  console.log(numColumn);
  // 4. 最終行の行番号を取得（横）-
  const numRow = listSheet.getLastRow() + 1;
  console.log(numRow);
  // 5. 範囲を指定（上、左、右、下）
  const topRange = listSheet.getRange(1, 1, 1, numColumn);      // 一番上のオレンジ色の部分の範囲を指定
  const dataRange = listSheet.getRange(2, 1, numRow, numColumn); // データの部分の範囲を指定
  // 6. 値を取得
  const topData = topRange.getValues();  // 一番上のオレンジ色の部分の範囲の値を取得
  const data = dataRange.getValues(); // データの部分の範囲の値を取得
  const dataNum = data.length;        // 新しくデータを入れたいセルの列の番号を取得

  return dataNum;
}







// 問題ランダム
function random(question_scope) {

  // ME2種　問題
  let folder = DriveApp.getFolderById(questionId);
  let folders = folder.getFolders();

  let field_list = [];　// 今入っているfield_folderのリスト
  while (folders.hasNext()) field_list.push(folders.next().getName()); // リスト作成
  // console.log(field_folders);

  let field_name; // 分野名
  // 全分野
  if (question_scope == "all") {
    let random = Math.floor(Math.random() * field_list.length);
    // console.log(random);
    field_name = field_list[random]; // 分野決定
  }
  // 分野別
  else {
    field_name = question_scope; // 分野決定
  }
  console.log(field_name);

  // 物理・生体物性
  let field_folder = folder.getFoldersByName(field_name).next();
  let field_folders = field_folder.getFolders();


  let count_qfolder = 0; // 問題数
  while (field_folders.hasNext()) { count_qfolder++; field_folders.next(); } // 問題数 カウント
  // console.log(count_qfolder);

  let random2 = Math.floor(Math.random() * count_qfolder) + 1;
  console.log(random2);

  let folder_name = field_dic[field_name] + "-" + random2; // 出題フォルダ 決定

  // 1-1問題フォルダ
  let question_folders = field_folder.getFoldersByName(folder_name + "問題フォルダ").next().getFiles();

  let file_list = create_file_list(question_folders);


  return file_list;
}







// ex-ランダム　問題
function ex_random(question_scope) {

  const field_folder_dics_list = all_list("question", "field_folder_dics_list");
  let question_folder_dics_list;

  // 全分野
  if (question_scope == "all") {
    const random = Math.floor(Math.random() * field_folder_dics_list.length);
    question_folder_dics_list = field_folder_dics_list[random].children;
  }
  // 分野別
  else {
    // 分野フォルダ　全部を回す
    for (let i = 0; i < field_folder_dics_list.length; ++i) {
      // question_scope　と一致したフォルダなら
      if (field_folder_dics_list[i].name == question_scope) {
        // 問題フォルダのファイル　取得
        question_folder_dics_list = field_folder_dics_list[i].children;
      }
    }
    console.log(question_folder_dics_list);
  }

  // ランダム
  // Math.floor = 整数にする
  let random = Math.floor(Math.random() * question_folder_dics_list.length);

  // 出題フォルダ　決定　＆　ファイル　取得
  const file_dics_list = question_folder_dics_list[random].children;
  // console.log(random);
  // console.log(file_dics_list);
  // console.log(file_dics_list[random].length);

  let file_list = ex_create_file_list(file_dics_list);

  const msg1 = {
    "type": "text",
    "text": "「" + file_dics_list[0].name + "解答」と入力してください",
    "quickReply": {
      "items": [
        {
          "type": "action",
          // "imageUrl": "",
          "action": {
            "type": "message",
            "label": file_dics_list[0].name + "解答",
            "text": file_dics_list[0].name + "解答"
          }
        }
      ]
    }
  }
  file_list.push(msg1);

  return file_list;
}


// 問題・解答指定
function questionAnswer(userMessage) {
  try {
    let question_folders = DriveApp.getFoldersByName(userMessage + "フォルダ").next().getFiles();
    let file_list = create_file_list(question_folders);
    return file_list;
  } catch (e) {
    console.error(e.name + " ： " + e.message);
    console.log("コード " + getRowNum() + "：ファイルが見つかりませんでした。")
    errorMessages.push("コード " + getRowNum() + "：ファイルが見つかりませんでした。");
  }
}





// ex-問題指定
function ex_question(userMessage) {

  const question_folder_dics_list = all_list("question", "qa_folder_dics_list");
  let file_dics_list;
  // 全分野の解答フォルダ　全部を回す
  for (let i = 0; i < question_folder_dics_list.length; ++i) {
    // 各分野の解答フォルダ　全部回す
    for (let l = 0; l < question_folder_dics_list[i].length; ++l) {
      // userMessageフォルダ　と一致したフォルダなら
      if (question_folder_dics_list[i][l].name == userMessage + "フォルダ") {
        // 解答フォルダのファイル　取得
        file_dics_list = question_folder_dics_list[i][l].children;
      }
    }
  }

  let file_list = ex_create_file_list(file_dics_list);

  const msg1 = {
    "type": "text",
    "text": "「" + file_dics_list[0].name + "解答」と入力してください",
    "quickReply": {
      "items": [
        {
          "type": "action",
          // "imageUrl": "",
          "action": {
            "type": "message",
            "label": file_dics_list[0].name + "解答",
            "text": file_dics_list[0].name + "解答"
          }
        }
      ]
    }
  }
  file_list.push(msg1);

  return file_list;
}



// ex-解答
function ex_answer2(userMessage) {
  try {
    let question_folders = DriveApp.getFoldersByName(userMessage + "フォルダ").next().getFiles();
    let file_list = create_file_list(question_folders);
    return file_list;
  } catch (e) {
    console.error(e.name + " ： " + e.message);
    console.log("コード " + getRowNum() + "：ファイルが見つかりませんでした。")
    errorMessages.push("コード " + getRowNum() + "：ファイルが見つかりませんでした。");
  }
}





// ex-解答
function ex_answer(userMessage) {

  const answer_folder_dics_list = all_list("answer", "qa_folder_dics_list");
  let file_dics_list;
  // 全分野の解答フォルダ　全部を回す
  for (let i = 0; i < answer_folder_dics_list.length; ++i) {
    // 各分野の解答フォルダ　全部回す
    for (let l = 0; l < answer_folder_dics_list[i].length; ++l) {
      // userMessageフォルダ　と一致したフォルダなら
      if (answer_folder_dics_list[i][l].name == userMessage + "フォルダ") {
        // 解答フォルダのファイル　取得
        file_dics_list = answer_folder_dics_list[i][l].children;
      }
    }
  }
  return ex_create_file_list(file_dics_list);
}




// 共通 送信ファイル 決定
function create_file_list(question_folders) {
  let file_list = [];
  let file_name;

  while (question_folders.hasNext()) {
    let file = question_folders.next();
    let file_id = file.getId();
    let file_type = file.getMimeType();
    file_name = file.getName();

    // ドキュメント　なら
    if (file_type == 'application/vnd.google-apps.document') {
      const doc = DocumentApp.openById(file_id);

      const document = {
        'type': 'text',
        'text': doc.getBody().getText(),
        'name': file_name
      }

      file_list.unshift(document);
    }
    // 画像・動画　なら
    else {
      let tp;

      // 画像　なら
      if (file_type.indexOf("image") != -1) {
        tp = 'image';
      }
      // 動画　なら
      else if (file_type.indexOf("video") != -1) {
        tp = 'video';
      }

      // 共有リンク 解除
      DriveApp.getFileById(file_id).setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

      const img = {
        'type': tp,
        'originalContentUrl': 'https://drive.google.com/uc?id=' + file_id,
        'previewImageUrl': 'https://drive.google.com/uc?id=' + file_id,
        'name': file_name
      }
      file_list.push(img);
    }
    /*
    // イメージ　なら
    else if (file_type.indexOf("image") != -1) {

      // 共有リンク 解除
      DriveApp.getFileById(file_id).setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

      const img = {
        'type': 'image',
        'originalContentUrl': 'https://drive.google.com/uc?id=' + file_id,
        'previewImageUrl': 'https://drive.google.com/uc?id=' + file_id
      }

      file_list.push(img);
    }
    // 動画 なら
    else if (file_type.indexOf("video") != -1) {

      // 共有リンク 解除
      DriveApp.getFileById(file_id).setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

      const img = {
        'type': 'video',
        'originalContentUrl': 'https://drive.google.com/uc?id=' + file_id,
        'previewImageUrl': 'https://drive.google.com/uc?id=' + file_id
      }

      file_list.push(img);
    }
    */

  }

  if (!file_name.includes("解答")) {
    const msg1 = {
      "type": "text",
      "text": "「" + file_name + "解答」と入力してください",
      "quickReply": {
        "items": [
          {
            "type": "action",
            // "imageUrl": "",
            "action": {
              "type": "message",
              "label": file_name + "解答",
              "text": file_name + "解答"
            }
          }
        ]
      }
    }
    file_list.push(msg1);
  }
  // 並べ替え
  file_list.sort(field_folder_dics_list_asc)
  console.log(file_list);
  return file_list;
}





// ex-共通 送信ファイル 決定
function ex_create_file_list(file_dics_list) {
  // ファイル　リスト
  const file_list = [];

  for (let i = 0; i < file_dics_list.length; ++i) {

    const file_dic = file_dics_list[i];

    // ドキュメント　なら
    if (file_dic.type == 'application/vnd.google-apps.document') {
      const doc = DocumentApp.openById(file_dic.id);

      const document = {
        'type': 'text',
        'text': doc.getBody().getText()
      }

      file_list.push(document);
    }
    // イメージ　なら
    else if (file_dic.type.indexOf("image") != -1) {

      // 共有リンク 解除
      DriveApp.getFileById(file_dic.id).setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

      const img = {
        'type': 'image',
        'originalContentUrl': 'https://drive.google.com/uc?id=' + file_dic.id,
        'previewImageUrl': 'https://drive.google.com/uc?id=' + file_dic.id
      }

      file_list.push(img);
    }
  }
  console.log(file_list);
  return file_list;
}










// 問題・解答リスト 一覧
function all_list(qa, list_name) {
  let folders;
  // qa = "answer";
  // list_name = "file_dics_list";

  switch (qa) {
    case "question":
      // ME2種 問題フォルダ　取得
      folders = DriveApp.getFolderById(questionId).getFolders();
      break;
    case "answer":
      folders = DriveApp.getFolderById(answerId).getFolders();
      break;
  }

  // 分野フォルダ　辞書　リスト
  const field_folder_dics_list = [];
  // 問題フォルダ　辞書　リスト
  const question_folder_dics_list = [];
  // ファイル　辞書　リスト
  const file_dics_list = [];


  // ME2種フォルダ内（分野フォルダ）　すべて取得 -----------------------------------------------------------------------------------------------------------------------
  while (folders.hasNext()) {
    const field_folder = folders.next();

    // 分野フォルダ　辞書
    const field_folder_dic = {};

    const field_foldername = field_folder.getName(); // 分野フォルダ名 取得
    const field_folderid = field_folder.getId();     // 分野フォルダID 取得
    const field_folderurl = field_folder.getUrl();   // 分野フォルダURL 取得

    // タグ付け
    field_folder_dic["name"] = field_foldername;
    field_folder_dic["id"] = field_folderid;
    field_folder_dic["url"] = field_folderurl;

    // 分野フォルダ辞書リストに追加
    field_folder_dics_list.push(field_folder_dic);



    // 分野フォルダの問題フォルダ　取得
    const question_folders = field_folder.getFolders();

    // 問題フォルダ　辞書　リスト
    const dic_q = [];

    //  分野フォルダ内（問題フォルダ）　すべて取得 ------------------------------------------------------------
    while (question_folders.hasNext()) {
      const question_folder = question_folders.next();

      // 問題フォルダ　辞書
      const question_folder_dic = {};

      const question_foldername = question_folder.getName();     // 問題フォルダ名 取得
      const question_folderid = question_folder.getId();         // 問題フォルダID 取得
      const question_folderurl = question_folder.getUrl();       // 問題フォルダURL 取得

      // タグ付け
      question_folder_dic["name"] = question_foldername;
      question_folder_dic["id"] = question_folderid;
      question_folder_dic["url"] = question_folderurl;

      // 問題フォルダ辞書リストに追加
      dic_q.push(question_folder_dic);
      // 並べ替え
      dic_q.sort(field_folder_dics_list_asc);



      // 各ファイル　取得
      const files = question_folder.getFiles();

      // 辞書　リスト
      const dic = [];

      //  問題フォルダ内（ファイル）　すべて取得 ------------------------------------------
      while (files.hasNext()) {
        const file = files.next();

        // ファイル　辞書
        const file_dic = {};

        const filename = file.getName();     // ファイル名 取得
        const filetype = file.getMimeType(); // ファイルタイプ　取得
        const fileid = file.getId();         // ファイルID 取得
        const fileurl = file.getUrl();       // ファイルURL 取得

        // タグ付け
        file_dic["name"] = filename;
        file_dic["type"] = filetype;
        file_dic["id"] = fileid;
        file_dic["url"] = fileurl;

        // ファイル辞書リストに追加
        dic.push(file_dic);
        // 並べ替え
        dic.sort(field_folder_dics_list_asc);
      }
      // ファイル辞書リストに追加
      file_dics_list.push(dic);
      // 子オブジェクト
      question_folder_dic["children"] = dic;
    }
    // 問題フォルダ辞書リストに追加
    question_folder_dics_list.push(dic_q);
    // 子オブジェクト
    field_folder_dic["children"] = dic_q;
  }

  try {
    // 入れてしまったあとに　並べ替え
    field_folder_dics_list.sort(field_folder_dics_list_asc);
    question_folder_dics_list.sort(question_folder_dics_list_asc);
    file_dics_list.sort(file_dics_list_asc);
  } catch (e) {
    console.error(e.name + " ： " + e.message);
    console.log("コード " + getRowNum() + "：未使用のファイルがあります。")
    errorMessages.push("コード " + getRowNum() + "：未使用のファイルがあります。");

    // 未使用ファイル 検索
    // outer ラベル 外まで抜ける
    outer:
    for (let i = 0; i < question_folder_dics_list.length; ++i) {
      for (let l = 0; l < question_folder_dics_list[i].length; ++l) {
        if (question_folder_dics_list[i][l].children.length == 0) {
          errorMessages.push(question_folder_dics_list[i][l].url);
          break outer;
        }
      }
    }
    // 処理 継続
  }

  if (list_name == "field_folder_dics_list") {
    // console.log(field_folder_dics_list);
    return field_folder_dics_list;
  }
  else if (list_name == "qa_folder_dics_list") {
    // console.log(question_folder_dics_list);
    return question_folder_dics_list;
  }
  else if (list_name == "file_dics_list") {
    // console.log(file_dics_list);
    return file_dics_list;
  }
}
















// 昇順　（リスト内のnameを比較）
function field_folder_dics_list_asc(a, b) {
  const targetA = a.name;
  const targetB = b.name;

  if (targetA > targetB) {
    return 1;
  }
  else if (targetA < targetB) {
    return -1;
  }
  else {
    return 0;
  }
}

// 昇順（リスト内のリストの[0]番目のnameを比較）
function question_folder_dics_list_asc(a, b) {
  const targetA = a[0].name;
  const targetB = b[0].name;

  if (targetA > targetB) {
    return 1;
  }
  else if (targetA < targetB) {
    return -1;
  }
  else {
    return 0;
  }
}

// 昇順（リスト内のリストの[0]番目のnameを比較）
function file_dics_list_asc(a, b) {
  const targetA = a[0].name;
  const targetB = b[0].name;

  if (targetA > targetB) {
    return 1;
  }
  else if (targetA < targetB) {
    return -1;
  }
  else {
    return 0;
  }
}










