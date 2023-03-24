//******************************************************  注意  ************************************************************
// フォルダ内が空だとエラー
// messagesを空のまま送るとエラー
// 『作成開始』で新規フォルダ、ファイル作成
// 『リセット』で新規作成していたフォルダを削除
// 『削除』で一つ前のファイルを削除
// 『追加』でファイル指定してテキスト・写真を追加
// 写真・動画に対応、GIFは送信時にpngに変換される
// パソコンでは、quickreplyが表示されない
// relyは1回のみ
// 1回で送れるのは、5つまで
//**************************************************************************************************************************

// LINE developersのメッセージ送受信設定に記載のアクセストークン
// Messaging API設定の一番下で発行できるLINE Botのアクセストークン
const LINE_TOKEN = '********************';
const LINE_URL = 'https://api.line.me/v2/bot/message/reply';
const url_richmenu = 'https://api.line.me/v2/bot/richmenu';
const url_richmenu_data = 'https://api-data.line.me/v2/bot/richmenu/';
const url_user = 'https://api.line.me/v2/bot/user';

// ME2種　問題
const questionId = "********************";
// ME2種　解答
const answerId = "*************************";

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

let ss = SpreadsheetApp.getActiveSpreadsheet(); // 紐づいているスプレッドシート
let orgSheet = ss.getSheetByName("Original"); // 原本（シート）

