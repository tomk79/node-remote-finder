# remote-finder アピアランス設定インストラクション

## 概要

remote-finderは、ライトモード、ダークモード、および自動切り替え（prefers-color-scheme対応）をサポートしており、px2styleフレームワークと統合されたアピアランス設定を提供します。

## アピアランスの構成

### 1. CSSファイルの構造

remote-finderは、以下の8つのテーマCSSビルドを提供しています：

#### メインスタイル（必須）
- **`dist/remote-finder.css`**: 基本スタイル
  - ソース: `src/remote-finder.scss`
  - px2styleを**含まない**（外部で個別に読み込む必要がある）
  
- **`dist/remote-finder.bundled.css`**: バンドル版基本スタイル
  - ソース: `src/remote-finder.bundled.scss`
  - px2styleを**含む**（1ファイルで完結）

#### テーマファイル（オプション）

##### デフォルトテーマ（自動切り替え）
- **`dist/themes/default.css`**: 自動切り替えテーマ
  - ソース: `src/themes/default.scss`
  - px2styleのautoテーマを**含まない**
  - `@media (prefers-color-scheme: dark)` でダークモードを自動適用
  
- **`dist/themes/default.bundled.css`**: バンドル版自動切り替えテーマ
  - ソース: `src/themes/default.bundled.scss`
  - px2styleのautoテーマを**含む**
  - `@media (prefers-color-scheme: dark)` でダークモードを自動適用

##### ライトモードテーマ
- **`dist/themes/lightmode.css`**: ライトモード専用テーマ
  - ソース: `src/themes/lightmode.scss`
  - px2styleのdefaultテーマを**含まない**
  - 空ファイル（remote-finderのデフォルトスタイルがライトモード）
  
- **`dist/themes/lightmode.bundled.css`**: バンドル版ライトモードテーマ
  - ソース: `src/themes/lightmode.bundled.scss`
  - px2styleのdefaultテーマを**含む**

##### ダークモードテーマ
- **`dist/themes/darkmode.css`**: ダークモード専用テーマ
  - ソース: `src/themes/darkmode.scss`
  - px2styleのdarkmodeテーマを**含まない**
  
- **`dist/themes/darkmode.bundled.css`**: バンドル版ダークモードテーマ
  - ソース: `src/themes/darkmode.bundled.scss`
  - px2styleのdarkmodeテーマを**含む**

### 2. アピアランスの実装方法

#### SCSSソースファイルの構造

```
src/
├── remote-finder.scss              # 基本スタイルのエントリーポイント
├── remote-finder.bundled.scss      # px2style統合版のエントリーポイント
├── css/
│   └── main.scss                   # メインスタイル定義（ライトモード用）
└── themes/
    ├── default.scss                # 自動切り替えテーマ（非バンドル版）
    ├── default.bundled.scss        # 自動切り替えテーマ（バンドル版）
    ├── lightmode.scss              # ライトモードテーマ（非バンドル版・空ファイル）
    ├── lightmode.bundled.scss      # ライトモードテーマ（バンドル版）
    ├── darkmode.scss               # ダークモードテーマ（非バンドル版）
    ├── darkmode.bundled.scss       # ダークモードテーマ（バンドル版）
    └── darkmode_files/
        ├── main.scss               # ダークモード用スタイルオーバーライド（139行）
        └── editor.scss             # エディタのダークモードスタイル
```

#### ダークモードのスタイル定義

`src/themes/darkmode_files/main.scss` および `src/themes/darkmode_files/editor.scss` では、以下の要素に対してダークモード用のスタイルを定義しています：

**主要な色設定:**
- 背景色: `#111`, `#222`, `#333`
- テキスト色: `#eee`, `#ddd`, `#fff`
- ボーダー色: `#444`, `#666`, `#999`
- 選択状態: `#00a0e6` → `#3dbbf1`（ホバー時）

**対応コンポーネント:**
1. **メニューバー** (`.remote-finder__menu`)
   - 背景: `#111`
   - ボーダー: `#666`
   - ホバー: `#222`

2. **パスバー** (`.remote-finder__path-bar`)
   - 背景: `#111`
   - ボーダー: `#999`, `#666`
   - ホバー: `#222`

3. **ファイルリスト** (`.remote-finder__file-list`)
   - 背景: `#222`
   - ホバー: `#333`
   - ボーダー: `#444`
   - 選択状態: `#00a0e6`

4. **プロパティビュー** (`.remote-finder__property-view`)
   - 背景: `#333`
   - ボーダー: `#444`, `#666`

