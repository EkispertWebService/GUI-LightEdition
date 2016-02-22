/**
 *  駅すぱあと Web サービス
 *  駅名入力パーツ
 *  サンプルコード
 *  https://github.com/EkispertWebService/GUI-LightEdition
 *  
 *  Version:2016-02-22
 *  
 *  Copyright (C) Val Laboratory Corporation. All rights reserved.
 **/

var expGuiStation = function (pObject, config) {
    /*
    * ドキュメントのオブジェクトを格納
    */
    var documentObject = pObject;
    var baseId = pObject.id;

    /*
    * Webサービスの設定
    */
    var apiURL = "http://api.ekispert.com/";

    /*
    * GETパラメータからキーの設定
    */
    var key;
    var scripts = document.getElementsByTagName("script");
    for (var i = 0; i < scripts.length; i++) {
        var s = scripts[i];
        imagePath = s.src.substring(0, s.src.indexOf("expGuiStation\.js"));
        if (s.src && s.src.match(/expGuiStation\.js(\?.*)?/)) {
            var params = s.src.replace(/.+\?/, '');
            params = params.split("&");
            for (var i = 0; i < params.length; i++) {
                var tmp = params[i].split("=");
                if (tmp[0] == "key") {
                    key = unescape(tmp[1]);
                }
            }
            break;
        }
    }

    /*
    * AGENTのチェック
    */
    var agent = 1;
    var isiPad = navigator.userAgent.match(/iPad/i) != null;
    var isiPhone = navigator.userAgent.match(/iPhone/i) != null;
    var isAndroid_phone = (navigator.userAgent.match(/Android/i) != null && navigator.userAgent.match(/Mobile/i) != null);
    var isAndroid_tablet = (navigator.userAgent.match(/Android/i) != null && navigator.userAgent.match(/Mobile/i) == null);
    if (isiPhone || isAndroid_phone) { agent = 2; }
    if (isiPad || isAndroid_tablet) { agent = 3; }

    /*
    * イベントの設定(IE対応版)
    */
    function addEvent(element, eventName, func) {
        if (element) {
            if (typeof eventName == 'string' && typeof func == 'function') {
                if (element.addEventListener) {
                    element.addEventListener(eventName, func, false);
                } else if (element.attachEvent) {
                    element.attachEvent("on" + eventName, func);
                }
            }
        }
    }

    /*
    * 変数郡
    */
    var stationList = new Array(); // インクリメンタルサーチ結果
    var httpObj; // インクリメンタルサーチのリクエストオブジェクト
    var oldvalue = ""; // キー監視用の文字列

    var stationType;
    var stationPrefectureCode;

    var callBackFunction = new Object();

    var maxStation = 30; //最大駅数

    var stationSort = new Array(createSortObject("train"), createSortObject("plane"), createSortObject("ship"), createSortObject("bus"));
    function createSortObject(type) {
        var tmpObj = new Object();
        tmpObj.type = type;
        tmpObj.visible = true;
        return tmpObj;
    }

    /*
    * 駅名入力の設置
    */
    function dispStation() {
        // 駅名入力
        var buffer;
        if (agent == 1) {
            buffer = '<div class="expGuiStation expGuiStationPc">';
        } else if (agent == 2) {
            buffer = '<div class="expGuiStation expGuiStationPhone">';
        } else if (agent == 3) {
            buffer = '<div class="expGuiStation expGuiStationTablet">';
        }
        if (agent == 1 || agent == 3) {
            buffer += '<div><input class="exp_station" type="text" id="' + baseId + ':stationInput" autocomplete="off"></div>';
            buffer += '<div class="exp_stationList" id="' + baseId + ':stationList" style="display:none;">';
            if (agent == 3) {
                buffer += '<div class="exp_stationTabList exp_clearfix">';
                buffer += '<span class="exp_stationTab"><input type="checkbox" class="exp_stationTabCheck" id="' + baseId + ':stationView:' + String(1) + '" value="1"><label class="exp_stationTabTextLeft" for="' + baseId + ':stationView:' + String(1) + '">駅</label></span>';
                buffer += '<span class="exp_stationTab"><input type="checkbox" class="exp_stationTabCheck" id="' + baseId + ':stationView:' + String(2) + '" value="1"><label class="exp_stationTabText" for="' + baseId + ':stationView:' + String(2) + '">空港</label></span>';
                buffer += '<span class="exp_stationTab"><input type="checkbox" class="exp_stationTabCheck" id="' + baseId + ':stationView:' + String(3) + '" value="1"><label class="exp_stationTabText" for="' + baseId + ':stationView:' + String(3) + '">船</label></span>';
                buffer += '<span class="exp_stationTab"><input type="checkbox" class="exp_stationTabCheck" id="' + baseId + ':stationView:' + String(4) + '" value="1"><label class="exp_stationTabTextRight" for="' + baseId + ':stationView:' + String(4) + '">バス</label></span>';
                buffer += '</div>';
            }
            buffer += '<div class="exp_stationSelect" id="' + baseId + ':stationSelect"></div>';
            buffer += '</div>';
        } else if (agent == 2) {
            buffer += '<input class="exp_station" type="text" id="' + baseId + ':stationOutput">';
            buffer += '<div class="exp_stationPopupBack" id="' + baseId + ':stationPopupBack"style="display:none;">';
            buffer += '<div class="exp_stationPopup" id="' + baseId + ':stationPopup" style="display:none;">';
            buffer += '<div class="exp_stationInputHeader exp_clearfix">';
            buffer += '<div class="exp_stationInputBack"><a id="' + baseId + ':stationBack" href="Javascript:void(0);"></a></div>';
            buffer += '<div class="exp_stationInputText"><input type="text" id="' + baseId + ':stationInput" autocomplete="off"></div>';
            buffer += '</div>';
            buffer += '<div class="exp_stationTabList exp_clearfix">';
            buffer += '<span class="exp_stationTab"><input type="checkbox" class="exp_stationTabCheck" id="' + baseId + ':stationView:' + String(1) + '" value="1"><label class="exp_stationTabText" for="' + baseId + ':stationView:' + String(1) + '">駅</label></span>';
            buffer += '<span class="exp_stationTab"><input type="checkbox" class="exp_stationTabCheck" id="' + baseId + ':stationView:' + String(2) + '" value="1"><label class="exp_stationTabText" for="' + baseId + ':stationView:' + String(2) + '">空港</label></span>';
            buffer += '<span class="exp_stationTab"><input type="checkbox" class="exp_stationTabCheck" id="' + baseId + ':stationView:' + String(3) + '" value="1"><label class="exp_stationTabText" for="' + baseId + ':stationView:' + String(3) + '">船</label></span>';
            buffer += '<span class="exp_stationTab"><input type="checkbox" class="exp_stationTabCheck" id="' + baseId + ':stationView:' + String(4) + '" value="1"><label class="exp_stationTabText" for="' + baseId + ':stationView:' + String(4) + '">バス</label></span>';
            buffer += '</div>';
            buffer += '<div class="exp_stationSPListBase" id="' + baseId + ':stationList" style="display:none;">';
            buffer += '<div class="exp_stationSPList exp_clearfix" id="' + baseId + ':stationSelect"></div>';
            buffer += '</div>';
            buffer += '</div>';
            buffer += '</div>';
        }
        buffer += '</div>';
        // HTMLへ出力
        documentObject.innerHTML = buffer;
        // イベントの設定
        addEvent(document.getElementById(baseId + ":stationInput"), "keyup", inputStation);
        if (agent == 1 || agent == 3) {
            addEvent(document.getElementById(baseId + ":stationInput"), "blur", onblurEvent);
            addEvent(document.getElementById(baseId + ":stationInput"), "focus", onFocusEvent);
        } else if (agent == 2) {
            addEvent(document.getElementById(baseId + ":stationOutput"), "keyup", openStationInput);
            addEvent(document.getElementById(baseId + ":stationOutput"), "click", openStationInput);
            addEvent(document.getElementById(baseId + ":stationBack"), "click", closeStationInput);
        }
        // 種別のチェックタブ
        if (agent == 2 || agent == 3) {
            document.getElementById(baseId + ':stationView:1').checked = true;
            document.getElementById(baseId + ':stationView:2').checked = true;
            document.getElementById(baseId + ':stationView:3').checked = true;
            document.getElementById(baseId + ':stationView:4').checked = true;
        }

        // キーの監視
        inputCheck();
    }

    /*
    * スマートフォン用入力画面を開く
    */
    function openStationInput() {
        document.getElementById(baseId + ':stationPopupBack').style.display = "block";
        document.getElementById(baseId + ':stationPopup').style.display = "block";
        document.getElementById(baseId + ':stationInput').value = document.getElementById(baseId + ':stationOutput').value;
        document.getElementById(baseId + ':stationInput').focus();
        document.getElementById(baseId + ':stationPopup').style.top = 0;
        document.getElementById(baseId + ':stationPopup').style.left = 0;
    }

    /*
    * スマートフォン用入力画面を閉じる
    */
    function closeStationInput() {
        if (document.getElementById(baseId + ':stationOutput').value != "" && document.getElementById(baseId + ':stationInput').value == "") {
            // 空にする
            document.getElementById(baseId + ':stationOutput').value = "";
            if (typeof callBackFunction['change'] == 'function') {
                callBackFunction['change']();
            }
        } else {
            for (var i = 0; i < stationList.length; i++) {
                if (stationList[i].name == document.getElementById(baseId + ':stationInput').value) {
                    if (document.getElementById(baseId + ':stationOutput').value != stationList[i].name) {
                        // 変わっていたら変更
                        document.getElementById(baseId + ':stationOutput').value = stationList[i].name;
                        if (typeof callBackFunction['change'] == 'function') {
                            callBackFunction['change']();
                        }
                    }
                }
            }
        }
        document.getElementById(baseId + ':stationPopupBack').style.display = "none";
        document.getElementById(baseId + ':stationPopup').style.display = "none";
        document.getElementById(baseId + ':stationOutput').focus();
    }

    /*
    * フォーカスが外れた時にイベント
    */
    function onblurEvent() {
        setTimeout(onblurEventCallBack, 100);
    }
    function onblurEventCallBack() {
        if (typeof callBackFunction['blur'] == 'function') {
            callBackFunction['blur']();
        }
    }

    /*
    * フォーカスが合った時にイベント
    */
    function onFocusEvent() {
        if (typeof callBackFunction['focus'] == 'function') {
            callBackFunction['focus']();
        }
        if (agent == 1 || agent == 3) {
            if (document.getElementById(baseId + ':stationInput').value != "") {
                if (document.getElementById(baseId + ':stationList').style.display == "none") {
                    document.getElementById(baseId + ':stationList').style.display = "block";
                    // コールバック
                    if (typeof callBackFunction['open'] == 'function') {
                        callBackFunction['open']();
                    }
                }
            }
        }
    }

    /*
    * 文字の入力中でもチェックする
    */
    var inputCheck = function () {
        if (document.getElementById(baseId + ':stationInput')) {
            if (oldvalue != document.getElementById(baseId + ':stationInput').value) {
                oldvalue = document.getElementById(baseId + ':stationInput').value;
                searchStation(true, oldvalue);
            };
        }
        setTimeout(inputCheck, 100);
    };

    /*
    * フォームのイベント処理
    */
    function inputStation(event) {
        var iStation = document.getElementById(baseId + ':stationInput').value;
        if (iStation == "") {
            document.getElementById(baseId + ':stationList').style.display = "none";
        }
        if (event.keyCode == 13) {
            // エンターキー
            if (document.getElementById(baseId + ':stationList')) {
                if (document.getElementById(baseId + ':stationList').length > 0) {
                    document.getElementById(baseId + ':stationList').selectedIndex = 0;
                }
                document.getElementById(baseId + ':stationList').focus();
            }
            // エンターキー
            if (typeof callBackFunction['enter'] == 'function') {
                callBackFunction['enter']();
            }
        }
    }

    /*
    * 駅名の検索
    */
    function searchStation(openFlag, str) {
        if (typeof httpObj != 'undefined') {
            httpObj.abort();
        }
        if (str.length == "") {
            closeStationList();
            return;
        }
        var url = apiURL + "v1/json/station/light?key=" + key + "&name=" + encodeURIComponent(str);
        if (typeof stationType != 'undefined') {
            url += "&type=" + stationType;
        }
        if (typeof stationPrefectureCode != 'undefined') {
            url += "&prefectureCode=" + stationPrefectureCode;
        }

        var JSON_object = {};
        if (window.XDomainRequest) {
            // IE用
            httpObj = new XDomainRequest();
            httpObj.onload = function () {
                JSON_object = JSON.parse(httpObj.responseText);
                outStationList(openFlag, JSON_object);
            };
        } else {
            httpObj = new XMLHttpRequest();
            httpObj.onreadystatechange = function () {
                var done = 4, ok = 200;
                if (httpObj.readyState == done && httpObj.status == ok) {
                    JSON_object = JSON.parse(httpObj.responseText);
                    outStationList(openFlag, JSON_object);
                }
            };
        }
        httpObj.open("GET", url, true);
        httpObj.send(null);
    }

    /*
    * 駅名をセットする
    */
    function setStationNo(n) {
        if (typeof stationList[n - 1] != 'undefined') {
            if (stationList[(n - 1)].name != document.getElementById(baseId + ':stationInput').value) {
                setStation(stationList[(n - 1)].name);
                if (typeof callBackFunction['change'] == 'function') {
                    callBackFunction['change']();
                }
            }else{
                setStation(stationList[(n - 1)].name);
            }
        }
    }

    /*
    * 駅のアイコンを設定
    */
    function getStationIconType(type) {
        if (typeof type != 'object') {
            // 単一の場合
            return '<span class="exp_' + type + '"></span>';
        } else if (typeof type.text != 'undefined') {
            return '<span class="exp_' + type.text + '"></span>';
        } else if (type.length > 0) {
            // 複数の場合
            var buffer = "";
            for (var i = 0; i < type.length; i++) {
                if (typeof type[i].text != 'undefined') {
                    buffer += '<span class="exp_' + type[i].text + '"></span>';
                } else {
                    buffer += '<span class="exp_' + type[i] + '"></span>';
                }
            }
            return buffer;
        }
        return '';
    }

    /*
    * 検索した駅リストの出力
    */
    function outStationList(openFlag, tmp_stationList) {
        if (typeof tmp_stationList != 'undefined') {
            if (typeof tmp_stationList.ResultSet.Point != 'undefined') {
                stationList = new Array();
                if (typeof tmp_stationList.ResultSet.Point.length != 'undefined') {
                    // 複数
                    for (var i = 0; i < tmp_stationList.ResultSet.Point.length; i++) {
                        stationList.push(setStationObject(tmp_stationList.ResultSet.Point[i]));
                    }
                } else {
                    // 一つだけ
                    stationList.push(setStationObject(tmp_stationList.ResultSet.Point));
                }
            }
        }
        if (stationList.length > 0) {
            // リストを出力
            var buffer = "";
            buffer += '<ul class="exp_stationTable">';
            for (var n = 0; n < stationSort.length; n++) {
                if (agent == 1) {
                    // PCの場合は件数も出力する
                    var stationCount = 0;
                    for (var i = 0; i < stationList.length; i++) {
                        if (stationList[i].type == stationSort[n].type) {
                            stationCount++;
                        }
                    }
                    buffer += '<li>';
                    if (stationSort[n].visible) {
                        buffer += '<a class="exp_stationTitle" id="' + baseId + ':stationView:' + String(n + 1) + '" href="Javascript:void(0);">';
                    } else {
                        buffer += '<a class="exp_stationTitleClose" id="' + baseId + ':stationView:' + String(n + 1) + '" href="Javascript:void(0);">';
                    }
                    buffer += '<div class="exp_stationCount">' + stationCount + '件</div>';
                    buffer += '<div class="exp_stationIcon">';
                    buffer += '<span class="exp_' + stationSort[n].type + '" id="' + baseId + ':stationView:' + String(n + 1) + ':icon"></span>';
                    buffer += '</div>';
                    buffer += '<div class="exp_stationType" id="' + baseId + ':stationView:' + String(n + 1) + ':type">';
                    if (stationSort[n].type == "train") {
                        buffer += '駅';
                    } else if (stationSort[n].type == "plane") {
                        buffer += '空港';
                    } else if (stationSort[n].type == "ship") {
                        buffer += '船';
                    } else if (stationSort[n].type == "bus") {
                        buffer += 'バス';
                    }
                    buffer += '</div>';
                    buffer += '</a>';
                    buffer += '</li>';
                }
                if (stationSort[n].visible) {
                    // リストの出力
                    for (var i = 0; i < stationList.length; i++) {
                        if (stationList[i].type == stationSort[n].type) {
                            buffer += getStationListItem(i + 1, stationList[i]);
                        }
                    }
                }
            }
            buffer += '</ul>';
            document.getElementById(baseId + ':stationSelect').innerHTML = buffer;
            // イベントを設定
            for (var i = 0; i < stationList.length; i++) {
                addEvent(document.getElementById(baseId + ":stationRow:" + String(i + 1)), "click", onEvent);
            }
            for (var i = 0; i < stationSort.length; i++) {
                addEvent(document.getElementById(baseId + ":stationView:" + String(i + 1)), "click", onEvent);
            }
            if (document.getElementById(baseId + ':stationList').style.display == "none" && openFlag) {
                document.getElementById(baseId + ':stationList').style.display = "block";
                // コールバック
                if (typeof callBackFunction['open'] == 'function') {
                    callBackFunction['open']();
                }
            }
        }
    }

    /*
    * 表示切替
    */
    function stationView(n) {
        stationSort[n].visible = !stationSort[n].visible;
        outStationList(true);
    }

    /*
    * 地点オブジェクトの作成
    */
    function setStationObject(stationObj) {
        var tmp_station = new Object();
        tmp_station.name = stationObj.Station.Name;
        tmp_station.code = stationObj.Station.code;
        tmp_station.yomi = stationObj.Station.Yomi;
        if (typeof stationObj.Station.Type.text != 'undefined') {
            tmp_station.type = stationObj.Station.Type.text;
            if (typeof stationObj.Station.Type.detail != 'undefined') {
                tmp_station.type_detail = stationObj.Station.Type.text + "." + stationObj.Station.Type.detail;
            }
        } else {
            tmp_station.type = stationObj.Station.Type;
        }
        //県コード
        if (typeof stationObj.Prefecture != 'undefined') {
            tmp_station.kenCode = parseInt(stationObj.Prefecture.code);
        }
        return tmp_station;
    }

    /*
    * 駅のリストを出力
    */
    function getStationListItem(n, stationItem) {
        var buffer = "";
        buffer += '<li>';
        if (agent == 2 || agent == 3) {
            buffer += '<div class="exp_stationIcon">';
            buffer += getStationIconType(stationItem.type);
            buffer += '</div>';
        }
        buffer += '<div>';
        buffer += '<a class="exp_stationName" id="' + baseId + ':stationRow:' + String(n) + '" href="Javascript:void(0);" title="' + stationItem.yomi + '">' + stationItem.name + '</a>';
        buffer += '</div>';
        buffer += '</li>';
        return buffer;
    }

    /*
    * イベントの振り分けを行う
    */
    function onEvent(e) {
        var eventIdList = (e.srcElement) ? e.srcElement.id.split(":") : e.target.id.split(":");
        if (eventIdList.length >= 2) {
            if (eventIdList[1] == "stationRow" && eventIdList.length == 3) {
                // 駅の選択
                setStationNo(parseInt(eventIdList[2]));
            } else if (eventIdList[1] == "stationView" && eventIdList.length >= 3) {
                // 表示切替
                stationView(parseInt(eventIdList[2]) - 1);
            }
        }
    }

    /*
    * フォームの駅名を返す
    */
    function getStation() {
        if (agent == 1 || agent == 3) {
            return document.getElementById(baseId + ':stationInput').value;
        } else if (agent == 2) {
            return document.getElementById(baseId + ':stationOutput').value;
        }
    }

    /*
    * 検索した駅名リストを返す
    */
    function getStationList() {
        var stationArray = new Array();
        for (var i = 0; i < stationList.length; i++) {
            stationArray.push(stationList[i].name);
        }
        return stationArray.join(",");
    }

    /*
    * 選択中の駅名を返す
    */
    function getStationName() {
        var tmp_station;
        if (agent == 1 || agent == 3) {
            tmp_station = document.getElementById(baseId + ':stationInput').value;
        } else if (agent == 2) {
            tmp_station = document.getElementById(baseId + ':stationOutput').value;
        }
        if (stationList.length > 0) {
            for (var i = 0; i < stationList.length; i++) {
                if (stationList[i].name == tmp_station) {
                    return stationList[i].name;
                }
            }
        }
        return "";
    }

    /*
    * 選択中の駅コードを返す
    */
    function getStationCode() {
        var tmp_station;
        if (agent == 1 || agent == 3) {
            tmp_station = document.getElementById(baseId + ':stationInput').value;
        } else if (agent == 2) {
            tmp_station = document.getElementById(baseId + ':stationOutput').value;
        }
        if (stationList.length > 0) {
            for (var i = 0; i < stationList.length; i++) {
                if (stationList[i].name == tmp_station) {
                    return stationList[i].code;
                }
            }
        }
        return "";
    }


    /*
    * 駅情報の取得
    */
    function getPointObject(station) {
        // オブジェクトコピー用インライン関数
        function clone(obj) {
            var f = function () { };
            f.prototype = obj;
            return new f;
        }
        for (var i = 0; i < stationList.length; i++) {
            if (isNaN(station)) {
                if (stationList[i].name == station) {
                    return clone(stationList[i]);
                } else if (stationList[i].code == station) {
                    return clone(stationList[i]);
                }
            }
        }
    }

    /*
    * 検索した駅名リストを閉じる
    */
    function closeStationList() {
        if (agent == 1 || agent == 3) {
            document.getElementById(baseId + ':stationList').style.display = "none";
            // コールバック
            if (typeof callBackFunction['close'] == 'function') {
                callBackFunction['close']();
            }
        }
    }

    /*
    * 駅リストを開いているかどうかのチェック
    */
    function checkStationList() {
        if (document.getElementById(baseId + ':stationList').style.display == "block") {
            return true;
        } else {
            return false;
        }
    }

    /*
    * フォームに駅名をセットしてリストを閉じる
    */
    function setStation(str) {
        if (agent == 1 || agent == 3) {
            document.getElementById(baseId + ':stationInput').value = str;
            // チェックはしない
            oldvalue = document.getElementById(baseId + ':stationInput').value;
            closeStationList();
        } else if (agent == 2) {
            document.getElementById(baseId + ':stationOutput').value = str;
            //リストを閉じる
            document.getElementById(baseId + ':stationPopup').style.display = "none";
            document.getElementById(baseId + ':stationPopupBack').style.display = "none";
        }
        if (str != "") {
            //駅リスト検索をチェックし、無かった場合は問い合わせ
            if (stationList.length > 0) {
                for (var i = 0; i < stationList.length; i++) {
                    if (stationList[i].name == str) {
                        return;
                    }
                }
            }
            //一致する駅が無いため、問い合わせ
            searchStation(false, str);
        }
    }

    /*
    * 環境設定
    */
    function setConfigure(name, value) {
        if (name.toLowerCase() == String("apiURL").toLowerCase()) {
            apiURL = value;
        } else if (name.toLowerCase() == "type") {
            if (typeof value == "object") {
                stationType = value.join(":");
            } else {
                stationType = value;
            }
        } else if (name.toLowerCase() == String("prefectureCode").toLowerCase()) {
            if (typeof value == "object") {
                stationPrefectureCode = value.join(":");
            } else {
                stationPrefectureCode = value;
            }
        } else if (name.toLowerCase() == String("maxStation").toLowerCase()) {
            maxStation = value;
        } else if (name.toLowerCase() == String("agent").toLowerCase()) {
            agent = value;
        }
    }

    /*
    * コールバック関数の定義
    */
    function bind(type, func) {
        if (type == 'open' && typeof func == 'function') {
            callBackFunction[type] = func;
        } else if (type == 'close' && typeof func == 'function') {
            callBackFunction[type] = func;
        } else if (type == 'change' && typeof func == 'function') {
            callBackFunction[type] = func;
        } else if (type == 'blur' && typeof func == 'function') {
            callBackFunction[type] = func;
        } else if (type == 'enter' && typeof func == 'function') {
            callBackFunction[type] = func;
        } else if (type == 'focus' && typeof func == 'function') {
            callBackFunction[type] = func;
        }
    }

    /*
    * コールバック関数の解除
    */
    function unbind(type) {
        if (typeof callBackFunction[type] == 'function') {
            callBackFunction[type] = undefined;
        }
    }

    /*
    * 利用できる関数リスト
    */
    this.dispStation = dispStation;
    this.getStation = getStation;
    this.setStation = setStation;
    this.getStationList = getStationList;
    this.getStationName = getStationName;
    this.getStationCode = getStationCode;
    this.getPointObject = getPointObject;
    this.closeStationList = closeStationList;
    this.checkStationList = checkStationList;
    this.setConfigure = setConfigure;
    this.bind = bind;
    this.unbind = unbind;

    /*
    * 定義
    */
    this.TYPE_TRAIN = "train";
    this.TYPE_PLANE = "plane";
    this.TYPE_SHIP = "ship";
    this.TYPE_BUS = "bus";
    this.TYPE_WALK = "walk";
    this.TYPE_STRANGE = "strange";
    this.TYPE_BUS_LOCAL = "bus.local";
    this.TYPE_BUS_CONNECTION = "bus.connection";
    this.TYPE_BUS_HIGHWAY = "bus.highway";
    this.TYPE_BUS_MIDNIGHT = "bus.midnight";
    this.TYPE_TRAIN_LIMITEDEXPRESS = "train.limitedExpress";
    this.TYPE_TRAIN_SHINKANSEN = "train.shinkansen";
    this.TYPE_TRAIN_SLEEPERTRAIN = "train.sleeperTrain";
    this.TYPE_TRAIN_LINER = "train.liner";
    this.TDFK_HOKKAIDO = 1;
    this.TDFK_AOMORI = 2;
    this.TDFK_IWATE = 3;
    this.TDFK_MIYAGI = 4;
    this.TDFK_AKITA = 5;
    this.TDFK_YAMAGATA = 6;
    this.TDFK_FUKUSHIMA = 7;
    this.TDFK_IBARAKI = 8;
    this.TDFK_TOCHIGI = 9;
    this.TDFK_GUNMA = 10;
    this.TDFK_SAITAMA = 11;
    this.TDFK_CHIBA = 12;
    this.TDFK_TOKYO = 13;
    this.TDFK_KANAGAWA = 14;
    this.TDFK_NIIGATA = 15;
    this.TDFK_TOYAMA = 16;
    this.TDFK_ISHIKAWA = 17;
    this.TDFK_FUKUI = 18;
    this.TDFK_YAMANASHI = 19;
    this.TDFK_NAGANO = 20;
    this.TDFK_GIFU = 21;
    this.TDFK_SHIZUOKA = 22;
    this.TDFK_AICHI = 23;
    this.TDFK_MIE = 24;
    this.TDFK_SHIGA = 25;
    this.TDFK_KYOTO = 26;
    this.TDFK_OSAKA = 27;
    this.TDFK_HYOGO = 28;
    this.TDFK_NARA = 29;
    this.TDFK_WAKAYAMA = 30;
    this.TDFK_TOTTORI = 31;
    this.TDFK_SHIMANE = 32;
    this.TDFK_OKAYAMA = 33;
    this.TDFK_HIROSHIMA = 34;
    this.TDFK_YAMAGUCHI = 35;
    this.TDFK_TOKUSHIMA = 36;
    this.TDFK_KAGAWA = 37;
    this.TDFK_EHIME = 38;
    this.TDFK_KOCHI = 39;
    this.TDFK_FUKUOKA = 40;
    this.TDFK_SAGA = 41;
    this.TDFK_NAGASAKI = 42;
    this.TDFK_KUMAMOTO = 43;
    this.TDFK_OITA = 44;
    this.TDFK_MIYAZAKI = 45;
    this.TDFK_KAGOSHIMA = 46;
    this.TDFK_OKINAWA = 47;

    // 端末制御
    this.AGENT_PC = 1;
    this.AGENT_PHONE = 2;
    this.AGENT_TABLET = 3;
};