let sheet = null; // ユーザー別シート









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

  // メッセージID　取得
  const messageId = event.message.id;
  // LINE_END_POINT　取得
  const LINE_END_POINT = 'https://api-data.line.me/v2/bot/message/' + messageId + '/content'


  try {





    // フォローイベント　のとき
    if (event_type == "follow") {
      const sheetId = "*********************************************";
      const data = SpreadsheetApp.openById(sheetId).getSheetByName("シート1");

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

      // ユーザー別シートを持っているかどうか
      if (!isSheetExists(user_name + "（ID：" + user_id + "）")) {
        // シートをコピー
        orgSheet.copyTo(ss).setName(user_name + "（ID：" + user_id + "）");
      }
      sheet = ss.getSheetByName(user_name + "（ID：" + user_id + "）");


      let userMessage;

      if (event.message.type == "text") {
        // メッセージを取得
        userMessage = event.message.text;
      }
      else if (event.message.type == "image" || event.message.type == "video") {
        // イメージBlobを取得
        userMessage = getImage(LINE_END_POINT, event.message.type);
      }

      // 作成状況 1～3
      let activity = sheet.getRange(2, 7).getValue();


      if (userMessage == "リセット") {
        if (!/add-[0-9]+/.test(activity)) reset() // addが含まれていないならフォルダ削除
        ss.deleteSheet(sheet);
        sendText("リセットしました。");
        sendMessages(messages, replyToken); // 単発 処理 終了
        return;
      }

      if (userMessage == "一覧") {
        ME2_files_list.myFunction2();
        ss.deleteSheet(sheet);
        sendText("*********************************");
        sendMessages(messages, replyToken); // 単発 処理 終了
        return;
      }

      if (userMessage == "削除") {
        delLogFile();
        if (!activity) ss.deleteSheet(sheet);
        sendMessages(messages, replyToken); // 単発 処理 終了
        return;
      }



      // 空白のとき
      if (userMessage == "追加" && !activity) {
        // リセット
        reset();
        sendText("フォルダ名を送信してください。");
        sheet.getRange(2, 7).setValue("add-1"); // add-1へ
      }
      else if (userMessage == "作成開始" && !activity) {
        // リセット
        reset();
        const button = {
          "type": "text",
          "text": "分野を選択してください。",
          // クイックリプライボタン
          "quickReply": {
            "items": createQuickReply_field()
          }
        }
        messages.push(button);
        sheet.getRange(2, 7).setValue(1); // 1へ
      }
      else if (userMessage == "OCR" && !activity) {
        // リセット
        reset();
        let button = createConfirmTemplate("テキストを整形しますか？\n（選択肢を含みますか？）");
        messages.push(button);
        sheet.getRange(2, 7).setValue("ocr-1"); // ocr-1へ
      }
      else if (!activity) {
        ss.deleteSheet(sheet);
        sendText("問題・解答を\n作成するときは、\n「作成開始」と\n送信してください。");
        sendText("既存のフォルダに\n追加するときは、\n「追加」と\n送信してください。");
        sendText("ファイル一覧を\n表示するときは、\n「一覧」と\n送信してください。");
        sendMessages(messages, replyToken); // 単発 処理 終了
        return;
      }


      // add-1のとき
      if (activity == "add-1") {
        let add_folder = search_questionAnswer(userMessage);
        let add_folder_id = add_folder.getId()
        let qa = userMessage.match(/[0-9]+-[0-9]+(.+)/)[1]
        if (qa == "問題") {
          sheet.getRange(5, 5).setValue(add_folder_id);　// 追加フォルダID
          specify("問題"); // セット
        }
        else if (qa == "解答") {
          sheet.getRange(14, 5).setValue(add_folder_id);　// 追加フォルダID
          specify("解答"); // セット
        }
        sendText("テキスト、写真・動画を\n送信してください。");
        sheet.getRange(2, 7).setValue("add-2"); // add-2へ
      }

      // 1のとき
      if (activity == 1) {
        // userMessageがfield_dicに含まれているか
        if (userMessage in field_dic) {
          // 新規ファイル 作成
          newFolder(user_name, user_id, userMessage);
          sendText("問題を作成します。")
          // セット
          specify("問題");
          sendText("問題文、写真・動画を\n送信してください。");
          sheet.getRange(2, 7).setValue(2); // 2へ
        }
        else {
          const button = {
            "type": "text",
            "text": "分野を選択してください。",
            // クイックリプライボタン
            "quickReply": {
              "items": createQuickReply_field()
            }
          }
          messages.push(button);
        }
      }

      // ocr-1ののとき
      if (activity == "ocr-1") {
        if (userMessage == "はい") {
          sendText("写真を送信してください。");
          sheet.getRange(2, 7).setValue("ocr-2"); // ocr-2へ
        }
        else if (userMessage == "いいえ") {
          sendText("写真を送信してください。");
          sheet.getRange(2, 7).setValue("ocr-3"); // ocr-3へ
        }
        else {
          let button = createConfirmTemplate("テキストを整形しますか？\n（選択肢を含みますか？）");
          messages.push(button);
        }
      }



      // add-2のとき
      if (activity == "add-2") {
        if (event.message.type == "text") {
          // テキスト 取得
          let text = event.message.text;

          if (text == "終了") {
            sheet.getRange(2, 7).setValue("add-3"); // 3へ
            // 確認テンプレートメッセージ
            let button = createConfirmTemplate("終了します。\nよろしいですか？");
            messages.push(button);
          }
          else {
            // ドキュメントファイル 作成
            if (text != "終了") newFile_Doc(text);
            // ボタンテンプレートメッセージ
            let button = createButtonTemplate("送信完了の場合は、\n『終了ボタン』を\n押してください。", "終了");
            messages.push(button);
          }
        }
        else if (event.message.type == "image" || event.message.type == "video") {
          // イメージBlob 取得
          // let imageBlob = getImage(LINE_END_POINT, event.message.type);
          // イメージファイル 作成
          newFile_Img(userMessage);
          // ボタンテンプレートメッセージ
          button = createButtonTemplate("送信完了の場合は、\n『終了ボタン』を\n押してください。", "終了");
          messages.push(button);
        }
        else sendText("テキスト、写真・動画を送信してください。");
      }

      // 2のとき
      if (activity == 2) {
        if (event.message.type == "text") {
          let text = event.message.text; // テキスト 取得

          if (qa_Judg() == "問題") {
            if (text == "完了") {
              sheet.getRange(2, 7).setValue(3); // 3へ
              // 確認テンプレートメッセージ
              let button = createConfirmTemplate("解答の作成を始めます。\nよろしいですか？");
              messages.push(button);
            }
            else {
              // ドキュメントファイル 作成
              if (text != "終了") newFile_Doc(text);
              // ボタンテンプレートメッセージ
              let button = createButtonTemplate("送信完了の場合は、\n『完了ボタン』を\n押してください。", "完了");
              messages.push(button);
            }
          }
          else if (qa_Judg() == "解答") {

            if (text == "終了") {
              sheet.getRange(2, 7).setValue(4); // 4へ
              // 確認テンプレートメッセージ
              let button = createConfirmTemplate("終了します。\nよろしいですか？");
              messages.push(button);
            }
            else {
              // ドキュメントファイル 作成
              if (text != "完了") newFile_Doc(text);
              // ボタンテンプレートメッセージ
              let button = createButtonTemplate("送信完了の場合は、\n『終了ボタン』を\n押してください。", "終了");
              messages.push(button);
            }
          }
          else {
            sendText("エラー");
            for (let i = 0; i < errorMessages.length; ++i) sendText(errorMessages[i]);
            sendText(e.stack);
            reset();
            sendText("リセットしました。");
          }
        }
        else if (event.message.type == "image" || event.message.type == "video") {
          // イメージBlob 取得
          // let imageBlob = getImage(LINE_END_POINT, event.message.type);
          // イメージファイル 作成
          newFile_Img(userMessage);

          if (qa_Judg() == "問題") {
            // ボタンテンプレートメッセージ
            button = createButtonTemplate("送信完了の場合は、\n『完了ボタン』を\n押してください。", "完了");
          }
          else if (qa_Judg() == "解答") {
            // ボタンテンプレートメッセージ
            button = createButtonTemplate("送信完了の場合は、\n『終了ボタン』を\n押してください。", "終了");
          }
          messages.push(button);
        }
        else sendText("テキスト、写真・動画を送信してください。");
      }
      
      // ocr-2、ocr-3のとき
      if (activity == "ocr-2" || activity == "ocr-3") {
        if (event.message.type == "image") {
          let yn = (activity == "ocr-2") ? "yes": "no" // 三項演算子
          let text = OCR_bot.ocr(userMessage, yn, sheet, replyToken);
          ss.deleteSheet(sheet);
          const button = {
            "type": "text",
            "text": text,
            // クイックリプライボタン
            "quickReply": {
              "items": createQuickReply("作成開始", "追加", "OCR")
            }
          }
          messages.push(button);
        }
        else sendText("写真を送信してください。");
      }






      // add-3のとき
      if (activity == "add-3") {
        if (userMessage == "はい") {
          // リセット
          reset("not");
          ss.deleteSheet(sheet); // ユーザー別シート 削除
          sendText("終了しました。");
        }
        else if (userMessage == "いいえ") {
          sheet.getRange(2, 7).setValue("add-2"); // add-2へ
          sendText("テキスト、写真を\n送信してください。");
        }
        else {
          // 確認テンプレートメッセージ
          let button = createConfirmTemplate("終了します。\nよろしいですか？");
          messages.push(button);
        }
      }

      // 3のとき
      if (activity == 3) {
        if (userMessage == "はい") {
          // セット
          specify("解答");
          sheet.getRange(2, 7).setValue(2); // 2へ
          sendText("解答・解説、写真・動画を\n送信してください。");
        }
        else if (userMessage == "いいえ") {
          sheet.getRange(2, 7).setValue(2); // 2へ
          sendText("問題文、写真・動画を\n送信してください。");
        }
        else {
          // 確認テンプレートメッセージ
          let button = createConfirmTemplate("解答の作成を始めます。\nよろしいですか？");
          messages.push(button);
        }
      }

      


      // 4のとき
      if (activity == 4) {
        if (userMessage == "はい") {
          // リセット
          reset("not");
          ss.deleteSheet(sheet); // ユーザー別シート 削除
          sendText("終了しました。");
        }
        else if (userMessage == "いいえ") {
          sheet.getRange(2, 7).setValue(2); // 2へ
          sendText("解答・解説、写真・動画を\n送信してください。");
        }
        else {
          // 確認テンプレートメッセージ
          let button = createConfirmTemplate("終了します。\nよろしいですか？");
          messages.push(button);
        }
      }
    }
  } catch (e) {
    sendText("エラー");
    for (let i = 0; i < errorMessages.length; ++i) sendText(errorMessages[i]);
    sendText(e.stack);
    (activity.indexOf("add") !== -1) ? reset("not"): reset() // 三項演算子 addならフォルダを消さない
    sendText("リセットしました。");
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
}


