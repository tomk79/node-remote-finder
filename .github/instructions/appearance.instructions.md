# remote-finder アピアランス設定インストラクション

## 概要

remote-finderは、ライトモードとダークモードの両方をサポートしており、px2styleフレームワークと統合されたアピアランス設定を提供します。

## アピアランスの構成

### 1. CSSファイルの構造

remote-finderは、以下の4つの主要なCSSビルドを提供しています：

#### メインスタイル
- **`dist/remote-finder.css`**: 基本スタイル（ライトモード）
  - ソース: `src/remote-finder.scss`
  - px2styleを**含まない**（外部で個別に読み込む必要がある）
  
- **`dist/remote-finder.bundled.css`**: バンドル版基本スタイル
  - ソース: `src/remote-finder.bundled.scss`
  - px2styleを**含む**（1ファイルで完結）

#### ダークモードテーマ
- **`dist/themes/darkmode.css`**: ダークモードテーマ
  - ソース: `src/themes/darkmode.scss`
  - px2styleのダークモードテーマを**含まない**
  
- **`dist/themes/darkmode.bundled.css`**: バンドル版ダークモードテーマ
  - ソース: `src/themes/darkmode.bundled.scss`
  - px2styleのダークモードテーマを**含む**

### 2. ダークモードの実装方法

#### SCSSソースファイルの構造

```
src/
├── remote-finder.scss              # 基本スタイルのエントリーポイント
├── remote-finder.bundled.scss      # px2style統合版のエントリーポイント
├── css/
│   └── main.scss                   # メインスタイル定義（382行）
└── themes/
    ├── darkmode.scss               # ダークモードのエントリーポイント
    ├── darkmode.bundled.scss       # px2style統合版ダークモード
    └── darkmode_files/
        └── main.scss               # ダークモード用スタイルオーバーライド（137行）
```

#### ダークモードのスタイル定義

`src/themes/darkmode_files/main.scss` では、以下の要素に対してダークモード用のスタイルを定義しています：

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

6. **ドロップゾーン** (`.remote-finder__dropzone`)
   - 背景: `#2229` (半透明)
   - ボーダー: `#555`

7. **結果表示**
   - 成功: `#292` (背景), `#393` (ボーダー)
   - 失敗: `#922` (背景), `#d33` (ボーダー)

### 3. クライアント側の実装方法

#### パターン1: 非バンドル版（推奨：軽量）

```html
<!-- px2style -->
<link rel="stylesheet" href="./path/to/px2style/px2style.css" />

<!-- remote-finder メインスタイル -->
<link rel="stylesheet" href="./path/to/remote-finder/remote-finder.css" />

<!-- ダークモード（オプション） -->
<link rel="stylesheet" href="./path/to/remote-finder/themes/darkmode.css" />
```

```html
<body class="_px2-darkmode">
    <div id="finder1"></div>
</body>
```

#### パターン2: バンドル版（推奨：シンプル）

```html
<!-- remote-finder バンドル版（px2style込み） -->
<link rel="stylesheet" href="./path/to/remote-finder/remote-finder.bundled.css" />

<!-- ダークモードバンドル版（オプション） -->
<link rel="stylesheet" href="./path/to/remote-finder/themes/darkmode.bundled.css" />
```

```html
<body class="_px2-darkmode">
    <div id="finder1"></div>
</body>
```

### 4. px2styleとの連携

remote-finderは**px2style**フレームワークと統合されており、以下の機能を活用しています：

- **ダークモード切り替え**: `_px2-darkmode` クラスによる自動切り替え
- **カラー変数**: `--px2-main-color` などのCSS変数
- **レスポンシブデザイン**: px2styleの基本レイアウトシステム

#### px2styleの依存関係

```json
"devDependencies": {
    "px2style": "github:pickles2/px2style#develop"
}
```

### 5. ビルド設定

#### webpack.mix.js での定義

```javascript
mix
    .js('src/remote-finder.js', 'dist/')
    .js('src/remote-finder.bundled.js', 'dist/')
    .sass('src/remote-finder.scss', 'dist/')
    .sass('src/remote-finder.bundled.scss', 'dist/')
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

### ダークモードスタイルの追加・変更

1. **ファイル編集**: `src/themes/darkmode_files/main.scss` を編集
2. **色の選択**: 既存のカラーパレットに従う
   - 背景: `#111` → `#222` → `#333`
   - テキスト: `#ddd` → `#eee` → `#fff`
   - ボーダー: `#444` → `#666` → `#999`
3. **クラス名**: `.remote-finder` をプレフィックスとする BEM 記法
4. **ビルド**: `npm run dev` または `npm run prod`
5. **テスト**: `tests/app/client/index.html` または `tests/app/client_php/index.html` で確認

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
- ダークモード: `<body class="_px2-darkmode">` を確認

#### PHPサーバー版
- パス: `tests/app/client_php/index.html`
- サーバー起動: `composer start`
- ブラウザで開く: `composer open-in-browser`
- ダークモード: HTML内のコメントを解除して有効化

## バージョン履歴

### v0.3.0 (2024年4月30日)
- px2style を分離
- px2style を統合した bundledビルドを追加
- ダークモードに関する細かい修正

### v0.2.4 (2023年11月13日)
- ダークモード用のスタイルをバンドル

## トラブルシューティング

### ダークモードが適用されない

1. **クラス確認**: `<body>` タグに `_px2-darkmode` クラスが付与されているか
2. **CSS読み込み**: ダークモード用CSSファイルが正しく読み込まれているか
3. **ビルド**: 最新のビルドが生成されているか（`npm run prod`）
4. **キャッシュ**: ブラウザのキャッシュをクリア

### スタイルが反映されない

1. **ビルド**: `npm run dev` または `npm run prod` を実行
2. **ファイルパス**: CSSファイルのパスが正しいか確認
3. **読み込み順序**: px2style → remote-finder → darkmode の順序を確認
4. **バンドル版**: バンドル版を使用する場合、非バンドル版との混在に注意

### カスタマイズが反映されない

1. **SCSSファイル**: `src/` 配下のSCSSファイルを編集しているか（`dist/` ではない）
2. **ビルド実行**: 編集後に必ずビルドコマンドを実行
3. **ウォッチモード**: 開発中は `npm run watch` を使用すると便利
4. **クラス名**: `.remote-finder` プレフィックスを忘れていないか

## 関連ファイル

- `src/css/main.scss`: ライトモード基本スタイル（382行）
- `src/themes/darkmode_files/main.scss`: ダークモードオーバーライド（137行）
- `src/remote-finder.scss`: 非バンドル版エントリーポイント
- `src/remote-finder.bundled.scss`: バンドル版エントリーポイント
- `src/themes/darkmode.scss`: ダークモード非バンドル版
- `src/themes/darkmode.bundled.scss`: ダークモードバンドル版
- `webpack.mix.js`: ビルド設定
- `tests/app/client/index.html`: Node.jsテストクライアント
- `tests/app/client_php/index.html`: PHPテストクライアント

## 注意事項

1. **px2style依存**: remote-finderはpx2styleに依存しているため、バンドル版以外を使用する場合は必ずpx2styleを読み込むこと
2. **ビルド必須**: SCSSファイルの変更は必ずビルドが必要（直接CSSを編集しない）
3. **互換性**: ダークモードは `_px2-darkmode` クラスによって制御される（px2styleの仕様）
4. **本番環境**: 本番環境では `npm run prod` でビルドした最適化版を使用すること
5. **バージョン管理**: `dist/` ディレクトリはビルド生成物だが、リポジトリに含まれている
