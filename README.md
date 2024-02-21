# 駅すぱあと API HTML5インターフェースサンプル

## 1.はじめに

### 概要

[駅すぱあと API](https://ekiworld.net/service/sier/webservice/index.html)を利用したサンプルコードです。  

https://github.com/EkispertWebService/GUI  
※サンプルコードはこちらのURLからダウンロードしてください。

ソースコードや画像は自由に改変できますので、是非ご利用ください。  
なお、サンプルとしてのご提供のため、動作保証やお問い合わせ等のサポートは承っておりません。  
ご利用にあたりユーザーズガイドをご用意しておりますので、ご参照ください。  

サンプルコードへのご意見・ご要望につきましては、[GitHubのIssue](https://github.com/EkispertWebService/GUI/issues/new)へ投稿いただけますと幸いです。  
今後のサンプルご提供にあたり参考とさせていただきます。  

### お申込み

はじめてご利用いただく場合は、[駅すぱあとワールド](https://ekiworld.net/)でのお申込み(無料)とキーの発行が必要になります。

お申し込みは下記のページから行ってください。

[駅すぱあと API フリープラン](https://ekiworld.net/service/sier/webservice/free_provision.html)

後日、アクセスキーをメールにてお送りいたします。

## 2.ご利用方法

 ### ソースコードのインクルード

ソースコードを[こちら](https://github.com/EkispertWebService/GUI)からダウンロードした後、任意のディレクトリにファイルを展開します。  
なお、各パーツごとにディレクトリが分かれていますので、jsファイル、expCssディレクトリ、および、expImagesディレクトリをコピーして利用します。  

※expCss、および、expImagesディレクトリはディレクトリ名を変更せずにそのままコピーしてください。

なお、表示するページごとにJavaScriptをインクルードする必要があります。  
インクルードは下記使用例を参考に記述してください。  

`<script type="text/javascript" src="コンポーネント名.js?key=keycode" charset="UTF-8"></script>`

※ keycode の部分には、弊社発行のキーコードを記述します。  
※ コンポーネントのご利用にはアクセスキーが必要になります。認証キーはサービス契約時に弊社より送付されます。  

また、下記のパーツをご利用の場合はCSSファイルのインクルードも必要になります。  

* 日付入力パーツ  
* 駅名入力パーツ  
* 探索条件パーツ  

`<link class="css" rel="stylesheet" type="text/css" href="expCss/コンポーネント名.css">`

## 3.IE8/IE9での制限

### 制限事項

IE8/IE9は標準でJSONに対応していないため、そのままでは利用することが出来ません。  

### 回避方法

IE8/IE9の場合は"json2.js"等を利用し、JSONへの拡張を行なってください。  
なお、IE10/IE11やFIrefox、Chromeは標準で対応していますので、追加は不要です。  

## 4. 仕様

[Wiki](https://github.com/EkispertWebService/GUI-LightEdition/wiki)にて公開しております。

## 5. 動作サンプル

**画面**

* [経路探索](http://ekispertwebservice.github.io/GUI-LightEdition/sample/sample.html)

**データ取得**

* [駅情報の取得](http://ekispertwebservice.github.io/GUI-LightEdition/sample/stationInfo.html)
* [路線情報の取得](http://ekispertwebservice.github.io/GUI-LightEdition/sample/railInfo.html)