//****************************************************************************************************************************
//****************************************************************************************************************************





// テキスト 送信
function sendText(text) {
  const msg = {
    'type': 'text',
    'text': text
  }
  messages.push(msg);
}

// 単発 処理が終了する
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




// 分野クイックリプライボタン 作成
function createQuickReply_field() {
  field = [
    "物理・生体物性",
    "電気・電子工学",
    "生体計測",
    "治療機器",
    "呼吸・麻酔",
    "体外循環",
    "血液浄化法",
    "画像診断",
    "安全管理学",
    "消毒・滅菌",
    "医学的知識"
  ];
  let items = [];
  for (let i = 0; i < field.length; ++i) {
    let dic = {
      "type": "action",
      // "imageUrl": "",
      "action": {
        "type": "message",
        "label": field[i],
        "text": field[i]
      }
    }
    items.push(dic);
  }
  return items;
}

// クイックリプライボタン 作成
/**
* @param {any[]} array
*/
function createQuickReply(...array) {
  let items = [];
  array.forEach( function(v,i) {
    let dic = {
      "type": "action",
      // "imageUrl": "",
      "action": {
        "type": "message",
        "label": v,
        "text": v
      }
    }
    items.push(dic);
  });
  return items;
}

// ボタンテンプレートメッセージ 作成
function createButtonTemplate(text, buttonLabel) {
  const button = {
    "type": "template",
    "altText": "ボタンテンプレート",
    "template": {
      "type": "buttons",
      "text": text,
      "actions": [
        {
          "type": "message",
          "label": buttonLabel,
          "text": buttonLabel
        }
      ]
    }
  }
  return button;
}

