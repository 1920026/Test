// エラーを出さないように、エラーを送る。
// 形態素解析 1文のみ。改行ありはできない。長すぎてもダメ？

const LINE_TOKEN = '*******************************************';
const LINE_URL = 'https://api.line.me/v2/bot/message/reply';

const messages = [];



function ocr(blob, adjust_yn, sheet, replyToken) {
  try {
    let sheet = SpreadsheetApp.openById("********************************").getSheetByName("シート1");

    // フォルダ = マイドライブ>LINE bot　ME2種>Google Apps Script
    let img_id = DriveApp.getFolderById("********************").createFile(blob).getId();
    let resource = {
      title: "test"
    }
    let option = {
      "ocr": true,
      "ocrLanguage": "ja"
    }
    // ocrデータ 付属
    let img_ocr = Drive.Files.copy(resource, img_id, option);
    // テキスト 取得
    let text = DocumentApp.openById(img_ocr.id).getBody().getText();
    sheet.getRange(1,1).setValue(text);
    // 削除
    Drive.Files.remove(img_ocr.id);
    Drive.Files.remove(img_id);

    if (adjust_yn == "yes") text = adjust(text); // 選択肢あり
    else if (adjust_yn == "no") text = adjust2(text); // 選択肢なし

    return text;

  }catch(e) {
    console.log("リセットしました。");
    sendText("エラー");
    sendText(e.stack);
    SpreadsheetApp.openById("*******************************").deleteSheet(sheet); // 作成botのシートを削除
    sendText("リセットしました。");
    sendMessages(messages, replyToken);
  }
}









// 選択肢を含む
function adjust(text) {
  let sheet = SpreadsheetApp.openById("******************************").getSheetByName("シート1");
  let n = 1;
  text = text.replace(/\s+/g, ""); // 全角空白、半角空白、改行 削除
  sheet.getRange(n+1,1).setValue(text);
  text = text.replace(/[！-～]/g, function(s){return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);}); // 全→半
  sheet.getRange(n+2,1).setValue(text);
  let error_message = [];
  try {
    let n = 1;
    text = text.replace(/\(\d+\-\d+\)/, ""); // (00-00)を1つ削除
    sheet.getRange(n+3,1).setValue(text);
    text = text.replace(/(\(\d+\))/g, '\n' + "$1") // '\n'選択肢
    sheet.getRange(n+4,1).setValue(text);
    // 並べ替え
    let dic_array = text.match(/\(\d+\).+/g).map(function(s) {
      let match = s.match(/\((\d+)\)(.+)/);
      return { key: match[1], value: match[2] }
    });
    dic_array.sort((a,b) => a.key - b.key);
    let t = dic_array.map(i => "(" + i.key + ")" + i.value).join("\n"); // 結合
    sheet.getRange(n+5,1).setValue(t);
    text = text.replace(/\(\d+\).*\n*/g, '') + '\n' + t;
    sheet.getRange(n+6,1).setValue(text);
    text = text.replace(/\(\d+\)/g, function(s){
      return s.split('').map(i => String.fromCharCode(i.charCodeAt(0) + 0xFEE0)).join(''); // (1)→（１）
    });
    sheet.getRange(n+7,1).setValue(text);

    [...Array(8)].forEach((v, i) => sheet.getRange(i+1,1,1,12).merge()); // セル 結合
  } catch(e) {
    error_message.push("整形できませんでした。");
  }

  // 改行
  let text_line = text.split('\n'); // 行区切り
  let tex = "";
  text_line.forEach(function(sentence, i) {
    let count = 0;
    for (let str of sentence) (str.match(/[ -~]/)) ? count += 1: count += 2;
    if (count > 27) {
      try {
        sentence = yahooTextSegmentation(sentence); // 形態素解析 yahooTextSegmentation()
      } catch(e) {
        if (error_message.length <= 2) error_message.push("Yahoo!のリクエストに\n失敗しました。");
        sentence = textSplit(sentence); // 27文字区切り
      }
    }
    if (i == 0) tex += sentence;
    else tex += '\n' + sentence;
  })
  text = tex;

  error_message = error_message.join('\n\n');
  if (error_message) error_message += '\n\n';
  return error_message + text;
}



// 選択肢を含まない
function adjust2(text) {
  let sheet = SpreadsheetApp.openById("*********************************").getSheetByName("シート1");
  let n = 1;
  text = text.replace(/[！-～]/g, function(s){return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);}); // 全→半
  sheet.getRange(n+2,1).setValue(text);
  let error_message = "";

  // 改行
  let text_line = text.split('\n'); // 行区切り
  let tex = "";
  text_line.forEach(function(sentence, i) {
    let count = 0;
    for (let str of sentence) (str.match(/[ -~]/)) ? count += 1: count += 2;
    if (count > 27) {
      try {
        sentence = yahooTextSegmentation(sentence); // 形態素解析 yahooTextSegmentation()
      } catch(e) {
        error_message = "Yahoo!のリクエストに\n失敗しました。";
        sentence = textSplit(sentence); // 27文字区切り
      }
    }
    if (i == 0) tex += sentence;
    else tex += '\n' + sentence;
  })
  text = tex;

  if (error_message) error_message += '\n\n';
  return error_message + text;
}







