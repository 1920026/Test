/*
削除：getRichmenus()→deleteRichmenu()のIDを変更→deleteRichmenu()→deleteRichmenuAlias()
 */




const url_richmenu = 'https://api.line.me/v2/bot/richmenu';
const url_richmenu_data = 'https://api-data.line.me/v2/bot/richmenu/';
const url_user = 'https://api.line.me/v2/bot/user';
const access_token = '**************************';


function action(){

  const richmenuId_1 = makeRichmenu_largeSize_1();
  console.log("リッチメニュー１　作成")
  setImage_Richmenu(richmenuId_1, "*********************");
  console.log("１のイメージ　セット")
  setRichmenu_toAllUser(richmenuId_1);
  console.log("デフォルトにセット")

  const richmenuId_2 = makeRichmenu_largeSize_2();
  console.log("リッチメニュー２　作成")
  setImage_Richmenu(richmenuId_2, "*********************");
  console.log("２のイメージ　セット")

  makeRichmenu_alias_1(richmenuId_1);
  console.log("エイリアス１　作成")
  makeRichmenu_alias_2(richmenuId_2);
  console.log("エイリアス２　作成")
  

  getRichmenus();
}





function makeRichmenu_largeSize_1() {
  var url = url_richmenu;

  var areas = [];
  // ボタン
  /*
  areas[0] = {
    'bounds': {'x': 0,'y': 0,'width': 1250,'height': 337.2},
  };
  */
  areas[0] = {
    'bounds': {'x': 1250,'y': 0,'width': 1250,'height': 337.2},
    'action': {
      'type': 'richmenuswitch',
      'richMenuAliasId': 'richmenu-alias-2',
      'data': 'richmenu-changed-to-2',
    }
  };
  areas[1] = {
    'bounds': {'x': 0,'y': 337.2,'width': 833,'height': 674.4},
    'action': {'type': 'message','text': '問題'}
  };
  areas[2] = {
    'bounds': {'x': 833,'y': 337.2,'width': 833,'height': 674.4},
    'action': {'type': 'message','text': '物理・生体物性'}
  };
  areas[3] = {
    'bounds': {'x': 1666,'y': 337.2,'width': 834,'height': 674.4},
    'action': {'type': 'message','text': '電気・電子工学'}
  };
  areas[4] = {
    'bounds': {'x': 0,'y': 1011.6,'width': 833,'height': 674.4},
    'action': {'type': 'message','text': '生体計測'}
  };
  areas[5] = {
    'bounds': {'x': 833,'y': 1011.6,'width': 833,'height': 674.4},
    'action': {'type': 'message','text': '治療機器'}
  };
  areas[6] = {
    'bounds': {'x': 1666,'y': 1011.6,'width': 834,'height': 674.4},
    'action': {'type': 'message','text': '呼吸・麻酔'}
  };
  
  var postData = {
    'size': {'width': 2500,'height': 1686},
    //デフォルトのリッチメニューにするかどうか
    'selected': false,
    //リッチメニュー管理用の名前　ユーザには非公開
    'name': "menu_1",
    //トークルームメニューに表示されるテキスト
    'chatBarText': "メニュー",
    //タップ領域群
    'areas': areas,
  };

  var headers = {
    'Content-Type': 'application/json; charset=UTF-8',
    'Authorization': 'Bearer ' + access_token,
  };

  var options = {
    'method': 'post',
    'headers': headers,
    'payload': JSON.stringify(postData),
  };

  var json = UrlFetchApp.fetch(url, options);
  json = JSON.parse(json);
  console.log(json.richMenuId)
  return json.richMenuId;
}