// 確認テンプレートメッセージ 作成
function createConfirmTemplate(text) {
  const button = {
    "type": "template",
    "altText": "確認テンプレート",
    "template": {
      "type": "confirm",
      "text": text,
      "actions": [
        {
          "type": "message",
          "label": "はい",
          "text": "はい"
        },
        {
          "type": "message",
          "label": "いいえ",
          "text": "いいえ"
        }
      ]
    }
  }
  return button;
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





// ユーザー別シートを持ってるかどうか
function isSheetExists(sheetName) {
  let allSheets = ss.getSheets();
  for (let i = 0; i < allSheets.length; i++) {
    if (sheetName == allSheets[i].getName()) return true;
  }
  return false;
}







// 画像 取得
function getImage(LINE_END_POINT, type) {
  /*
  // 日付 フォーマット
  let date = Moment.moment().subtract(10,"h");
  let formattedDate = date.format("YYYY/MM/DD/HH:mm:ss");
  */

  try {
    let headers = {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': `Bearer ${LINE_TOKEN}`
    }
    let options = {
      'method': 'get',
      'headers': headers
    }
    //取得
    let res = UrlFetchApp.fetch(LINE_END_POINT, options);
    // 番号 取得
    let field_number = sheet.getRange(2, 4).getValue(); // 分野番号
    let newFolder_number = sheet.getRange(5, 4).getValue(); // 新規フォルダ番号
    // 情報 生成
    let name = res.getBlob().getName();
    let new_name = field_number + "-" + newFolder_number;

    let blob;
    if (qa_Judg() == "問題") {
      let img_num_q = (sheet.getRange(7, 2).getValue()) ? Number(sheet.getRange(7, 2).getValue()): 0 // イメージ数 問題
      if (img_num_q > 0) new_name += "("+ String(img_num_q+1) + ")";
      sheet.getRange(7, 2).setValue(img_num_q+1);
      blob = res.getBlob().setName(name.replace(/.+\./, new_name + "."));
    }
    else if (qa_Judg() == "解答") {
      let img_num_a = (sheet.getRange(16, 2).getValue()) ? Number(sheet.getRange(16, 2).getValue()): 0 // イメージ数 解答
      new_name += "解答";
      if (img_num_a > 0) new_name += "("+ String(img_num_a+1) + ")";
      sheet.getRange(16, 2).setValue(img_num_a+1);
      blob = res.getBlob().setName(name.replace(/.+\./, new_name + "."));
    }
    else {
      // OCRのとき
      blob = res.getBlob().getAs("image/png").setName(Number(new Date()) + ".png");
    }
    return blob;
  } catch (e) {
    // エラー時
    sendText(e.message);
  }
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


// 問題・解答検索
function search_questionAnswer(userMessage) {
  try {
    let add_folder = DriveApp.getFoldersByName(userMessage + "フォルダ").next();
    let field_num = userMessage.match(/([0-9]+)-[0-9]+.+/)[1]
    let folder_num = userMessage.match(/[0-9]+-([0-9]+).+/)[1]
    sheet.getRange(2, 4).setValue(field_num);　// 追加分野番号
    sheet.getRange(5, 4).setValue(folder_num);　// 追加フォルダ番号
    return add_folder;
  } catch (e) {
    console.error(e.name + " ： " + e.message);
    console.log("コード " + getRowNum() + "：ファイルが見つかりませんでした。")
    errorMessages.push("コード " + getRowNum() + "：ファイルが見つかりませんでした。");
  }
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
        'text': doc.getBody().getText()
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
        'previewImageUrl': 'https://drive.google.com/uc?id=' + file_id
      }
      file_list.push(img);
    }
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

  console.log(file_list);
  return file_list;
}










