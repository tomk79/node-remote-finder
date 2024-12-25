# remote-finder
Finder や Explorer のように、サーバー上のファイルとフォルダを操作するUIを提供します。

## Usage

### Server Side

#### NodeJS

```js
var RemoteFinder = require('remote-finder'),
    remoteFinder = new RemoteFinder({
        "default": '/path/to/root_dir/'
    }, {
        'paths_readonly': [
            '/readonly/*',
            '/write_protected/*'
        ],
        'paths_invisible': [
            '/hidefiles/*',
            '/invisibles/*',
            '*.hide'
        ]
    });

var express = require('express'),
    app = express();
var server = require('http').Server(app);
app.use( require('body-parser')({"limit": "1024mb"}) );

// Client Resources
app.use( '/common/remote-finder/', 'node_modules/remote-finder/dist/' );

// Remote Finder API
app.use( '/apis/remote-finder', function(req, res, next){
    // GPI = General Purpose Interface
    remoteFinder.gpi(req.body, function(result){
        res.status(200);
        res.set('Content-Type', 'application/json');
        res.send( JSON.stringify(result) ).end();
    });
    return;
} );

server.listen( 3000, function(){
    console.log('server-standby');
} );
```

#### PHP

```php
<?php
require_once('/path/to/vendor/autoload.php');
$remoteFinder = new tomk79\remoteFinder\main(array(
    'default' => '/path/to/root_dir/'
), array(
    'paths_invisible' => array(
        '/invisibles/*',
        '*.hide'
    ),
    'paths_readonly' => array(
        '/readonly/*',
    ),
));
$value = $remoteFinder->gpi( json_decode( $_REQUEST['data'] ) );
header('Content-type: text/json');
echo json_encode($value);
exit;
```


(optional) ダウンロードのエンドポイントを追加する方法は次の通り。

```php
<?php
require_once(__DIR__.'/../../../vendor/autoload.php');
$remoteFinder = new tomk79\remoteFinder\main(array(
	'default' => __DIR__.'/../../data/root1/'
), array(
	'paths_invisible' => array(
		'/invisibles/*',
		'*.hide'
	),
	'paths_readonly' => array(
		'/readonly/*',
	),
));
$remoteFinder->download( $_REQUEST['path'] );
exit;
```


### Client Side

```html
<div id="finder1"></div>

<script>
var remoteFinder = window.remoteFinder = new RemoteFinder(
    document.getElementById('finder1'),
    {
        "gpiBridge": function(input, callback){ // required
            fetch("/apis/remote-finder", {
                method: "post",
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(input)
            }).then(function (response) {
                var contentType = response.headers.get('content-type').toLowerCase();
                if(contentType.indexOf('application/json') === 0 || contentType.indexOf('text/json') === 0) {
                    response.json().then(function(json){
                        callback(json);
                    });
                } else {
                    response.text().then(function(text){
                        callback(text);
                    });
                }
            }).catch(function (response) {
                console.log(response);
                callback(response);
            });
        },
        "open": function(fileinfo, callback){
            alert('ファイル ' + fileinfo.path + ' を開きました。');
            callback(true);
        },
        "mkdir": function(current_dir, callback){
            var foldername = prompt('Folder name:');
            if( !foldername ){ return; }
            callback( foldername );
            return;
        },
        "mkfile": function(current_dir, callback){
            var filename = prompt('File name:');
            if( !filename ){ return; }
            callback( filename );
            return;
        },
        "copy": function(copyFrom, callback){
            var copyTo = prompt('Copy from '+copyFrom+' to:', copyFrom);
            callback( copyFrom, copyTo );
            return;
        },
        "rename": function(renameFrom, callback){
            var renameTo = prompt('Rename from '+renameFrom+' to:', renameFrom);
            callback( renameFrom, renameTo );
            return;
        },
        "remove": function(path_target, callback){
            if( !confirm('Really?') ){
                return;
            }
            callback();
            return;
        },
        "generateDownloadLink": function(targetFile, callback){
            callback('./download?path=' + encodeURIComponent(targetFile));
        },
    }
);
remoteFinder.init('/', {}, function(){
    console.log('ready.');
});
</script>
```


## 更新履歴 - Change log

### remote-finder v0.4.0 (2024年12月25日)

- `generateDownloadLink` オプションを追加した。
- ファイルのダウンロードに失敗した場合に復帰できなくなる不具合を修正した。
- PHP版バックエンドに `$remoteFinder->download()` を追加した。
- `generateDownloadLink` オプションを指定しない従来のダウンロード機能で、30MB以上のファイルをダウンロードできないようになった。

### remote-finder v0.3.0 (2024年4月30日)

- px2style を分離した。
- px2style を統合した bundledビルドを追加。
- ダークモードに関する細かい修正。

### remote-finder v0.2.4 (2023年11月13日)

- ダークモード用のスタイルをバンドルした。

### remote-finder v0.2.3 (2023年5月1日)

- px2style を更新した。

### remote-finder v0.2.2 (2023年4月22日)

- 親ディレクトリ `../` へ遷移する操作性に関する改善。
- プレビュー可能な拡張子に、 `csv`、 `webp`、 `jsx`、 `ts` などを追加した。

### remote-finder v0.2.1 (2023年2月11日)

- ファイルやディレクトリのグループIDが取得できない場合に起きる不具合を修正。
- スタイリングに関する修正。

### remote-finder v0.2.0 (2022年12月29日)

- PHPの対象環境を `>=7.3.0` に変更。
- Windowsで起きる不具合の修正。
- その他内部コードの修正など。

### remote-finder v0.1.1 (2021年6月12日)

- オーナーとモードを表示するようになった。
- その他の細かい修正。

### remote-finder v0.1.0 (2021年3月31日)

- プロパティビューを追加し、操作性を改善した。
- ローカルファイルのドラッグ＆ドロップ操作でファイルをアップロードできるようになった。
- 選択したファイルをダウンロードできるようになった。
- ファイルサイズの大きいファイルをプレビューさせないようにした。

### remote-finder v0.0.5 (2020年3月14日)

- NodeJS版のサーバーサイドスクリプトで、 `md5`、 `base64`、 `mime-type` の計算が正しく行われない不具合を修正。
- プレビューできる拡張子をいくつか追加した。

### remote-finder v0.0.4 (2020年2月26日)

- ファイルとフォルダのアイコンが区別しやすくなった。
- フィルター機能の対象がファイルのみになり、ディレクトリは隠されないようになった。
- ファイルオープン前に、プレビューを表示するようになった。
- その他の細かい修正。

### remote-finder v0.0.3 (2019年6月9日)

- nodeJs版バックエンドで、GPIがアクセスできる機能の制限を増やした。
- PHP版バックエンドの依存関係の問題を修正。
- バックエンドが返すエラーメッセージを改善。

### remote-finder v0.0.2 (2018年12月19日)

- パンくずを表示するようになった。
- ファイルやフォルダのコピー機能を追加。
- フィルター機能を追加。
- アイコンを改善。

### remote-finder v0.0.1 (2018年12月5日)

- 初回リリース


## License

MIT License


## Author

- Tomoya Koyanagi <tomk79@gmail.com>
- website: <https://www.pxt.jp/>
- Twitter: @tomk79 <https://twitter.com/tomk79/>
