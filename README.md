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
        "mkdir": function(current_dir, callback){
            var foldername = prompt('Folder name:');
            if( !foldername ){ return; }
            callback( foldername );
            return;
        },
        "mkdir": function(current_dir, callback){
            var foldername = prompt('Folder name:');
            if( !foldername ){ return; }
            callback( foldername );
            return;
        }
    }
);
// console.log(remoteFinder);
remoteFinder.init('/', {}, function(){
    console.log('ready.');
});
</script>
```


## 更新履歴 - Change log

### remote-finder v0.0.3 (2019年 リリース日未定)

- nodeJs版バックエンドで、GPIがアクセスできる機能の制限を増やした。
- PHP版バックエンドの依存関係の問題を修正。

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