// 問題・解答リスト 一覧
function all_list(qa, list_name) {
  let folders;

  switch (qa) {
    case "question":
      // ME2種 問題フォルダ　取得
      folders = DriveApp.getFolderById(questionId).getFolders();
      break;
    case "answer":
      // ME2種 解答フォルダ　取得
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
    return;
  }

  if (list_name == "field_folder_dics_list") {
    return field_folder_dics_list;
  }
  else if (list_name == "qa_folder_dics_list") {
    return question_folder_dics_list;
  }
  else if (list_name == "file_dics_list") {
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

















// 新規ファイル 作成
function newFolder(user_name, user_id, userMessage) {

  let field_number = field_dic[userMessage]; // 分野番号
  let field_folder_id; // 分野フォルダID
  let newFolder_number; // 新規フォルダ番号
  let newFolderName; // 新規フォルダ名

  let answer_field_number = field_dic[userMessage]; // 分野番号
  let answer_field_folder_id; // 分野フォルダID
  let newAnswerFolder_number; // 新規フォルダ番号
  let newAnswerFolderName; // 新規フォルダ名

  for (i = 1; i <= 2; ++i) {
    let id;
    if (i == 1) id = questionId;
    else if (i == 2) id = answerId;
    // フォルダ数 取得
    let folder = DriveApp.getFolderById(id).getFoldersByName(userMessage).next() // 分野フォルダ 取得
    let folders = folder.getFolders();
    let count = 0;
    while (folders.hasNext()) {
      count++;
      folders.next();
    }
    if (i == 1) {
      field_folder_id = folder.getId();
      newFolder_number = count + 1;
      newFolderName = field_number + "-" + newFolder_number + "問題フォルダ";
    }
    else if (i == 2) {
      answer_field_folder_id = folder.getId();
      newAnswerFolder_number = count + 1;
      newAnswerFolderName = answer_field_number + "-" + newAnswerFolder_number + "解答フォルダ";
    }
  }

  // ○○-○○問題フォルダ　作成 ＋ ID取得
  let newFolder_id = DriveApp.getFolderById(field_folder_id).createFolder(newFolderName).getId();
  sendText(newFolderName + "を\n作成しました。");
  console.log(newFolderName + "を作成しました。")

  // ○○-○○解答フォルダ　作成 ＋ ID取得
  let newAnswerFolder_id = DriveApp.getFolderById(answer_field_folder_id).createFolder(newAnswerFolderName).getId();
  sendText(newAnswerFolderName + "を\n作成しました。");
  console.log(newAnswerFolderName + "を作成しました。")


  // 保存
  sheet.getRange(5, 5).setValue(newFolder_id);　// 新規フォルダID
  sheet.getRange(14, 5).setValue(newAnswerFolder_id);　// 新規フォルダID
  // ユーザー名
  sheet.getRange(2, 1).setValue(user_name); // 名前
  // 問題
  sheet.getRange(2, 3).setValue(userMessage); // 分野名
  sheet.getRange(2, 4).setValue(field_number); // 分野番号
  sheet.getRange(2, 5).setValue(field_folder_id); // 分野フォルダID
  sheet.getRange(5, 3).setValue(newFolderName); // 新規フォルダ名
  sheet.getRange(5, 4).setValue(newFolder_number); // 新規フォルダ番号
  // 解答
  sheet.getRange(11, 3).setValue(userMessage); // 分野名
  sheet.getRange(11, 4).setValue(answer_field_number); // 分野番号
  sheet.getRange(11, 5).setValue(answer_field_folder_id); // 分野フォルダID
  sheet.getRange(14, 3).setValue(newAnswerFolderName); // 新規フォルダ名
  sheet.getRange(14, 4).setValue(newAnswerFolder_number); // 新規フォルダ番号
}








// セット
function specify(userMessage) {

  if (userMessage == "問題") {
    let newFolder_id = sheet.getRange(5, 5).getValue(); // 新規フォルダID
    sheet.getRange(14, 7).setValue(newFolder_id); // セット
  }
  else if (userMessage == "解答") {
    let newAnswerFolder_id = sheet.getRange(14, 5).getValue(); // 新規フォルダID
    sheet.getRange(14, 7).setValue(newAnswerFolder_id); // セット
  }

  /*
  let user_name = sheet.getRange(2,1).getValue(); // 名前

  let field = sheet.getRange(2,3).getValue(); // 分野名
  let field_number = sheet.getRange(2,4).getValue(); // 分野番号
  let field_folder_id = sheet.getRange(2,5).getValue(); // 分野フォルダID
  let newFolderName = sheet.getRange(5,3).getValue(); // 新規フォルダ名
  let newFolder_number = sheet.getRange(5,4).getValue(); // 新規フォルダ番号
  let newFolder_id = sheet.getRange(5,5).getValue(); // 新規フォルダID
  let doc_num_q = sheet.getRange(5, 2).getValue() // ドキュメント数 問題
  let img_num_q = sheet.getRange(7, 2).getValue() // イメージ数 問題

  let answer_field_number = sheet.getRange(11,4).getValue(); // 分野番号
  let answer_field_folder_id = sheet.getRange(11,5).getValue(); // 分野フォルダID
  let newAnswerFolderName = sheet.getRange(14,3).getValue(); // 新規フォルダ名
  let newAnswerFolder_number = sheet.getRange(14,4).getValue(); // 新規フォルダ番号
  let newAnswerFolder_id = sheet.getRange(14,5).getValue(); // 新規フォルダID
  let doc_num_a = sheet.getRange(14, 2).getValue() // ドキュメント数 解答
  let img_num_a = sheet.getRange(16, 2).getValue() // イメージ数 解答

  let specify_id = sheet.getRange(14, 7).getValue(); // 指定ID
  let log_id = sheet.getRange(11, 7).getValue(); // ログID
  */
}











// ドキュメントファイル 作成
function newFile_Doc(text) {

  // セットされたID 取得
  let id = sheet.getRange(14, 7).getValue();
  // 番号 取得
  let field_number = sheet.getRange(2, 4).getValue(); // 分野番号
  let newFolder_number = sheet.getRange(5, 4).getValue(); // 新規フォルダ番号
  let doc_num_q = (sheet.getRange(5, 2).getValue()) ? Number(sheet.getRange(5, 2).getValue()): 0 // ドキュメント数 問題
  let doc_num_a = (sheet.getRange(14, 2).getValue()) ? Number(sheet.getRange(14, 2).getValue()): 0 // ドキュメント数 解答

  // ドキュメントファイル名 作成
  let new_name = field_number + "-" + newFolder_number

  if (qa_Judg() == "問題") {
    if (doc_num_q > 0) new_name += "("+ String(doc_num_q+1) + ")";
    sheet.getRange(5, 2).setValue(doc_num_q+1); // 数 増加
  }
  else if (qa_Judg() == "解答") {
    new_name += "解答"
    if (doc_num_a > 0) new_name += "("+ String(doc_num_a+1) + ")";
    sheet.getRange(14, 2).setValue(doc_num_a+1); // 数 増加
  }
  else return;
  let doc = DocumentApp.create(new_name);

  // ドキュメント　作成 + ID取得
  let doc_id = doc.getId();
  // 問題フォルダにドキュメントファイルを追加
  let folder = DriveApp.getFolderById(id);
  folder.addFile(DriveApp.getFileById(doc_id));
  // テキスト　追加
  DocumentApp.openById(doc_id).getBody().setText(text);

  // スプレッドシートのログへ保存
  sheet.getRange(11, 7).setValue(doc_id); // ファイルID

  let folderName = folder.getName();
  let fileName = doc.getName();

  sendText(folderName + "に\n" + fileName + "を\n保存しました。");
}


// イメージファイル 作成
function newFile_Img(imageBlob) {

  // セットされたID 取得
  let id = sheet.getRange(14, 7).getValue();

  // フォルダ 取得
  let folder = DriveApp.getFolderById(id);
  // ファイル 作成 + 保存
  let file = folder.createFile(imageBlob);

  // イメージ ID取得
  let img_id = file.getId();
  // スプレッドシートのログへ保存
  sheet.getRange(11, 7).setValue(img_id); // ファイルID

  let folderName = folder.getName();
  let fileName = file.getName();

  sendText(folderName + "に\n" + fileName + "を\n保存しました。")
}





// 削除
function delLogFile() {
  let log_id = sheet.getRange(11, 7).getValue(); // ログID
  let doc_num_q = sheet.getRange(5, 2).getValue() // ドキュメント数 問題
  let doc_num_a = sheet.getRange(14, 2).getValue() // ドキュメント数 解答
  let img_num_q = sheet.getRange(7, 2).getValue() // イメージ数 問題
  let img_num_a = sheet.getRange(16, 2).getValue() // イメージ数 解答

  if (log_id) {
    let file = DriveApp.getFileById(log_id);
    let file_type = file.getMimeType();
    file.setTrashed(true);
    // 数 減少
    if (qa_Judg() == "問題") {
      if (file_type.indexOf("document") != -1 && doc_num_q) sheet.getRange(5, 2).setValue(doc_num_q-1);
      else if (img_num_q) sheet.getRange(7, 2).setValue(img_num_q-1);
    }
    else if (qa_Judg() == "解答") {
      if (file_type.indexOf("document") != -1 && doc_num_a) sheet.getRange(14, 2).setValue(doc_num_a-1);
      else if (img_num_a) sheet.getRange(16, 2).setValue(img_num_a-1);
    }
    sendText(file.getName() + "を削除しました。");
    console.log(file.getName() + "を削除しました。");
  }
  else {
    sendText("削除するものがありません。");
    console.log("削除するものがありません。");
  }
  for (let i of [5, 7, 14, 16]) if (sheet.getRange(i, 2).getValue() == 0) sheet.getRange(i, 2).clear(); // 0なら削除
  sheet.getRange(11, 7).clear();
}





// リセット
function reset(dn = "del") {
  if (dn == "del") {
    let newFolderName = sheet.getRange(5, 3).getValue(); // 新規フォルダ名
    let newFolder_id = sheet.getRange(5, 5).getValue(); // 新規フォルダID
    let newAnswerFolderName = sheet.getRange(14, 3).getValue(); // 新規フォルダ名
    let newAnswerFolder_id = sheet.getRange(14, 5).getValue(); // 新規フォルダID
    if (newFolder_id) {
      DriveApp.getFolderById(newFolder_id).setTrashed(true);
      sendText(newFolderName + "を削除しました。")
    }
    if (newAnswerFolder_id) {
      DriveApp.getFolderById(newAnswerFolder_id).setTrashed(true);
      sendText(newAnswerFolderName + "を削除しました。")
    }
  }

  for (let i of [2, 5, 7, 11, 14, 16]) sheet.getRange(i, 1, 1, 7).clear();
  console.log("リセットしました。")
}






// 今まで問題・解答どちらを作成していたか
function qa_Judg() {
  let specify_id = sheet.getRange(14, 7).getValue();
  let newFolder_id = sheet.getRange(5, 5).getValue();
  let newAnswerFolder_id = sheet.getRange(14, 5).getValue();

  if (specify_id == newFolder_id && specify_id != newAnswerFolder_id) {
    return "問題";
  }
  else if (specify_id == newAnswerFolder_id && specify_id != newFolder_id) {
    return "解答"
  }
  else {
    if (specify_id) errorMessages.push("コード " + getRowNum() + "：IDが一致していません。");
    else errorMessages.push("コード " + getRowNum() + "：IDが未指定です。")
    return "エラー"
  }
}













// 問題・解答　選べる
function aaa() {

  let user_name = "こうちゃん";
  let userMessage = "問題";

  // 作成状況 1～3
  let activity = sheet.getRange(2, 7).getValue();

  // 空白のとき
  if (userMessage == "作成開始" && !activity) {
    // リセット
    reset();
    console.log("分野を選択してください。");
    sheet.getRange(2, 7).setValue(1); // 1へ
  }

  // 1のとき
  if (activity == 1) {

    let field = [
      "物理・生体物性",
      "電気・電子工学",
      "生体計測",
      "治療機器",
      "呼吸・麻酔",
      "体外循環",
      "血液浄化法",
      "画像診断",
      "安全管理学",
      "消毒・滅菌",
      "医学的知識"
    ];

    // userMessageがfieldに含まれているか
    if (field.includes(userMessage)) {
      // 新規ファイル 作成
      newFolder(user_name, userMessage, field);
      console.log("問題・解答、どちらかを選択してください。");
      sheet.getRange(2, 7).setValue(2); // 2へ
    }
    else {
      console.log("分野を選択してください。");
    }
  }

  // 2のとき
  if (activity == 2) {
    if (userMessage == "問題" || userMessage == "解答") {
      // ID指定
      specify(userMessage);
      console.log("文章、写真を送信してください。");
      sheet.getRange(2, 7).setValue(3); // 3へ
    }
    else {
      console.log("問題・解答、どちらかを選択してください。");
    }
  }

  // 3のとき
  if (activity == 3) {
    if (event.message.type == "text") {
      // テキスト 取得
      let text = event.message.text;

      if (text == "問題" || text == "解答") {
        sheet.getRange(2, 7).setValue(4); // 4へ
        console.log(text + "の作成を始めます。/nよろしいですか？");
      }
      else if (text.indexOf("終了")) {
        sheet.getRange(2, 7).setValue(5); // 5へ

      }
      else {
        // ドキュメントファイル 作成
        newFile_Doc(text);
      }
    }
    else if (event.message.type == "image" || event.message.type == "video") {
      // イメージBlob 取得
      let imageBlob = getImage(LINE_END_POINT, event.message.type);
      // イメージファイル 作成
      newFile_Img(imageBlob);
    }
    else {
      sendText("文章、写真を送信してください。");
    }
  }

  // 4のとき

  if (activity == 4) {
    if (userMessage == "はい") {
      sheet.getRange(2, 7).setValue(2); // 2へ
      console.log("文章、写真を送信してください。");
    }
    else if (userMessage == "いいえ") {
      console.log("文章、写真を送信してください。");
    }
  }






  if (userMessage == "リセット") {
    reset();
    sendText("リセットしました。")
  }


}








// 問題・解答　選べない
function bbb() {

  let user_name = "こうちゃん";
  let userMessage = "はい";
  let eventmessagetype = "text";
  let eventmessagetext = userMessage;

  if (userMessage == "リセット") {
    reset();
    // sendText("リセットしました。")
    return;
  }

  // 作成状況 1～3
  let activity = sheet.getRange(2, 7).getValue();

  // 空白のとき
  if (userMessage == "作成開始" && !activity) {
    // リセット
    reset();
    console.log("分野を選択してください。");
    sheet.getRange(2, 7).setValue(1); // 1へ
  }

  // 1のとき
  if (activity == 1) {

    let field = [
      "物理・生体物性",
      "電気・電子工学",
      "生体計測",
      "治療機器",
      "呼吸・麻酔",
      "体外循環",
      "血液浄化法",
      "画像診断",
      "安全管理学",
      "消毒・滅菌",
      "医学的知識"
    ];

    // userMessageがfieldに含まれているか
    if (field.includes(userMessage)) {
      // 新規ファイル 作成
      // newFolder(user_name, userMessage, field);
      console.log("問題を作成します。");
      // セット
      specify("問題");
      console.log("問題文、写真を送信してください。/n送信完了後、「完了」と/n送信してください。");
      sheet.getRange(2, 7).setValue(2); // 2へ
    }
    else {
      console.log("分野を選択してください。");
    }
  }

  // 2のとき
  if (activity == 2) {
    if (eventmessagetype == "text") {
      // テキスト 取得
      let text = eventmessagetext;
      // 指定ID 取得
      let specify_id = sheet.getRange(14, 7).getValue();

      if (text == "完了") {
        let newFolder_id = sheet.getRange(5, 5).getValue();

        // 問題を作成していたなら
        if (newFolder_id == specify_id) {
          sheet.getRange(2, 7).setValue(3); // 3へ
          console.log("解答の作成を始めます。/nよろしいですか？");
        }
        else {
          console.log("解答・解説、写真を送信してください。/n送信完了後、「終了」と/n送信してください。");
        }
      }

      else if (text == "終了") {
        let newAnswerFolder_id = sheet.getRange(14, 5).getValue();

        // 解答を作成していたなら
        if (newAnswerFolder_id == specify_id) {
          sheet.getRange(2, 7).setValue(4); // 4へ
          console.log("終了します。/nよろしいですか？");
        }
        else {
          console.log("問題文、写真を送信してください。/n送信完了後、「完了」と/n送信してください。");
        }
      }

      else {
        // ドキュメントファイル 作成
        // newFile_Doc(text);
        console.log(text);
        console.log("ドキュメントファイル作成完了");
      }
    }
    else if (eventmessagetype == "image") {
      // イメージBlob 取得
      // let imageBlob = getImage(LINE_END_POINT, event.message.type);
      // イメージファイル 作成
      // newFile_Img(imageBlob);
      console.log("イメージファイル作成完了");
    }
    else {
      console.log("文章、写真を送信してください。");
      // sendText("文章、写真を送信してください。");
    }
  }

  // 3のとき
  if (activity == 3) {
    if (userMessage == "はい") {
      // セット
      specify("解答");
      sheet.getRange(2, 7).setValue(2); // 2へ
      console.log("解答・解説、写真を送信してください。/n送信完了後、「終了」と/n送信してください。");
    }
    else if (userMessage == "いいえ") {
      sheet.getRange(2, 7).setValue(2); // 2へ
      console.log("問題文、写真を送信してください。/n送信完了後、「完了」と/n送信してください。");
    }
    else {
      console.log("解答の作成を始めます。/nよろしいですか？");
    }
  }

  // 4のとき
  if (activity == 4) {
    if (userMessage == "はい") {
      // リセット
      reset();
      console.log("終了しました。");
    }
    else if (userMessage == "いいえ") {
      sheet.getRange(2, 7).setValue(2); // 2へ
      console.log("解答・解説、写真を送信してください。/n送信完了後、「終了」と/n送信してください。");
    }
    else {
      console.log("終了します。/nよろしいですか？");
    }
  }
}








function mechanism() {

  let count_field_folder = 0;
  let count_qa_folder = 0;
  let count_file = 0;

  let qa_counter = {};

  // ME2種　問題
  let folder0 = DriveApp.getFoldersByName("ME2種　問題").next();

  // 物理・生体物性、電気・電子工学・・・
  // let folders1 = DriveApp.getFoldersByName("ME2種　問題").next().getFolders();
  let folders1 = folder0.getFolders();

  while (folders1.hasNext()) {
    count_field_folder++;
    console.log("count_field_folder : ", count_field_folder);

    // 物理・生体物性
    // let folder1_1 = DriveApp.getFoldersByName("ME2種　問題").next().getFolders().next();
    let folder1_1 = folders1.next();

    console.log(folder1_1.getName());

    // 1-1問題ファイル、1-2問題ファイル・・・
    // let folders2 = DriveApp.getFoldersByName("ME2種　問題").next().getFolders().next().getFolders();
    let folders2 = folder1_1.getFolders();

    let count = 0;
    while (folders2.hasNext()) {
      count_qa_folder++;
      count++;
      console.log("count_qa_folder : ", count_qa_folder);

      // 1-1問題ファイル
      // let folder2_1 = DriveApp.getFoldersByName("ME2種　問題").next().getFolders().next().getFolders().next();
      let folder2_1 = folders2.next();

      console.log(folder2_1.getName());

      // 1-1.doc, 1-1.jpeg・・・
      // let files3 = DriveApp.getFoldersByName("ME2種　問題").next().getFolders().next().getFolders().next().getFiles();
      let files3 = folder2_1.getFiles();

      while (files3.hasNext()) {
        count_file++;
        console.log("count_file : ", count_file);

        // 1-1.doc
        // let file3_1 = DriveApp.getFoldersByName("ME2種　問題").next().getFolders().next().getFolders().next().getFiles().next();
        let file3_1 = files3.next();

        console.log(file3_1.getName());
      }
      qa_counter[folder1_1.getName()] = count;
    }
  }
  console.log("全分野数 : ", count_field_folder);
  console.log("全問題フォルダ数 : ", count_qa_folder);
  console.log("全ファイル数 : ", count_file);
  console.log(qa_counter);
}