function makeRichmenu_largeSize_2() {
  var url = url_richmenu;

  var areas = [];
  // ボタン
  areas[0] = {
    'bounds': {'x': 0,'y': 0,'width': 1250,'height': 337.2},
    'action': {
      'type': 'richmenuswitch',
      'richMenuAliasId': 'richmenu-alias-1',
      'data': 'richmenu-changed-to-1',
    }
  };
  /*
  areas[1] = {
    'bounds': {'x': 833,'y': 0,'width': 833,'height': 843},
    'action': {'type': 'message','text': '血液浄化法'}
  };
  */
  areas[1] = {
    'bounds': {'x': 0,'y': 337.2,'width': 833,'height': 674.4},
    'action': {'type': 'message','text': '体外循環'}
  };
  areas[2] = {
    'bounds': {'x': 833,'y': 337.2,'width': 833,'height': 674.4},
    'action': {'type': 'message','text': '血液浄化法'}
  };
  areas[3] = {
    'bounds': {'x': 1666,'y': 337.2,'width': 834,'height': 674.4},
    'action': {'type': 'message','text': '画像診断'}
  };
  areas[4] = {
    'bounds': {'x': 0,'y': 1011.6,'width': 833,'height': 674.4},
    'action': {'type': 'message','text': '安全管理学'}
  };
  areas[5] = {
    'bounds': {'x': 833,'y': 1011.6,'width': 833,'height': 674.4},
    'action': {'type': 'message','text': '消毒・滅菌'}
  };
  areas[6] = {
    'bounds': {'x': 1666,'y': 1011.6,'width': 834,'height': 674.4},
    'action': {'type': 'message','text': '医学的知識'}
  };
  
  var postData = {
    'size': {'width': 2500,'height': 1686},
    //デフォルトのリッチメニューにするかどうか
    'selected': false,
    //リッチメニュー管理用の名前　ユーザには非公開
    'name': "menu_2",
    //トークルームメニューに表示されるテキスト
    'chatBarText': "メニュー",
    //タップ領域群
    'areas': areas,
  };

  var headers = {
    'Content-Type': 'application/json; charset=UTF-8',
    'Authorization': 'Bearer ' + access_token,
  };

  var options = {
    'method': 'post',
    'headers': headers,
    'payload': JSON.stringify(postData),
  };

  var json = UrlFetchApp.fetch(url, options);
  json = JSON.parse(json);
  console.log(json.richMenuId)
  return json.richMenuId;
}







/**
 * 作成済リッチメニューに画像ファイルを紐づけ
 * GoogleDriveに格納している画像ファイルを、PNGファイルとしてアップロードする例
 * 
 * @param {string} richmenuId - リッチメニュー固有のID
 * @param {string} drive_fileId - GoogleDriveのファイルID
 * @return {Object} json - 結果
 */
function setImage_Richmenu(richmenuId, drive_fileId) {
  var url = url_richmenu_data + '/' + richmenuId + '/content';

  //GoogleDriveからファイルIDで画像ファイルを開く
  var image = DriveApp.getFileById(drive_fileId);

  //開いた画像ファイルをPNG形式・BLOBに変換
  var blob = image.getAs(MimeType.PNG);

  var headers = {
    'Content-Type': 'image/png',
    'Authorization': 'Bearer ' + access_token,
  };

  var options = {
    'method': 'post',
    'headers': headers,
    //payloadにBLOBをそのまま乗せる
    'payload': blob,
  };

  var json = UrlFetchApp.fetch(url, options);
  json = JSON.parse(json);
  return json;
}







/**
 * リッチメニューを全員にセット、即時で反映される
 * 
 * @param {string} uid - LINEユーザ固有のID
 * @param {string} richmenuId - リッチメニュー固有のID
 * @return {Object} json - 結果
 */
function setRichmenu_toAllUser(richmenuId) {
  var url = url_user + '/' + "all" + '/richmenu/' + richmenuId;

  var headers = {
    'Authorization': 'Bearer ' + access_token,
  };

  var options = {
    'method': 'post',
    'headers': headers,
  };

  var json = UrlFetchApp.fetch(url, options);
  json = JSON.parse(json);
  return json;
}