5. **プレビュー** (`.remote-finder__preview`)
   - コード背景: `#222`
   - コード文字色: `rgb(165, 92, 92)`
   - ボーダー: `#444`

6. **エディタ** (`.remote-finder__editor`)
   - 背景: `#111`
   - ボーダー: `#666`
   - Monaco Editorのダークテーマ統合

7. **ドロップゾーン** (`.remote-finder__dropzone`)
   - 背景: `#2229` (半透明)
   - ボーダー: `#555`

8. **結果表示**
   - 成功: `#292` (背景), `#393` (ボーダー)
   - 失敗: `#922` (背景), `#d33` (ボーダー)

### 3. クライアント側の実装方法

#### パターン1: 自動切り替え（prefers-color-scheme対応）- 非バンドル版

```html
<!-- px2style -->
<link rel="stylesheet" href="./path/to/px2style/px2style.css" />
<link rel="stylesheet" href="./path/to/px2style/themes/auto.css" />

<!-- remote-finder -->
<link rel="stylesheet" href="./path/to/remote-finder/remote-finder.css" />
<link rel="stylesheet" href="./path/to/remote-finder/themes/default.css" />
```

OSまたはブラウザの設定に応じて自動的にライトモード/ダークモードが切り替わります。

#### パターン2: 自動切り替え - バンドル版

```html
<!-- remote-finder バンドル版（px2style込み） -->
<link rel="stylesheet" href="./path/to/remote-finder/remote-finder.bundled.css" />
<link rel="stylesheet" href="./path/to/remote-finder/themes/default.bundled.css" />
```

#### パターン3: ライトモード固定 - 非バンドル版

```html
<!-- px2style -->
<link rel="stylesheet" href="./path/to/px2style/px2style.css" />
<link rel="stylesheet" href="./path/to/px2style/themes/default.css" />

<!-- remote-finder -->
<link rel="stylesheet" href="./path/to/remote-finder/remote-finder.css" />
<link rel="stylesheet" href="./path/to/remote-finder/themes/lightmode.css" />
```

#### パターン4: ライトモード固定 - バンドル版

```html
<!-- remote-finder バンドル版（px2style込み） -->
<link rel="stylesheet" href="./path/to/remote-finder/remote-finder.bundled.css" />
<link rel="stylesheet" href="./path/to/remote-finder/themes/lightmode.bundled.css" />
```

#### パターン5: ダークモード固定 - 非バンドル版

```html
<!-- px2style -->
<link rel="stylesheet" href="./path/to/px2style/px2style.css" />
<link rel="stylesheet" href="./path/to/px2style/themes/darkmode.css" />

<!-- remote-finder -->
<link rel="stylesheet" href="./path/to/remote-finder/remote-finder.css" />
<link rel="stylesheet" href="./path/to/remote-finder/themes/darkmode.css" />
```

```html
<body class="_px2-darkmode">
    <div id="finder1"></div>
</body>
```

**注意**: ダークモードを使用する場合は、必ず `<body>` タグに `_px2-darkmode` クラスを追加してください。

#### パターン6: ダークモード固定 - バンドル版

```html
<!-- remote-finder バンドル版（px2style込み） -->
<link rel="stylesheet" href="./path/to/remote-finder/remote-finder.bundled.css" />
<link rel="stylesheet" href="./path/to/remote-finder/themes/darkmode.bundled.css" />
```

```html
<body class="_px2-darkmode">
    <div id="finder1"></div>
</body>
```

### 4. アピアランスの動的切り替え（PHPの例）

`$_GET['appearance']` パラメータでアピアランスを動的に切り替えることができます。

```php
<!-- px2style -->
<link rel="stylesheet" href="./px2style/px2style.css" />
<?php if(($_GET['appearance']??'') == 'lightmode'){ ?>
    <link rel="stylesheet" href="./px2style/themes/default.css" />
<?php }elseif(($_GET['appearance']??'') == 'darkmode'){ ?>
    <link rel="stylesheet" href="./px2style/themes/darkmode.css" />
<?php }else{ ?>
    <link rel="stylesheet" href="./px2style/themes/auto.css" />
<?php } ?>

<!-- remote-finder -->
<link rel="stylesheet" href="./remote-finder.css" />

<?php if(($_GET['appearance']??'') == 'lightmode'){ ?>
    <link rel="stylesheet" href="./themes/lightmode.css" />
<?php }elseif(($_GET['appearance']??'') == 'darkmode'){ ?>
    <link rel="stylesheet" href="./themes/darkmode.css" />
<?php }else{ ?>
    <link rel="stylesheet" href="./themes/default.css" />
<?php } ?>
```

