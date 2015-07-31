/**
 *  駅すぱあと Web サービス
 *  探索条件パーツ
 *  サンプルコード
 *  http://webui.ekispert.com/doc/
 *  
 *  Version:2013-09-26
 *  
 *  Copyright (C) Val Laboratory Corporation. All rights reserved.
 **/

var expGuiCondition = function (pObject, config) {
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
        imagePath = s.src.substring(0, s.src.indexOf("expGuiCondition\.js"));
        if (s.src && s.src.match(/expGuiCondition\.js(\?.*)?/)) {
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
    var def_condition = "T322123323231:F33211221:A23121141:"; // デフォルト探索条件
    var def_sortType = "ekispert"; // デフォルトソート
    var def_priceType = "oneway"; // 片道運賃がデフォルト
    var def_answerCount = "5"; // 探索結果数のデフォルト

    var checkboxItem = new Array();
    var conditionObject = initCondition();

    function initCondition() {
        // 探索条件のオブジェクトを作成
        var tmp_conditionObject = new Object();
        // 回答数
        var conditionId = "answerCount";
        var conditionLabel = "回答数";
        var tmpOption = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20);
        tmp_conditionObject[conditionId.toLowerCase()] = addCondition(conditionLabel, tmpOption);
        // 探索時の表示順設定
        var conditionId = "sortType";
        var conditionLabel = "表示順設定";
        //  var conditionLabel = "探索時の表示順設定";
        //  var tmpOption = new Array("駅すぱあと探索順","料金順","時間順","定期券の料金順","乗換回数順","CO2排出量順","1ヶ月定期券の料金順","3ヶ月定期券の料金順","6ヶ月定期券の料金順");
        var tmpOption = new Array("探索順", "料金順", "時間順", "定期券順", "乗換回数順", "CO2排出量順", "1ヶ月定期順", "3ヶ月定期順", "6ヶ月定期順");
        var tmpValue = new Array("ekispert", "price", "time", "teiki", "transfer", "co2", "teiki1", "teiki3", "teiki6");
        tmp_conditionObject[conditionId.toLowerCase()] = addCondition(conditionLabel, tmpOption, tmpValue);
        // 探索時の料金設定
        var conditionId = "priceType";
        //  var conditionLabel = "探索時の料金設定";
        var conditionLabel = "料金設定";
        var tmpOption = new Array("片道", "往復", "定期");
        var tmpValue = new Array("oneway", "round", "teiki");
        tmp_conditionObject[conditionId.toLowerCase()] = addCondition(conditionLabel, tmpOption, tmpValue);
        // 飛行機
        var conditionId = "plane";
        var conditionLabel = "飛行機";
        var tmpOption = new Array("気軽に利用", "普通に利用", "極力利用しない", "利用しない");
        var tmpValue = new Array("light", "normal", "bit", "never");
        tmp_conditionObject[conditionId.toLowerCase()] = addCondition(conditionLabel, tmpOption, tmpValue);
        // 新幹線
        var conditionId = "shinkansen";
        var conditionLabel = "新幹線";
        var tmpOption = new Array("利用する", "利用しない");
        var tmpValue = new Array("normal", "never");
        tmp_conditionObject[conditionId.toLowerCase()] = addCondition(conditionLabel, tmpOption, tmpValue);
        // 新幹線のぞみ
        var conditionId = "shinkansenNozomi";
        var conditionLabel = "新幹線のぞみ";
        var tmpOption = new Array("利用する", "利用しない");
        var tmpValue = new Array("normal", "never");
        tmp_conditionObject[conditionId.toLowerCase()] = addCondition(conditionLabel, tmpOption, tmpValue);
        // 寝台列車
        var conditionId = "sleeperTrain";
        var conditionLabel = "寝台列車";
        var tmpOption = new Array("極力利用する", "普通に利用", "利用しない");
        var tmpValue = new Array("possible", "normal", "never");
        tmp_conditionObject[conditionId.toLowerCase()] = addCondition(conditionLabel, tmpOption, tmpValue);
        // 有料特急
        var conditionId = "limitedExpress";
        var conditionLabel = "有料特急";
        var tmpOption = new Array("利用する", "利用しない");
        var tmpValue = new Array("normal", "never");
        tmp_conditionObject[conditionId.toLowerCase()] = addCondition(conditionLabel, tmpOption, tmpValue);
        // 高速バス
        var conditionId = "highwayBus";
        var conditionLabel = "高速バス";
        var tmpOption = new Array("気軽に利用", "普通に利用", "極力利用しない", "利用しない");
        var tmpValue = new Array("light", "normal", "bit", "never");
        tmp_conditionObject[conditionId.toLowerCase()] = addCondition(conditionLabel, tmpOption, tmpValue);
        // 連絡バス
        var conditionId = "connectionBus";
        var conditionLabel = "連絡バス";
        var tmpOption = new Array("気軽に利用", "普通に利用", "極力利用しない", "利用しない");
        var tmpValue = new Array("light", "normal", "bit", "never");
        tmp_conditionObject[conditionId.toLowerCase()] = addCondition(conditionLabel, tmpOption, tmpValue);
        // 路線バス
        var conditionId = "localBus";
        var conditionLabel = "路線バス";
        var tmpOption = new Array("利用する", "利用しない");
        var tmpValue = new Array("normal", "never");
        tmp_conditionObject[conditionId.toLowerCase()] = addCondition(conditionLabel, tmpOption, tmpValue);
        // 船
        var conditionId = "ship";
        var conditionLabel = "船";
        var tmpOption = new Array("気軽に利用", "普通に利用", "極力利用しない", "利用しない");
        var tmpValue = new Array("light", "normal", "bit", "never");
        tmp_conditionObject[conditionId.toLowerCase()] = addCondition(conditionLabel, tmpOption, tmpValue);
        // 有料普通列車
        var conditionId = "liner";
        var conditionLabel = "有料普通列車";
        var tmpOption = new Array("利用する", "利用しない");
        var tmpValue = new Array("normal", "never");
        tmp_conditionObject[conditionId.toLowerCase()] = addCondition(conditionLabel, tmpOption, tmpValue);
        // 駅間徒歩
        var conditionId = "walk";
        var conditionLabel = "駅間徒歩";
        var tmpOption = new Array("気にならない", "少し気になる", "利用しない");
        var tmpValue = new Array("normal", "little", "never");
        tmp_conditionObject[conditionId.toLowerCase()] = addCondition(conditionLabel, tmpOption, tmpValue);
        // 深夜急行バス
        var conditionId = "midnightBus";
        var conditionLabel = "深夜急行バス";
        var tmpOption = new Array("利用する", "利用しない");
        var tmpValue = new Array("normal", "never");
        tmp_conditionObject[conditionId.toLowerCase()] = addCondition(conditionLabel, tmpOption, tmpValue);
        // 特急料金初期値
        var conditionId = "surchargeKind";
        var conditionLabel = "特急料金初期値";
        var tmpOption = new Array("自由席", "指定席", "グリーン");
        var tmpValue = new Array("free", "reserved", "green");
        tmp_conditionObject[conditionId.toLowerCase()] = addCondition(conditionLabel, tmpOption, tmpValue);
        // 定期種別初期値
        var conditionId = "teikiKind";
        var conditionLabel = "定期種別初期値";
        var tmpOption = new Array("通勤", "学割（高校）", "学割");
        var tmpValue = new Array("bussiness", "highSchool", "university");
        tmp_conditionObject[conditionId.toLowerCase()] = addCondition(conditionLabel, tmpOption, tmpValue);
        // JR季節料金
        var conditionId = "JRSeasonalRate";
        var conditionLabel = "JR季節料金";
        //  var tmpOption = new Array("繁忙期・閑散期の季節料金を考慮する","無視する");
        var tmpOption = new Array("繁忙期・閑散期を考慮", "無視する");
        var tmpValue = new Array("true", "false");
        tmp_conditionObject[conditionId.toLowerCase()] = addCondition(conditionLabel, tmpOption, tmpValue);
        // 学割乗車券
        var conditionId = "studentDiscount";
        var conditionLabel = "学割乗車券";
        var tmpOption = new Array("計算する", "計算しない");
        var tmpValue = new Array("true", "false");
        tmp_conditionObject[conditionId.toLowerCase()] = addCondition(conditionLabel, tmpOption, tmpValue);
        // 航空運賃の指定
        //var conditionId = "airFare";
        //var conditionLabel = "航空運賃の指定";
        //var tmpOption = new Array("常に普通運賃を採用","特定便割引を極力採用");
        //var tmpValue  = new Array("normal","tokuwari");
        //tmp_conditionObject[conditionId.toLowerCase()] = addCondition(conditionLabel,tmpOption,tmpValue);
        // 航空保険特別料金
        var conditionId = "includeInsurance";
        var conditionLabel = "航空保険特別料金";
        var tmpOption = new Array("運賃に含む", "運賃に含まない");
        var tmpValue = new Array("true", "false");
        tmp_conditionObject[conditionId.toLowerCase()] = addCondition(conditionLabel, tmpOption, tmpValue);
        // 乗車券計算のシステム
        var conditionId = "ticketSystemType";
        //  var conditionLabel = "乗車券計算のシステム";
        var conditionLabel = "乗車券計算";
        //  var tmpOption = new Array("普通乗車券として計算","IC乗車券カードとして計算");
        var tmpOption = new Array("普通乗車券", "IC乗車券カード");
        var tmpValue = new Array("normal", "ic");
        tmp_conditionObject[conditionId.toLowerCase()] = addCondition(conditionLabel, tmpOption, tmpValue);
        // だぶるーとの利用
        var conditionId = "nikukanteiki";
        var conditionLabel = "だぶるーとの利用";
        var tmpOption = new Array("利用する", "利用しない");
        var tmpValue = new Array("true", "false");
        tmp_conditionObject[conditionId.toLowerCase()] = addCondition(conditionLabel, tmpOption, tmpValue);
        // JR路線
        var conditionId = "useJR";
        var conditionLabel = "JR路線";
        var tmpOption = new Array("気軽に利用", "普通に利用", "極力利用しない");
        var tmpValue = new Array("light", "normal", "bit");
        tmp_conditionObject[conditionId.toLowerCase()] = addCondition(conditionLabel, tmpOption, tmpValue);
        // 乗換え
        var conditionId = "transfer";
        var conditionLabel = "乗換え";
        var tmpOption = new Array("気にならない", "少し気になる", "利用しない");
        var tmpValue = new Array("normal", "little", "never");
        tmp_conditionObject[conditionId.toLowerCase()] = addCondition(conditionLabel, tmpOption, tmpValue);
        // 特急始発駅
        var conditionId = "expressStartingStation";
        var conditionLabel = "特急始発駅";
        var tmpOption = new Array("なるべく利用", "普通に利用");
        var tmpValue = new Array("possible", "normal");
        tmp_conditionObject[conditionId.toLowerCase()] = addCondition(conditionLabel, tmpOption, tmpValue);
        // 出発駅乗車
        var conditionId = "waitAverageTime";
        var conditionLabel = "出発駅乗車";
        //  var tmpOption = new Array("平均待ち時間を利用する","待ち時間なし");
        var tmpOption = new Array("平均待ち時間", "待ち時間なし");
        var tmpValue = new Array("true", "false");
        tmp_conditionObject[conditionId.toLowerCase()] = addCondition(conditionLabel, tmpOption, tmpValue);
        // 路線バスのみ探索
        var conditionId = "localBusOnly";
        var conditionLabel = "路線バスのみ探索";
        var tmpOption = new Array("する", "しない");
        var tmpValue = new Array("true", "false");
        tmp_conditionObject[conditionId.toLowerCase()] = addCondition(conditionLabel, tmpOption, tmpValue);
        // 路線名あいまい指定
        //  var conditionId = "fuzzyLine";
        //  var conditionLabel = "路線名あいまい指定";
        //  var tmpOption = new Array("あいまいに行う","厳格に行う");
        //  var tmpValue  = new Array("true","false");
        //  tmp_conditionObject[conditionId.toLowerCase()] = addCondition(conditionLabel,tmpOption,tmpValue);
        // 乗換え時間
        var conditionId = "transferTime";
        var conditionLabel = "乗換え時間";
        //  var tmpOption = new Array("駅すぱあとの既定値","既定値より少し余裕をみる","既定値より余裕をみる","既定値より短い時間にする");
        var tmpOption = new Array("既定値", "少し余裕をみる", "余裕をみる", "短い時間");
        var tmpValue = new Array("normal", "moreMargin", "mostMargin", "lessMargin");
        tmp_conditionObject[conditionId.toLowerCase()] = addCondition(conditionLabel, tmpOption, tmpValue);
        // 経由駅指定の継承
        //  var conditionId = "entryPathBehavior";
        //  var conditionLabel = "経由駅指定の継承";
        //  var tmpOption = new Array("する","しない");
        //  var tmpValue  = new Array("true","false");
        //  tmp_conditionObject[conditionId.toLowerCase()] = addCondition(conditionLabel,tmpOption,tmpValue);
        return tmp_conditionObject;
    }

    /*
    * 探索条件オブジェクト
    */
    function addCondition(name, option, value) {
        var tmpCondition = new Object();
        tmpCondition.name = name;
        tmpCondition.option = option;
        if (typeof value != 'undefined') {
            tmpCondition.value = value;
        } else {
            tmpCondition.value = option;
        }
        // デフォルトは表示
        tmpCondition.visible = true;
        return tmpCondition;
    }

    /*
    * 探索条件の設置
    */
    function dispCondition() {
        // HTML本体
        var buffer;
        if (agent == 1) {
            buffer = '<div class="expGuiCondition expGuiConditionPc">';
        } else if (agent == 2) {
            buffer = '<div class="expGuiCondition expGuiConditionPhone">';
        } else if (agent == 3) {
            buffer = '<div class="expGuiCondition expGuiConditionTablet">';
        }
        if (agent == 1 || agent == 3) {
            // チェックボックスの設定とデフォルト
            buffer += viewConditionSimple(true);
            buffer += viewConditionDetail();
        } else if (agent == 2) {
            // セレクトボックス
            buffer += viewConditionPhone();
        }
        buffer += '</div>';
        documentObject.innerHTML = buffer;

        // イベントを設定
        addEvent(document.getElementById(baseId + ":conditionOpen"), "click", onEvent);
        var tabCount = 1;
        while (document.getElementById(baseId + ":conditionTab:" + String(tabCount))) {
            addEvent(document.getElementById(baseId + ":conditionTab:" + String(tabCount)), "click", onEvent);
            tabCount++;
        }
        var tabCount = 1;
        while (document.getElementById(baseId + ":conditionSection:" + String(tabCount) + ":open")) {
            addEvent(document.getElementById(baseId + ":conditionSection:" + String(tabCount) + ":open"), "click", onEvent);
            addEvent(document.getElementById(baseId + ":conditionSection:" + String(tabCount) + ":close"), "click", onEvent);
            tabCount++;
        }
        addEvent(document.getElementById(baseId + ":conditionClose"), "click", onEvent);
        // チェックボックスの設定
        for (var i = 0; i < checkboxItem.length; i++) {
            addEvent(document.getElementById(baseId + ':' + checkboxItem[i] + ':checkbox'), "change", onEvent);
        }
        // デフォルト設定
        resetCondition();
        // 簡易設定のデフォルトも設定
        setSimpleCondition();
    }

    /*
    * 探索条件の設置
    */
    function dispConditionSimple() {
        // HTML本体
        var buffer;
        if (agent == 1) {
            buffer = '<div class="expGuiCondition expGuiConditionPc">';
        } else if (agent == 2) {
            buffer = '<div class="expGuiCondition expGuiConditionPhone">';
        } else if (agent == 3) {
            buffer = '<div class="expGuiCondition expGuiConditionTablet">';
        }
        buffer += viewConditionSimple(false);
        buffer += viewConditionDetail();
        buffer += '</div>';
        documentObject.innerHTML = buffer;

        // チェックボックスの設定
        for (var i = 0; i < checkboxItem.length; i++) {
            addEvent(document.getElementById(baseId + ':' + checkboxItem[i] + ':checkbox'), "change", onEvent);
        }
        // デフォルト設定
        resetCondition();
        // 簡易設定のデフォルトも設定
        setSimpleCondition();
    }

    function dispConditionLight() {
        // HTML本体
        var buffer;
        if (agent == 1) {
            buffer = '<div class="expGuiCondition expGuiConditionPc">';
        } else if (agent == 2) {
            buffer = '<div class="expGuiCondition expGuiConditionPhone">';
        } else if (agent == 3) {
            buffer = '<div class="expGuiCondition expGuiConditionTablet">';
        }

        buffer += '<div class="exp_conditionSimple exp_clearfix">';
        buffer += '<div class="exp_title">交通手段</div>';
        buffer += outConditionCheckbox("plane", "normal", "never");
        buffer += outConditionCheckbox("shinkansen", "normal", "never");
        buffer += outConditionCheckbox("limitedExpress", "normal", "never", "特急");
        buffer += outConditionCheckbox("localBus", "normal", "never", "バス");
        buffer += viewConditionDetail();
        buffer += '</div>';
        documentObject.innerHTML = buffer;

        // チェックボックスの設定
        for (var i = 0; i < checkboxItem.length; i++) {
            addEvent(document.getElementById(baseId + ':' + checkboxItem[i] + ':checkbox'), "change", onEvent);
        }
        // デフォルト設定
        resetCondition();
        // 簡易設定のデフォルトも設定
        setSimpleCondition();
    }
    /*
    * 簡易設定のデフォルト設定
    */
    function setSimpleCondition() {
        for (var i = 0; i < checkboxItem.length; i++) {
            document.getElementById(baseId + ':' + checkboxItem[i] + ':checkbox').checked = (getValue(checkboxItem[i]) == document.getElementById(baseId + ':' + checkboxItem[i] + ':checkbox').value ? true : false);
        }
    }

    /*
    * 探索条件簡易
    */
    function viewConditionSimple(detail) {
        var buffer = "";
        buffer += '<div class="exp_conditionSimple exp_clearfix">';
        buffer += '<div class="exp_title">交通手段</div>';
        buffer += outConditionCheckbox("plane", "normal", "never");
        buffer += outConditionCheckbox("shinkansen", "normal", "never");
        buffer += outConditionCheckbox("shinkansenNozomi", "normal", "never");
        buffer += outConditionCheckbox("limitedExpress", "normal", "never");
        buffer += outConditionCheckbox("localBus", "normal", "never");
        buffer += outConditionCheckbox("liner", "normal", "never");
        buffer += outConditionCheckbox("midnightBus", "normal", "never");
        buffer += '</div>';
        if (detail) {
            buffer += '<div class="exp_conditionOpen">';
            if (agent == 1) {
                buffer += '<a class="exp_conditionOpenButton" id="' + baseId + ':conditionOpen" href="Javascript:void(0);"><span class="exp_text" id="' + baseId + ':conditionOpen:text">探索詳細条件を設定</span></a>';
            } else if (agent == 3) {
                buffer += '<a class="exp_conditionOpenButton" id="' + baseId + ':conditionOpen" href="Javascript:void(0);">探索詳細条件を設定</a>';
            }
            buffer += '</div>';
        }
        return buffer;
    }

    /*
    * 探索条件詳細
    */
    function viewConditionDetail() {
        var buffer = "";
        buffer += '<div id="' + baseId + ':conditionDetail" class="exp_conditionDetail" style="display:none;">';
        buffer += '<div class="exp_conditionTable exp_clearfix">';
        if (agent == 3) {
            // タブレット用閉じるボタン
            buffer += '<div class="exp_titlebar exp_clearfix">';
            buffer += '探索条件';
            buffer += '<span class="exp_button">';
            buffer += '<a class="exp_conditionClose" id="' + baseId + ':conditionClose" href="Javascript:void(0);">閉じる</a>';
            buffer += '</span>';
            buffer += '</div>';
        }
        // タブ
        buffer += '<div class="exp_header exp_clearfix">';
        var groupList = new Array("表示・時間", "運賃", "交通手段", "平均経路");
        buffer += '<div class="exp_conditionLeft"></div>';
        for (var i = 0; i < groupList.length; i++) {
            var tabType = "conditionTab";
            if (agent == 3) {
                if (i == 0) { tabType = "conditionTabLeft"; }
                if (i == (groupList.length - 1)) { tabType = "conditionTabRight"; }
            }
            buffer += '<div class="exp_' + tabType + ' exp_conditionTabSelected" id="' + baseId + ':conditionTab:' + String(i + 1) + ':active" style="display:' + (i == 0 ? "block" : "none") + ';">';
            buffer += '<span class="exp_text">' + groupList[i] + '</span>';
            buffer += '</div>';
            buffer += '<div class="exp_' + tabType + ' exp_conditionTabNoSelect" id="' + baseId + ':conditionTab:' + String(i + 1) + ':none" style="display:' + (i != 0 ? "block" : "none") + ';">';
            buffer += '<a id="' + baseId + ':conditionTab:' + String(i + 1) + '" href="Javascript:void(0);">';
            buffer += groupList[i];
            buffer += '</a>';
            buffer += '</div>';
        }
        buffer += '<div class="exp_conditionRight"></div>';
        buffer += '</div>';

        // 探索条件
        buffer += '<div class="exp_conditionList">';
        buffer += '<div id="' + baseId + ':conditionGroup:' + String(1) + '" class="exp_clearfix">';
        // 回答数
        if (agent == 1 || agent == 2) {
            buffer += outConditionSelect("answerCount");
        } else if (agent == 3) {
            buffer += outConditionRadio("answerCount");
        }
        buffer += '<div class="exp_separator" id="' + baseId + ':answerCount:separator"></div>';
        // 探索時の表示順設定
        if (agent == 1 || agent == 2) {
            buffer += outConditionSelect("sortType", "whiteSelect");
        } else if (agent == 3) {
            buffer += outConditionRadio("sortType", "whiteSelect");
        }
        buffer += '<div class="exp_separator" id="' + baseId + ':sortType:separator"></div>';
        // 探索時の料金設定
        buffer += outConditionRadio("priceType", "greenSelect");
        buffer += '<div class="exp_separator" id="' + baseId + ':priceType:separator"></div>';
        // 乗換え時間
        if (agent == 1 || agent == 2) {
            buffer += outConditionSelect("transferTime", "whiteSelect");
        } else if (agent == 3) {
            buffer += outConditionRadio("transferTime", "whiteSelect");
        }
        buffer += '</div>';

        buffer += '<div id="' + baseId + ':conditionGroup:' + String(2) + '" class="exp_clearfix" style="display:none;">';
        // 特急料金初期値
        buffer += outConditionRadio("surchargeKind");
        buffer += '<div class="exp_separator" id="' + baseId + ':surchargeKind:separator"></div>';
        // 学割乗車券
        buffer += outConditionRadio("studentDiscount", "whiteSelect");
        buffer += '<div class="exp_separator" id="' + baseId + ':studentDiscount:separator"></div>';
        // 定期種別初期値
        buffer += outConditionRadio("teikiKind", "greenSelect");
        buffer += '<div class="exp_separator" id="' + baseId + ':teikiKind:separator"></div>';
        // JR季節料金
        buffer += outConditionRadio("JRSeasonalRate", "whiteSelect");
        buffer += '<div class="exp_separator" id="' + baseId + ':JRSeasonalRate:separator"></div>';
        // 乗車券計算のシステム
        buffer += outConditionRadio("ticketSystemType", "greenSelect");
        buffer += '<div class="exp_separator" id="' + baseId + ':ticketSystemType:separator"></div>';
        // だぶるーとの利用
        buffer += outConditionRadio("nikukanteiki", "whiteSelect");
        buffer += '<div class="exp_separator" id="' + baseId + ':nikukanteiki:separator"></div>';
        // 航空保険特別料金
        buffer += outConditionRadio("includeInsurance", "greenSelect");
        // 航空運賃の指定
        //  buffer += outConditionRadio("airFare");
        buffer += '</div>';

        buffer += '<div id="' + baseId + ':conditionGroup:' + String(3) + '" class="exp_clearfix" style="display:none;">';
        // 飛行機
        buffer += outConditionRadio("plane");
        buffer += '<div class="exp_separator" id="' + baseId + ':plane:separator"></div>';
        // 寝台列車
        buffer += outConditionRadio("sleeperTrain");
        buffer += '<div class="exp_separator" id="' + baseId + ':sleeperTrain:separator"></div>';
        // 高速バス
        buffer += outConditionRadio("highwayBus");
        buffer += '<div class="exp_separator" id="' + baseId + ':highwayBus:separator"></div>';
        // 連絡バス
        buffer += outConditionRadio("connectionBus");
        buffer += '<div class="exp_separator" id="' + baseId + ':connectionBus:separator"></div>';
        // 船
        buffer += outConditionRadio("ship");
        buffer += '</div>';

        buffer += '<div id="' + baseId + ':conditionGroup:' + String(4) + '" class="exp_clearfix" style="display:none;">';
        // 駅間徒歩
        buffer += outConditionRadio("walk", "whiteSelect");
        buffer += '<div class="exp_separator" id="' + baseId + ':walk:separator"></div>';
        // JR路線
        buffer += outConditionRadio("useJR", "greenSelect");
        buffer += '<div class="exp_separator" id="' + baseId + ':useJR:separator"></div>';
        // 特急始発駅
        buffer += outConditionRadio("expressStartingStation", "whiteSelect");
        buffer += '<div class="exp_separator" id="' + baseId + ':expressStartingStation:separator"></div>';
        // 出発駅乗車
        buffer += outConditionRadio("waitAverageTime", "greenSelect");
        buffer += '<div class="exp_separator" id="' + baseId + ':waitAverageTime:separator"></div>';
        // 路線バスのみ探索
        buffer += outConditionRadio("localBusOnly", "whiteSelect");
        buffer += '<div class="exp_separator" id="' + baseId + ':localBusOnly:separator"></div>';
        // 乗換え
        buffer += outConditionRadio("transfer", "greenSelect");
        buffer += '</div>';
        // 隠しタブ
        buffer += '<div style="display:none;">';
        // 新幹線
        buffer += outConditionRadio("shinkansen");
        buffer += '<div class="exp_separator" id="' + baseId + ':shinkansen:separator"></div>';
        // 新幹線のぞみ
        buffer += outConditionRadio("shinkansenNozomi");
        buffer += '<div class="exp_separator" id="' + baseId + ':shinkansenNozomi:separator"></div>';
        // 有料特急
        buffer += outConditionRadio("limitedExpress");
        buffer += '<div class="exp_separator" id="' + baseId + ':limitedExpress:separator"></div>';
        // 路線バス
        buffer += outConditionRadio("localBus");
        // 有料普通列車
        buffer += outConditionRadio("liner");
        buffer += '<div class="exp_separator" id="' + baseId + ':liner:separator"></div>';
        // 深夜急行バス
        buffer += outConditionRadio("midnightBus");
        // 路線名あいまい指定
        //  buffer += outConditionRadio("fuzzyLine");
        // 経由駅指定の継承
        //  buffer += outConditionRadio("entryPathBehavior");
        buffer += '</div>';

        if (agent == 1) {
            // PC用閉じるボタン
            buffer += '<div class="exp_conditionFooter">';
            buffer += '<div class="exp_conditionClose">';
            buffer += '<a class="exp_conditionCloseButton" id="' + baseId + ':conditionClose" href="Javascript:void(0);"><span class="exp_text" id="' + baseId + ':conditionClose:text">閉じる</span></a>';
            buffer += '</div>';
            buffer += '</div>';
        }
        buffer += '</div>';
        buffer += '</div>';
        return buffer;
    }

    /*
    * スマートフォン用探索条件
    */
    function viewConditionPhone() {
        var buffer = "";
        buffer += '<div id="' + baseId + ':conditionDetail" class="exp_conditionDetail">';
        // 交通手段
        buffer += '<div class="exp_conditionSection">';
        buffer += '<div class="exp_title">交通手段</div>';
        buffer += '<div class="exp_conditionCheckList exp_clearfix">';
        buffer += outConditionCheckbox("shinkansen", "normal", "never");
        buffer += outConditionCheckbox("shinkansenNozomi", "normal", "never");
        buffer += outConditionCheckbox("limitedExpress", "normal", "never");
        buffer += outConditionCheckbox("localBus", "normal", "never");
        buffer += outConditionCheckbox("liner", "normal", "never");
        buffer += outConditionCheckbox("midnightBus", "normal", "never");
        buffer += '</div>';
        buffer += '<div class="exp_detailButton exp_clearfix">';
        buffer += '<div id="' + baseId + ':conditionSection:' + String(1) + ':active">';
        buffer += '<a class="exp_visible" id="' + baseId + ':conditionSection:' + String(1) + ':open" href="Javascript:void(0);">';
        buffer += '詳細条件を開く';
        buffer += '</a>';
        buffer += '</div>';
        buffer += '<div id="' + baseId + ':conditionSection:' + String(1) + ':none" style="display:none;">';
        buffer += '<a class="exp_hidden" id="' + baseId + ':conditionSection:' + String(1) + ':close" href="Javascript:void(0);">';
        buffer += '詳細条件を閉じる';
        buffer += '</a>';
        buffer += '</div>';
        buffer += '</div>';
        // 詳細
        buffer += '<div id="' + baseId + ':conditionGroup:' + String(1) + '" class="exp_conditionGroup exp_clearfix" style="display:none;">';
        buffer += '<div class="exp_line exp_clearfix">';
        buffer += '<div class="exp_left"></div><div class="exp_right"></div>';
        buffer += '</div>';
        buffer += outConditionSelect("plane", "whiteSelect"); // 飛行機
        buffer += outConditionSelect("sleeperTrain", "greenSelect"); // 寝台列車
        buffer += outConditionSelect("highwayBus", "whiteSelect"); // 高速バス
        buffer += outConditionSelect("connectionBus", "greenSelect"); // 連絡バス
        buffer += outConditionSelect("ship", "whiteSelect"); // 船
        buffer += outConditionSelect("localBus", "greenSelect"); // 路線バス
        buffer += '</div>';
        buffer += '</div>';

        // 運賃
        buffer += '<div class="exp_conditionSection">';
        buffer += '<div class="exp_title">運賃</div>';
        buffer += '<div class="exp_conditionGroup exp_clearfix">';
        buffer += outConditionSelect("surchargeKind"); // 特急料金初期値
        buffer += '</div>';
        buffer += '<div class="exp_detailButton exp_clearfix">';
        buffer += '<div id="' + baseId + ':conditionSection:' + String(2) + ':active">';
        buffer += '<a class="exp_visible" id="' + baseId + ':conditionSection:' + String(2) + ':open" href="Javascript:void(0);">';
        buffer += '詳細条件を開く';
        buffer += '</a>';
        buffer += '</div>';
        buffer += '<div id="' + baseId + ':conditionSection:' + String(2) + ':none" style="display:none;">';
        buffer += '<a class="exp_hidden" id="' + baseId + ':conditionSection:' + String(2) + ':close" href="Javascript:void(0);">';
        buffer += '詳細条件を閉じる';
        buffer += '</a>';
        buffer += '</div>';
        buffer += '</div>';
        // 詳細
        buffer += '<div id="' + baseId + ':conditionGroup:' + String(2) + '" class="exp_conditionGroup exp_clearfix" style="display:none;">';
        buffer += '<div class="exp_line exp_clearfix">';
        buffer += '<div class="exp_left"></div><div class="exp_right"></div>';
        buffer += '</div>';
        buffer += outConditionSelect("studentDiscount", "whiteSelect"); // 学割乗車券
        buffer += outConditionSelect("teikiKind", "greenSelect"); // 定期種別初期値
        buffer += outConditionSelect("JRSeasonalRate", "whiteSelect"); // JR季節料金
        buffer += outConditionSelect("ticketSystemType", "greenSelect"); // 乗車券計算のシステム
        buffer += outConditionSelect("nikukanteiki", "whiteSelect"); // だぶるーとの利用
        buffer += outConditionSelect("includeInsurance", "greenSelect"); // 航空保険特別料金
        //  buffer += outConditionSelect("airFare");// 航空運賃の指定
        buffer += '</div>';
        buffer += '</div>';

        //表示・時間
        buffer += '<div class="exp_conditionSection">';
        buffer += '<div class="exp_title">表示・時間</div>';
        // 回答数
        buffer += '<div class="exp_conditionGroup exp_clearfix">';
        buffer += outConditionSelect("answerCount");
        buffer += '</div>';
        buffer += '<div class="exp_detailButton exp_clearfix">';
        buffer += '<div id="' + baseId + ':conditionSection:' + String(3) + ':active">';
        buffer += '<a class="exp_visible" id="' + baseId + ':conditionSection:' + String(3) + ':open" href="Javascript:void(0);">';
        buffer += '詳細条件を開く';
        buffer += '</a>';
        buffer += '</div>';
        buffer += '<div id="' + baseId + ':conditionSection:' + String(3) + ':none" style="display:none;">';
        buffer += '<a class="exp_hidden" id="' + baseId + ':conditionSection:' + String(3) + ':close" href="Javascript:void(0);">';
        buffer += '詳細条件を閉じる';
        buffer += '</a>';
        buffer += '</div>';
        buffer += '</div>';
        // 詳細
        buffer += '<div id="' + baseId + ':conditionGroup:' + String(3) + '" class="exp_conditionGroup exp_clearfix" style="display:none;">';
        buffer += '<div class="exp_line exp_clearfix">';
        buffer += '<div class="exp_left"></div><div class="exp_right"></div>';
        buffer += '</div>';
        buffer += outConditionSelect("sortType", "whiteSelect"); // 探索時の表示順設定
        buffer += outConditionSelect("priceType", "greenSelect"); // 探索時の料金設定
        buffer += outConditionSelect("transferTime", "whiteSelect"); // 乗換え時間
        buffer += '</div>';
        buffer += '</div>';

        // 平均経路の条件
        buffer += '<div class="exp_conditionSection">';
        buffer += '<div class="exp_title">平均経路の条件</div>';
        buffer += '<div class="exp_detailButton exp_clearfix">';
        buffer += '<div id="' + baseId + ':conditionSection:' + String(4) + ':active">';
        buffer += '<a class="exp_visible" id="' + baseId + ':conditionSection:' + String(4) + ':open" href="Javascript:void(0);">';
        buffer += '詳細条件を開く';
        buffer += '</a>';
        buffer += '</div>';
        buffer += '<div id="' + baseId + ':conditionSection:' + String(4) + ':none" style="display:none;">';
        buffer += '<a class="exp_hidden" id="' + baseId + ':conditionSection:' + String(4) + ':close" href="Javascript:void(0);">';
        buffer += '詳細条件を閉じる';
        buffer += '</a>';
        buffer += '</div>';
        buffer += '</div>';
        // 詳細
        buffer += '<div id="' + baseId + ':conditionGroup:' + String(4) + '" class="exp_conditionGroup exp_clearfix" style="display:none;">';
        buffer += '<div class="exp_line exp_clearfix">';
        buffer += '<div class="exp_left"></div><div class="exp_right"></div>';
        buffer += '</div>';
        buffer += outConditionSelect("walk", "whiteSelect"); // 駅間徒歩
        buffer += outConditionSelect("useJR", "greenSelect"); // JR路線
        buffer += outConditionSelect("expressStartingStation", "whiteSelect"); // 特急始発駅
        buffer += outConditionSelect("waitAverageTime", "greenSelect"); // 出発駅乗車
        buffer += outConditionSelect("localBusOnly", "whiteSelect"); // 路線バスのみ探索
        buffer += outConditionSelect("transfer", "greenSelect"); // 乗換え
        buffer += '</div>';
        buffer += '</div>';

        // 隠しタブ
        buffer += '<div style="display:none;">';
        // 新幹線
        buffer += outConditionSelect("shinkansen");
        // 新幹線のぞみ
        buffer += outConditionSelect("shinkansenNozomi");
        // 有料特急
        buffer += outConditionSelect("limitedExpress");
        // 路線バス
        buffer += outConditionSelect("localBus");
        // 有料普通列車
        buffer += outConditionSelect("liner");
        // 深夜急行バス
        buffer += outConditionSelect("midnightBus");
        // 路線名あいまい指定
        //  buffer += outConditionSelect("fuzzyLine");
        // 経由駅指定の継承
        //  buffer += outConditionSelect("entryPathBehavior");
        buffer += '</div>';

        buffer += '</div>';
        return buffer;
    }

    /*
    * イベントの振り分けを行う
    */
    function onEvent(e) {
        var eventIdList = (e.srcElement) ? e.srcElement.id.split(":") : e.target.id.split(":");
        if (eventIdList.length >= 2) {
            if (eventIdList[1] == "conditionTab" && eventIdList.length == 3) {
                // タブの選択
                var tabCount = 1;
                while (document.getElementById(baseId + ":conditionTab:" + String(tabCount))) {
                    if (tabCount == parseInt(eventIdList[2])) {
                        document.getElementById(baseId + ':conditionGroup:' + String(tabCount)).style.display = "block";
                        document.getElementById(baseId + ':conditionTab:' + String(tabCount) + ':active').style.display = "block";
                        document.getElementById(baseId + ':conditionTab:' + String(tabCount) + ':none').style.display = "none";
                    } else {
                        document.getElementById(baseId + ':conditionGroup:' + String(tabCount)).style.display = "none";
                        document.getElementById(baseId + ':conditionTab:' + String(tabCount) + ':active').style.display = "none";
                        document.getElementById(baseId + ':conditionTab:' + String(tabCount) + ':none').style.display = "block";
                    }
                    tabCount++;
                }
            } else if (eventIdList[1] == "conditionOpen") {
                document.getElementById(baseId + ':conditionDetail').style.display = "block";
            } else if (eventIdList[1] == "conditionClose") {
                document.getElementById(baseId + ':conditionDetail').style.display = "none";
                // 簡易設定のデフォルトも設定
                setSimpleCondition();
            } else if (eventIdList[2] == "checkbox" && eventIdList.length == 3) {
                if (document.getElementById(baseId + ':' + eventIdList[1] + ':checkbox').checked) {
                    // オンの時
                    setValue(eventIdList[1], document.getElementById(baseId + ':' + eventIdList[1] + ':checkbox').value);
                } else {
                    // オフの時
                    setValue(eventIdList[1], document.getElementById(baseId + ':' + eventIdList[1] + ':checkbox:none').value);
                }
            } else if (eventIdList[1] == "conditionSection" && eventIdList.length == 4) {
                // スマートフォン用の選択
                if (eventIdList[3] == "open") {
                    // タブを開く
                    document.getElementById(baseId + ':conditionSection:' + eventIdList[2] + ':active').style.display = "none";
                    document.getElementById(baseId + ':conditionSection:' + eventIdList[2] + ':none').style.display = "block";
                    document.getElementById(baseId + ':conditionGroup:' + eventIdList[2]).style.display = "block";
                } else if (eventIdList[3] == "close") {
                    // タブを閉じる
                    document.getElementById(baseId + ':conditionSection:' + eventIdList[2] + ':active').style.display = "block";
                    document.getElementById(baseId + ':conditionSection:' + eventIdList[2] + ':none').style.display = "none";
                    document.getElementById(baseId + ':conditionGroup:' + eventIdList[2]).style.display = "none";
                }
            }
        }
    }

    /*
    * 探索条件の項目出力
    */
    function outConditionSelect(id, classType) {
        id = id.toLowerCase();
        var buffer = "";
        buffer = '<div style="display:' + (conditionObject[id].visible ? 'block;' : 'none;') + '">';
        if (typeof classType == 'undefined') {
            buffer += '<dl class="exp_conditionItemList">';
        } else {
            buffer += '<dl class="exp_conditionItemList exp_' + classType + '">';
        }
        buffer += '<dt class="exp_conditionHeader" id="' + baseId + ':' + id + ':title">' + conditionObject[id].name + '</dt>';
        buffer += '<dd class="exp_conditionValue" id="' + baseId + ':' + id + ':value">';
        buffer += '<select id="' + baseId + ':' + id + '">';
        for (var i = 0; i < conditionObject[id].option.length; i++) {
            buffer += '<option value="' + conditionObject[id].value[i] + '">' + conditionObject[id].option[i] + '</option>';
        }
        buffer += '</select>';
        buffer += '</dd>';
        buffer += '</dl>';
        buffer += '</div>';
        return buffer;
    }

    /*
    * 探索条件の項目出力
    */
    function outConditionRadio(id, classType) {
        id = id.toLowerCase();
        var buffer = "";
        buffer = '<div style="display:' + (conditionObject[id].visible ? 'block;' : 'none;') + '">';
        if (typeof classType == 'undefined') {
            buffer += '<dl class="exp_conditionItemList">';
        } else {
            buffer += '<dl class="exp_conditionItemList exp_' + classType + '">';
        }
        buffer += '<dt class="exp_conditionHeader" id="' + baseId + ':' + id + ':title">' + conditionObject[id].name + '</dt>';
        if (id == "answercount" || id == "sorttype") {
            buffer += '<dd class="exp_conditionValueMulti" id="' + baseId + ':' + id + ':value">';
        } else {
            buffer += '<dd class="exp_conditionValue" id="' + baseId + ':' + id + ':value">';
        }
        buffer += '<div>';
        for (var i = 0; i < conditionObject[id].option.length; i++) {
            // 改行処理
            if (i > 0) {
                if (id == "answerCount" && i % 10 == 0) { buffer += '</div><span class="exp_separator"></span><div>'; }
                if (id == "sortType" && i % 5 == 0) { buffer += '</div><span class="exp_separator"></span><div>'; }
            }
            if (i == 0) {
                buffer += '<span class="exp_conditionItemLeft">';
            } else if ((i + 1) == conditionObject[id].option.length) {
                buffer += '<span class="exp_conditionItemRight">';
            } else {
                buffer += '<span class="exp_conditionItem">';
            }
            buffer += '<input type="radio" id="' + baseId + ':' + id + ':' + String(i + 1) + '" name="' + baseId + ':' + id + '" value="' + conditionObject[id].value[i] + '"><label for="' + baseId + ':' + id + ':' + String(i + 1) + '">' + conditionObject[id].option[i] + '</label></span>';
        }

        buffer += '</div>';
        buffer += '</dd>';
        buffer += '</dl>';
        buffer += '</div>';
        return buffer;
    }

    /*
    * 探索条件の項目出力
    */
    function outConditionCheckbox(id, value, none, label) {
        // 簡易条件のリストに入れる
        id = id.toLowerCase();
        checkboxItem.push(id);
        var buffer = "";
        buffer += '<div class="exp_item" style="display:' + (conditionObject[id].visible ? 'block;' : 'none;') + '">';
        buffer += '<input type="checkbox" id="' + baseId + ':' + id + ':checkbox" value="' + value + '"><label for="' + baseId + ':' + id + ':checkbox">' + ((typeof label != 'undefined') ? label : conditionObject[id].name) + '</label>';
        if (typeof none != 'undefined') {
            buffer += '<input type="hidden" id="' + baseId + ':' + id + ':checkbox:none" value="' + none + '">';
        }
        buffer += '</div>';
        return buffer;
    }

    /*
    * ソート順の取得
    */
    function getSortType() {
        return getValue("sortType");
    }

    /*
    * 探索結果数の取得
    */
    function getAnswerCount() {
        return getValue("answerCount");
    }

    /*
    * 探索条件文字列の取得
    */
    function getConditionDetail() {
        return fixCondition();
    }

    /*
    * 片道・往復・定期のフラグ取得
    */
    function getPriceType() {
        return getValue("priceType");
    }

    /*
    * 探索条件をフォームにセットする
    */
    function setCondition(param1, param2, priceType, condition) {
        if (isNaN(param1)) {
            // 単独で指定
            setValue(param1, String(param2));
        } else {
            // 全部指定
            // ヘッダ部分
            setValue("answerCount", String(param1));
            setValue("sortType", String(param2));
            setValue("priceType", String(priceType));
            var conditionList = condition.split('');
            // 探索条件
            setValue("plane", parseInt(conditionList[1]));
            setValue("shinkansen", parseInt(conditionList[2]));
            setValue("shinkansenNozomi", parseInt(conditionList[3]));
            setValue("sleeperTrain", parseInt(conditionList[4]));
            setValue("limitedExpress", parseInt(conditionList[5]));
            setValue("highwayBus", parseInt(conditionList[6]));
            setValue("connectionBus", parseInt(conditionList[7]));
            setValue("localBus", parseInt(conditionList[8]));
            setValue("ship", parseInt(conditionList[9]));
            setValue("liner", parseInt(conditionList[10]));
            setValue("walk", parseInt(conditionList[11]));
            setValue("midnightBus", parseInt(conditionList[12]));
            setValue("surchargeKind", parseInt(conditionList[15]));
            setValue("teikiKind", parseInt(conditionList[16]));
            setValue("JRSeasonalRate", parseInt(conditionList[17]));
            setValue("studentDiscount", parseInt(conditionList[18]));
            //  setValue("airFare",parseInt(conditionList[19]));
            setValue("includeInsurance", parseInt(conditionList[20]));
            setValue("ticketSystemType", parseInt(conditionList[21]));
            setValue("nikukanteiki", parseInt(conditionList[22]));
            setValue("useJR", parseInt(conditionList[25]));
            setValue("transfer", parseInt(conditionList[26]));
            setValue("expressStartingStation", parseInt(conditionList[27]));
            setValue("waitAverageTime", parseInt(conditionList[28]));
            setValue("localBusOnly", parseInt(conditionList[29]));
            //  setValue("fuzzyLine",parseInt(conditionList[30]));
            setValue("transferTime", parseInt(conditionList[31]));
            //  setValue("entryPathBehavior",parseInt(conditionList[32]));
        }
        setSimpleCondition();
    }

    /*
    * フォームに値をセットする
    */
    function setValue(id, value) {
        var name = id.toLowerCase();
        if (document.getElementById(baseId + ':' + name)) {
            if (typeof document.getElementById(baseId + ':' + name).length != 'undefined') {
                // セレクトボックス
                if (typeof value == 'number') {
                    setSelectIndex(name, value);
                } else {
                    setSelect(name, value);
                }
            } else {
                // ラジオボタン
                if (typeof value == 'number') {
                    setRadioIndex(name, value);
                } else {
                    setRadio(name, value);
                }
            }
        } else {
            // ラジオボタン
            if (typeof value == 'number') {
                setRadioIndex(name, value);
            } else {
                setRadio(name, value);
            }
        }
    }

    /*
    * ラジオボタンをインデックスで指定する
    */
    function setRadioIndex(name, value) {
        document.getElementsByName(baseId + ':' + name)[(document.getElementsByName(baseId + ':' + name).length - value)].checked = true;
    }
    /*
    * ラジオボタンを値で指定する
    */
    function setRadio(name, value) {
        for (var i = 0; i < document.getElementsByName(baseId + ':' + name).length; i++) {

            if (document.getElementsByName(baseId + ':' + name)[i].value == String(value)) {
                document.getElementsByName(baseId + ':' + name)[i].checked = true;
            }

        }
    }

    /*
    * セレクトボックスをインデックスで指定する
    */
    function setSelectIndex(name, value) {
        document.getElementById(baseId + ':' + name).selectedIndex = (document.getElementById(baseId + ':' + name).options.length - value);
    }

    /*
    * セレクトボックスを値で指定する
    */
    function setSelect(name, value) {
        for (var i = 0; i < document.getElementById(baseId + ':' + name).options.length; i++) {
            if (document.getElementById(baseId + ':' + name)[i].value == String(value)) {
                document.getElementById(baseId + ':' + name).selectedIndex = i;
                return;
            }
        }
    }
    /*
    * 探索条件の確定
    */
    function fixCondition() {
        var conditionList = def_condition.split('');
        // 探索条件
        conditionList[1] = getValueIndex("plane", parseInt(conditionList[1]));
        conditionList[2] = getValueIndex("shinkansen", parseInt(conditionList[2]));
        conditionList[3] = getValueIndex("shinkansenNozomi", parseInt(conditionList[3]));
        conditionList[4] = getValueIndex("sleeperTrain", parseInt(conditionList[4]));
        conditionList[5] = getValueIndex("limitedExpress", parseInt(conditionList[5]));
        conditionList[6] = getValueIndex("highwayBus", parseInt(conditionList[6]));
        conditionList[7] = getValueIndex("connectionBus", parseInt(conditionList[7]));
        conditionList[8] = getValueIndex("localBus", parseInt(conditionList[8]));
        conditionList[9] = getValueIndex("ship", parseInt(conditionList[9]));
        conditionList[10] = getValueIndex("liner", parseInt(conditionList[10]));
        conditionList[11] = getValueIndex("walk", parseInt(conditionList[11]));
        conditionList[12] = getValueIndex("midnightBus", parseInt(conditionList[12]));
        conditionList[15] = getValueIndex("surchargeKind", parseInt(conditionList[15]));
        conditionList[16] = getValueIndex("teikiKind", parseInt(conditionList[16]));
        conditionList[17] = getValueIndex("JRSeasonalRate", parseInt(conditionList[17]));
        conditionList[18] = getValueIndex("studentDiscount", parseInt(conditionList[18]));
        //  conditionList[19] = getValueIndex("airFare",parseInt(conditionList[19]));
        conditionList[20] = getValueIndex("includeInsurance", parseInt(conditionList[20]));
        conditionList[21] = getValueIndex("ticketSystemType", parseInt(conditionList[21]));
        conditionList[22] = getValueIndex("nikukanteiki", parseInt(conditionList[22]));
        conditionList[25] = getValueIndex("useJR", parseInt(conditionList[25]));
        conditionList[26] = getValueIndex("transfer", parseInt(conditionList[26]));
        conditionList[27] = getValueIndex("expressStartingStation", parseInt(conditionList[27]));
        conditionList[28] = getValueIndex("waitAverageTime", parseInt(conditionList[28]));
        conditionList[29] = getValueIndex("localBusOnly", parseInt(conditionList[29]));
        //  conditionList[30] = getValueIndex("fuzzyLine",parseInt(conditionList[30]));
        conditionList[31] = getValueIndex("transferTime", parseInt(conditionList[31]));
        //  conditionList[32] = getValueIndex("entryPathBehavior",parseInt(conditionList[32]));

        // 設定値
        var tmpCondition = conditionList.join('');

        return tmpCondition;
    }

    /*
    * フォームの値を取得する
    */
    function getValue(id) {
        var name = id.toLowerCase();
        if (document.getElementById(baseId + ':' + name)) {
            if (typeof document.getElementById(baseId + ':' + name).length != 'undefined') {
                // セレクトボックス
                return getSelect(name);
            } else {
                // ラジオボタン
                return getRadio(name);
            }
        } else {
            // ラジオボタン
            return getRadio(name);
        }
    }
    /*
    * ラジオボタンの値を取得
    */
    function getRadio(name) {
        for (var i = 0; i < document.getElementsByName(baseId + ':' + name).length; i++) {
            if (document.getElementsByName(baseId + ':' + name)[i].checked == true) {
                return document.getElementsByName(baseId + ':' + name)[i].value;
            }
        }
        return null;
    }
    /*
    * セレクトボックスの値を取得
    */
    function getSelect(name) {
        return document.getElementById(baseId + ':' + name).options.item(document.getElementById(baseId + ':' + name).selectedIndex).value;
    }

    /*
    * フォームのインデックスを取得する
    */
    function getValueIndex(id) {
        var name = id.toLowerCase();
        if (document.getElementById(baseId + ':' + name)) {
            if (typeof document.getElementById(baseId + ':' + name).length != 'undefined') {
                // セレクトボックス
                return getSelectIndex(name);
            } else {
                // ラジオボタン
                return getRadioIndex(name);
            }
        } else {
            // ラジオボタン
            return getRadioIndex(name);
        }
    }
    /*
    * ラジオボタンのインデックスを取得
    */
    function getRadioIndex(name) {
        var index = document.getElementsByName(baseId + ':' + name).length;
        for (var i = 0; i < document.getElementsByName(baseId + ':' + name).length; i++) {
            if (document.getElementsByName(baseId + ':' + name)[i].checked) {
                return (index - i);
            }
        }
    }
    /*
    * セレクトボックスのインデックスを取得
    */
    function getSelectIndex(name) {
        return (document.getElementById(baseId + ':' + name).options.length - document.getElementById(baseId + ':' + name).selectedIndex)
    }

    /*
    * デフォルトを設定
    */
    function resetCondition() {
        setCondition(def_answerCount, def_sortType, def_priceType, def_condition);
    }

    /*
    * 環境設定
    */
    function setConfigure(name, value) {
        if (name.toLowerCase() == String("apiURL").toLowerCase()) {
            apiURL = value;
        } else if (name.toLowerCase() == String("agent").toLowerCase()) {
            agent = value;
        } else if (value.toLowerCase() == "visible") {
            conditionObject[name.toLowerCase()].visible = true;
            // 探索条件の表示
            if (document.getElementById(baseId + ':' + name.toLowerCase() + ':separator')) {
                document.getElementById(baseId + ':' + name.toLowerCase() + ':separator').style.display = "block";
            }
            if (document.getElementById(baseId + ':' + name.toLowerCase() + ':title')) {
                document.getElementById(baseId + ':' + name.toLowerCase() + ':title').style.display = "block";
            }
            if (document.getElementById(baseId + ':' + name.toLowerCase() + ':value')) {
                document.getElementById(baseId + ':' + name.toLowerCase() + ':value').style.display = "block";
            }
        } else if (value.toLowerCase() == "hidden") {
            conditionObject[name.toLowerCase()].visible = false;
            // 探索条件の非表示
            if (document.getElementById(baseId + ':' + name.toLowerCase() + ':separator')) {
                document.getElementById(baseId + ':' + name.toLowerCase() + ':separator').style.display = "none";
            }
            if (document.getElementById(baseId + ':' + name.toLowerCase() + ':title')) {
                document.getElementById(baseId + ':' + name.toLowerCase() + ':title').style.display = "none";
            }
            if (document.getElementById(baseId + ':' + name.toLowerCase() + ':value')) {
                document.getElementById(baseId + ':' + name.toLowerCase() + ':value').style.display = "none";
            }
        }
    }

    /*
    * 探索条件を取得
    */
    function getCondition(id) {
        return getValue(id.toLowerCase());
    }

    /*
    * 簡易探索条件を取得
    */
    function getConditionLight(id) {
        if (getValue(id.toLowerCase()) == "normal") {
            return true;
        } else {
            return false;
        }
    }

    /*
    * 利用できる関数リスト
    */
    this.dispCondition = dispCondition;
    this.dispConditionSimple = dispConditionSimple;
    this.dispConditionLight = dispConditionLight;
    this.getPriceType = getPriceType;
    this.getConditionDetail = getConditionDetail;
    this.getAnswerCount = getAnswerCount;
    this.getSortType = getSortType;
    this.getCondition = getCondition;
    this.getConditionLight = getConditionLight;
    this.setCondition = setCondition;
    this.resetCondition = resetCondition; ;
    this.setConfigure = setConfigure;

    /*
    * 定数リスト
    */
    this.SORT_EKISPERT = "ekispert";
    this.SORT_PRICE = "price";
    this.SORT_TIME = "time";
    this.SORT_TEIKI = "teiki";
    this.SORT_TRANSFER = "transfer";
    this.SORT_CO2 = "co2";
    this.SORT_TEIKI1 = "teiki1";
    this.SORT_TEIKI3 = "teiki3";
    this.SORT_TEIKI6 = "teiki6";
    this.PRICE_ONEWAY = "oneway";
    this.PRICE_ROUND = "round";
    this.PRICE_TEIKI = "teiki";

    this.CONDITON_ANSWERCOUNT = "answerCount";
    this.CONDITON_SORTTYPE = "sortType";
    this.CONDITON_PRICETYPE = "priceType";
    this.CONDITON_PLANE = "plane";
    this.CONDITON_SHINKANSEN = "shinkansen";
    this.CONDITON_SHINKANSENNOZOMI = "shinkansenNozomi";
    this.CONDITON_SLEEPERTRAIN = "sleeperTrain";
    this.CONDITON_LIMITEDEXPRESS = "limitedExpress";
    this.CONDITON_HIGHWAYBUS = "highwayBus";
    this.CONDITON_CONNECTIONBUS = "connectionBus";
    this.CONDITON_LOCALBUS = "localBus";
    this.CONDITON_SHIP = "ship";
    this.CONDITON_LINER = "liner";
    this.CONDITON_WALK = "walk";
    this.CONDITON_MIDNIGHTBUS = "midnightBus";
    this.CONDITON_SURCHARGEKIND = "surchargeKind";
    this.CONDITON_TEIKIKIND = "teikiKind";
    this.CONDITON_JRSEASONALRATE = "JRSeasonalRate";
    this.CONDITON_STUDENTDISCOUNT = "studentDiscount";
    //this.CONDITON_AIRFARE = "airFare";
    this.CONDITON_INCLUDEINSURANCE = "includeInsurance";
    this.CONDITON_TICKETSYSTEMTYPE = "ticketSystemType";
    this.CONDITON_NIKUKANTEIKI = "nikukanteiki";
    this.CONDITON_USEJR = "useJR";
    this.CONDITON_TRANSFER = "transfer";
    this.CONDITON_EXPRESSSTARTINGSTATION = "expressStartingStation";
    this.CONDITON_WAITAVERAGETIME = "waitAverageTime";
    this.CONDITON_LOCALBUSONLY = "localBusOnly";
    //this.CONDITON_FUZZYLINE = "fuzzyLine";
    this.CONDITON_TRANSFERTIME = "transferTime";
    //this.CONDITON_ENTRYPATHBEHAVIOR = "entryPathBehavior";

    // 端末制御
    this.AGENT_PC = 1;
    this.AGENT_PHONE = 2;
    this.AGENT_TABLET = 3;
};