function makeRichmenu_alias_1(richmenuId_1){
  var url = url_richmenu + "/alias";

  var postData = {
    "richMenuAliasId": "richmenu-alias-1",
    "richMenuId": richmenuId_1
  }

  var headers = {
    'Content-Type': 'application/json; charset=UTF-8',
    'Authorization': 'Bearer ' + access_token,
  };

  var options = {
    'method': 'post',
    'headers': headers,
    'payload': JSON.stringify(postData),
  };

  var json = UrlFetchApp.fetch(url, options);
  json = JSON.parse(json);
  return json;
}







function makeRichmenu_alias_2(richmenuId_2){
  var url = url_richmenu + "/alias";

  var postData = {
    "richMenuAliasId": "richmenu-alias-2",
    "richMenuId": richmenuId_2
  }

  var headers = {
    'Content-Type': 'application/json; charset=UTF-8',
    'Authorization': 'Bearer ' + access_token,
  };

  var options = {
    'method': 'post',
    'headers': headers,
    'payload': JSON.stringify(postData),
  };

  var json = UrlFetchApp.fetch(url, options);
  json = JSON.parse(json);
  return json;
}










/**
 * MessagingAPIから作成したリッチメニューを取得
 * 
 * @return {Object} json - 取得したリッチメニュー一覧
 */
function getRichmenus() {
  var url = url_richmenu + '/list';

  var headers = {
    'Authorization': 'Bearer ' + access_token,
  };

  var options = {
    'method': 'get',
    'headers': headers,
  };

  var json = UrlFetchApp.fetch(url, options);
  json = JSON.parse(json);
  console.log(json);
  return json;
}


/**
 * リッチメニューを削除
 * 特定ユーザに紐づけている場合は、ユーザが再度トークルームに入室した際に反映
 * 
 * @param {string} richmenuId - リッチメニュー固有のID
 * @return {Object} json - 結果
 */
function deleteRichmenu() {
  const richmenuId = [];
  richmenuId[0] = "**************************";
  richmenuId[1] = "**********************";

  for (let i = 0; i < richmenuId.length; ++i){
    var url = url_richmenu + '/' + richmenuId[i];
    var headers = {
      'Authorization': 'Bearer ' + access_token,
    };
    var options = {
      'method': 'delete',
      'headers': headers,
    };
    var json = UrlFetchApp.fetch(url, options);
    json = JSON.parse(json);
  }
  /*
  var url = url_richmenu + '/' + richmenuId;

  var headers = {
    'Authorization': 'Bearer ' + access_token,
  };

  var options = {
    'method': 'delete',
    'headers': headers,
  };

  var json = UrlFetchApp.fetch(url, options);
  json = JSON.parse(json);
  */
  getRichmenus();
  return json;
}












function getRichmenuAliases() {
  var url = url_richmenu + '/alias' +'/list';

  var headers = {
    'Authorization': 'Bearer ' + access_token,
  };

  var options = {
    'method': 'get',
    'headers': headers,
  };

  var json = UrlFetchApp.fetch(url, options);
  json = JSON.parse(json);
  console.log(json);
  return json;
}


function deleteRichmenuAlias() {
  const richMenuAliasId = [];
  richMenuAliasId[0] = "richmenu-alias-1";
  richMenuAliasId[1] = "richmenu-alias-2";

  for (let i = 0; i < richMenuAliasId.length; ++i){
    var url = url_richmenu + '/' + "alias/" + richMenuAliasId[i];
    var headers = {
      'Authorization': 'Bearer ' + access_token,
    };
    var options = {
      'method': 'delete',
      'headers': headers,
    };
    var json = UrlFetchApp.fetch(url, options);
    json = JSON.parse(json);
  }

  /*
  var url = url_richmenu + '/' + "alias/" + richMenuAliasId;

  var headers = {
    'Authorization': 'Bearer ' + access_token,
  };

  var options = {
    'method': 'delete',
    'headers': headers,
  };

  var json = UrlFetchApp.fetch(url, options);
  json = JSON.parse(json);
  */
  getRichmenuAliases();
  return json;
}