アクセス例:
- デフォルト（自動）: `http://example.com/`
- ライトモード: `http://example.com/?appearance=lightmode`
- ダークモード: `http://example.com/?appearance=darkmode`

### 5. px2styleとの連携

remote-finderは**px2style**フレームワークと統合されており、以下の機能を活用しています：

- **ダークモード切り替え**: `_px2-darkmode` クラスによる切り替え
- **自動切り替え**: `prefers-color-scheme` メディアクエリによる自動切り替え
- **カラー変数**: `--px2-main-color` などのCSS変数
- **レスポンシブデザイン**: px2styleの基本レイアウトシステム

#### px2styleの依存関係

```json
"devDependencies": {
    "px2style": "github:pickles2/px2style#develop"
}
```

### 6. ビルド設定

#### webpack.mix.js での定義

```javascript
mix
    .js('src/remote-finder.js', 'dist/')
    .js('src/remote-finder.bundled.js', 'dist/')
    .sass('src/remote-finder.scss', 'dist/')
    .sass('src/remote-finder.bundled.scss', 'dist/')
    .sass('src/themes/default.scss', 'dist/themes/')
    .sass('src/themes/default.bundled.scss', 'dist/themes/')
    .sass('src/themes/lightmode.scss', 'dist/themes/')
    .sass('src/themes/lightmode.bundled.scss', 'dist/themes/')
    .sass('src/themes/darkmode.scss', 'dist/themes/')
    .sass('src/themes/darkmode.bundled.scss', 'dist/themes/')
```

#### ビルドコマンド

```bash
# 開発ビルド
npm run dev

# ウォッチモード
npm run watch

# 本番ビルド
npm run prod
```

## 開発ガイドライン

### アピアランススタイルの追加・変更

#### ダークモードスタイルの編集

1. **ファイル編集**: `src/themes/darkmode_files/main.scss` または `src/themes/darkmode_files/editor.scss` を編集
2. **色の選択**: 既存のカラーパレットに従う
   - 背景: `#111` → `#222` → `#333`
   - テキスト: `#ddd` → `#eee` → `#fff`
   - ボーダー: `#444` → `#666` → `#999`
3. **クラス名**: `.remote-finder` をプレフィックスとする BEM 記法
4. **ビルド**: `npm run dev` または `npm run prod`
5. **テスト**: `tests/app/client_php/index.php?appearance=darkmode` で確認

#### ライトモードスタイルの編集

1. **ファイル編集**: `src/css/main.scss` または `src/css/editor.scss` を編集
2. **ビルド**: `npm run dev` または `npm run prod`
3. **テスト**: `tests/app/client_php/index.php?appearance=lightmode` で確認

### 新しいコンポーネントの追加

1. **ライトモード**: `src/css/main.scss` にスタイルを追加
2. **ダークモード**: `src/themes/darkmode_files/main.scss` にオーバーライドを追加
3. **BEM記法**: `.remote-finder__component-name` の形式を使用
4. **色の定義**: ハードコードせず、既存のパレットを使用

### テスト環境

#### Node.jsサーバー版
- パス: `tests/app/client/index.html`
- サーバー起動: `npm start`
- アクセス: `http://127.0.0.1:3000/`
- ダークモード: `<body class="_px2-darkmode">` を追加

#### PHPサーバー版（推奨）
- パス: `tests/app/client_php/index.php`
- サーバー起動: `composer start`
- ブラウザで開く: `composer open-in-browser`
- アクセス:
  - 自動切り替え: `http://127.0.0.1:8088/tests/app/client_php/`
  - ライトモード: `http://127.0.0.1:8088/tests/app/client_php/?appearance=lightmode`
  - ダークモード: `http://127.0.0.1:8088/tests/app/client_php/?appearance=darkmode`

## バージョン履歴

### v0.5.0 (リリース日未定)
- アピアランス対応の強化
  - `default` テーマを追加（prefers-color-scheme による自動切り替え）
  - `lightmode` テーマを追加（ライトモード固定）
  - `auto` テーマを `default` テーマに統合
  - 各テーマのバンドル版と非バンドル版を提供
  - PHPテストクライアントに `?appearance=lightmode|darkmode` パラメータによる切り替えを実装

### v0.3.0 (2024年4月30日)
- px2style を分離
- px2style を統合した bundledビルドを追加
- ダークモードに関する細かい修正

### v0.2.4 (2023年11月13日)
- ダークモード用のスタイルをバンドル

## トラブルシューティング

### アピアランスが適用されない