// 形態素解析
function yahooTextSegmentation(text)
{
  // text 改行あったらできない。1文のみ。
  var myAppid = '******************************************';
  text = encodeURIComponent(text);
  var myUrl = "http://jlp.yahooapis.jp/MAService/V1/parse?appid="+myAppid+"&results=ma&sentence="+text;

  var myXml = UrlFetchApp.fetch(myUrl); // エラーの原因
  
  var myDoc = XmlService.parse(myXml.getContentText());
  var namespace = XmlService.getNamespace("urn:yahoo:jp:jlp");
  var root = myDoc.getRootElement();
  var maResult = root.getChild("ma_result", namespace);
  var wordList = maResult.getChild("word_list", namespace);
  var wordArray = wordList.getChildren("word", namespace);
  var surface = wordArray[0].getChild("surface", namespace);
  var array = [];
  for (var i=0; i < wordArray.length; i++) {
    array[i] = {
      'word':wordArray[i].getAllContent()[0].asElement().getText(),
      'reading':wordArray[i].getAllContent()[1].asElement().getText(),
      'pos':wordArray[i].getAllContent()[2].asElement().getText(),
    };
  }
  // console.log("array", array); // 形態素解析 結果

  let reg = new RegExp(/^[!%')\*\+\-.,\/:;>?@\\\]^_`|}~？！。、」』】はがのをにへとで]$/); // 前の単語にくっつける
  let array2 = [];
  for (let item of array) {
    if (array2.length == 0) array2.push(item["word"]);
    else if (reg.test(item["word"]) || (item["word"].length == 1 && item["pos"] != "名詞" && item["pos"] != "特殊")) {
      array2[array2.length - 1] = array2[array2.length - 1] + item["word"];
    }
    else array2.push(item["word"]);
  }
  // console.log(array2.join("|")); // 文節区切り

  let indention = "\n";
  let blank_length = 0;
  if (/（[０-９]+）/.test(text)) {
    indention += "　　" + "　".repeat(text.match(/（([０-９]+)）/)[1].length); // （１）分の空白
    blank_length = 4 + 2 * text.match(/（([０-９]+)）/)[1].length; // 空白の文字数
  }
  let sentence = "";
  let count = 0;
  for (let word of array2) {
    let word_count = 0;
    for (let str of word) (str.match(/[ -~]/)) ? word_count += 1: word_count += 2;
    count += word_count;
    // console.log(count);
    if (count > 27) {
      sentence += indention; // 改行
      count = blank_length + word_count; // 空白 + 余った文字列　の文字数
    }
    sentence += word;
    // console.log(sentence);
  }
  text = sentence;
  return text;
}



// 27文字で改行
function textSplit(text) {
  let sentence = "";
  let count = 0;
  let word_count = 0;

  for (let str of text) {
    if (str.match(/[ -~]/)) word_count += 1;
    else word_count += 2;
    count += word_count;
    // console.log(count);
    if (count > 27) {
      sentence += "\n";
      count = word_count;
    }
    sentence += str;
    word_count = 0;
    // console.log(sentence);
  }
  text = sentence;
  return text;
}






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

















function test() {
  // ocr()
  let text = "ペースメーカ装着患者に対する治療・検査において、ほとんど影響がないま のはO、条件付きながら使用可能なものは△、使用が禁止されているものに は×を付けなさい。上に等しい。1(1)除細動器 (4) MRI (7) y線照射装置(2) 電気メス (5)X線CT (8) 高周波電気療法機器(3) ハイパーサーミア (6) 超音波診断装置(9)形態素解析の結果を配列に押し込む際に、文末記号や閉じ括弧、”てにをは”のような1文字ではないかを判断。";

  text = text.replace(/\s+/g, ""); // 全角空白、半角空白、改行 削除
  console.log("1\n", text);
  text = text.replace(/[！-～]/g, function(s){return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);}); // 全→半
  console.log("2\n", text);

  // adjust()
  text = text.replace(/\(\d+\-\d+\)/, ""); // (00-00)を1つ削除
  console.log("3\n", text);
  text = text.replace(/(\(\d+\))/g, '\n' + "$1") // '\n'選択肢
  console.log("4\n", text);
  // 並べ替え
  let dic_array = text.match(/\(\d+\).+/g).map(function(s) {
    let match = s.match(/\((\d+)\)(.+)/);
    return { key: match[1], value: match[2] }
  });
  dic_array.sort((a,b) => a.key - b.key);
  console.log("5\n", dic_array);
  let t = dic_array.map(i => "(" + i.key + ")" + i.value).join("\n"); // 結合
  console.log("6\n", t);
  text = text.replace(/\(\d+\).*\n*/g, '') + '\n' + t;
  console.log("7\n", text); 
  text = text.replace(/\(\d+\)/g, function(s){
    return s.split('').map(i => String.fromCharCode(i.charCodeAt(0) + 0xFEE0)).join(''); // (1)→（１）
  });
  console.log("8\n", text);

  try {
    // 改行
    let text_line = text.split('\n'); // 行区切り
    let tex = "";
    text_line.forEach(function(sentence, i) {
      let count = 0;
      for (let str of sentence) (str.match(/[ -~]/)) ? count += 1: count += 2;
      if (count > 27) {
        try {
          sentence = yahooTextSegmentation(sentence); // 形態素解析 yahooTextSegmentation()
        } catch(e) {
          console.log("Yahoo!のリクエストに\n失敗しました。");
          sentence = textSplit(sentence); // 27文字区切り
        }
      }
      if (i == 0) tex += sentence;
      else tex += '\n' + sentence;
    })
    text = tex;
    console.log(9);
    console.log(text);
  } catch(e) {
    console.log(9);
    console.log(e.stack + '\n\n' + text);
  }
}




