1. **テーマファイル確認**: 適切なテーマファイル（`default.css`, `lightmode.css`, `darkmode.css`）が読み込まれているか
2. **px2style確認**: px2styleの対応するテーマファイルも読み込まれているか
3. **ダークモードクラス**: ダークモード使用時は `<body>` タグに `_px2-darkmode` クラスが付与されているか
4. **ビルド**: 最新のビルドが生成されているか（`npm run prod`）
5. **キャッシュ**: ブラウザのキャッシュをクリア

### 自動切り替えが動作しない

1. **テーマファイル**: `default.css` または `default.bundled.css` を使用しているか確認
2. **px2style**: px2styleの `auto.css` テーマが読み込まれているか確認（非バンドル版の場合）
3. **ブラウザ対応**: ブラウザが `prefers-color-scheme` に対応しているか確認
4. **OS設定**: OSのダークモード設定を確認

### スタイルが反映されない

1. **ビルド**: `npm run dev` または `npm run prod` を実行
2. **ファイルパス**: CSSファイルのパスが正しいか確認
3. **読み込み順序**: 
   - 非バンドル版: px2style → px2styleテーマ → remote-finder → remote-finderテーマ
   - バンドル版: remote-finder.bundled → テーマ.bundled
4. **バンドル版**: バンドル版を使用する場合、非バンドル版との混在に注意

### カスタマイズが反映されない

1. **SCSSファイル**: `src/` 配下のSCSSファイルを編集しているか（`dist/` ではない）
2. **ビルド実行**: 編集後に必ずビルドコマンドを実行
3. **ウォッチモード**: 開発中は `npm run watch` を使用すると便利
4. **クラス名**: `.remote-finder` プレフィックスを忘れていないか

## 関連ファイル

### SCSSソースファイル
- `src/css/main.scss`: ライトモード基本スタイル
- `src/css/editor.scss`: エディタのライトモードスタイル
- `src/themes/default.scss`: 自動切り替えテーマ（非バンドル版）
- `src/themes/default.bundled.scss`: 自動切り替えテーマ（バンドル版）
- `src/themes/lightmode.scss`: ライトモードテーマ（非バンドル版・空ファイル）
- `src/themes/lightmode.bundled.scss`: ライトモードテーマ（バンドル版）
- `src/themes/darkmode.scss`: ダークモードテーマ（非バンドル版）
- `src/themes/darkmode.bundled.scss`: ダークモードテーマ（バンドル版）
- `src/themes/darkmode_files/main.scss`: ダークモードオーバーライド（139行）
- `src/themes/darkmode_files/editor.scss`: エディタのダークモードスタイル

### ビルド設定
- `webpack.mix.js`: ビルド設定
- `src/remote-finder.scss`: 非バンドル版エントリーポイント
- `src/remote-finder.bundled.scss`: バンドル版エントリーポイント

### テストクライアント
- `tests/app/client/index.html`: Node.jsテストクライアント
- `tests/app/client_php/index.php`: PHPテストクライアント（アピアランス切り替え対応）

### ビルド出力
- `dist/remote-finder.css`: 基本スタイル（非バンドル版）
- `dist/remote-finder.bundled.css`: 基本スタイル（バンドル版）
- `dist/themes/default.css`: 自動切り替えテーマ（非バンドル版）
- `dist/themes/default.bundled.css`: 自動切り替えテーマ（バンドル版）
- `dist/themes/lightmode.css`: ライトモードテーマ（非バンドル版）
- `dist/themes/lightmode.bundled.css`: ライトモードテーマ（バンドル版）
- `dist/themes/darkmode.css`: ダークモードテーマ（非バンドル版）
- `dist/themes/darkmode.bundled.css`: ダークモードテーマ（バンドル版）

## 注意事項

1. **px2style依存**: remote-finderはpx2styleに依存しているため、バンドル版以外を使用する場合は必ずpx2styleを読み込むこと
2. **テーマの選択**: `default`, `lightmode`, `darkmode` のいずれか1つのテーマのみを読み込むこと（複数読み込まない）
3. **ビルド必須**: SCSSファイルの変更は必ずビルドが必要（直接CSSを編集しない）
4. **ダークモードクラス**: ダークモードは `_px2-darkmode` クラスによって制御される（px2styleの仕様）
5. **自動切り替え**: `default` テーマは `prefers-color-scheme` メディアクエリで自動切り替えを行う
6. **本番環境**: 本番環境では `npm run prod` でビルドした最適化版を使用すること
7. **バージョン管理**: `dist/` ディレクトリはビルド生成物だが、リポジトリに含まれている
