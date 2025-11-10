# remote-finder プロジェクト インストラクション

## プロジェクト概要

remote-finder は、Finder や Explorer のように、サーバー上のファイルとフォルダを操作するUIを提供するライブラリです。Node.js と PHP の両方のサーバー実装をサポートしています。

## プロジェクト構造

### コアディレクトリ

- **`src/`**: クライアントサイドのソースコード
  - `remote-finder.js`: エントリーポイント
  - `inc/main.js`: メインロジック
  - `css/`: スタイルシート
  - `inc/dropfiles/`: ドラッグ&ドロップ機能
  - `inc/property-view/`: プロパティビュー機能
  - `inc/templates/`: Twigテンプレート
  - `themes/`: テーマ（darkmode等）

- **`node/`**: Node.jsサーバー実装
  - `main.js`: エントリーポイント、GPI（General Purpose Interface）実装
  - `apis/`: API実装（13のAPIモジュール）
    - `getItemInfo.js`, `getFileContent.js`, `getItemList.js`
    - `createNewFile.js`, `createNewFolder.js`, `saveFile.js`
    - `copy.js`, `rename.js`, `remove.js`
    - `getRealpath.js`, `getResolvedPath.js`
    - `isVisiblePath.js`, `isWritablePath.js`

- **`php/`**: PHPサーバー実装
  - `main.php`: メインクラス（約577行）
  - Node.js版と同じAPI機能を提供

- **`tests/`**: テストコードとデモアプリケーション
  - `mainTest.js`: Node.js向けMochaテスト
  - `mainTest.php`: PHP向けPHPUnitテスト
  - `app/`: デモアプリケーション
    - `server/`: Node.jsサーバー
    - `client/`: クライアントHTML
    - `client_php/`: PHPサーバー実装デモ
  - `data/root1/`: テストデータ

### ビルド・設定ファイル

- **`webpack.mix.js`**: Laravel Mixによるビルド設定
- **`package.json`**: Node.jsの依存関係とスクリプト
- **`composer.json`**: PHPの依存関係
- **`phpunit.xml`**: PHPUnitの設定

## 技術スタック

### フロントエンド
- **jQuery**: DOM操作
- **px2style**: スタイリング
- **Twig**: テンプレートエンジン
- **Sass**: CSSプリプロセッサ

### バックエンド
- **Node.js**: 
  - `fs-extra`: ファイルシステム操作
  - `mime-types`: MIMEタイプ判定
  - `file-type`: ファイルタイプ検出
  - `express`: HTTPサーバー（開発用）
- **PHP 7.3+**:
  - `tomk79/filesystem`: ファイルシステムユーティリティ

### ビルド・開発ツール
- **Laravel Mix 6.x**: Webpackラッパー
- **Babel**: JavaScript トランスパイラ
- **Mocha**: Node.jsテストフレームワーク
- **PHPUnit 9.5**: PHPテストフレームワーク

## 主要機能

### GPI（General Purpose Interface）
クライアントとサーバー間の統一インターフェース。以下のAPIを提供：

1. **ファイル情報取得**: `getItemInfo`, `getFileContent`, `getItemList`
2. **ファイル作成**: `createNewFile`, `createNewFolder`
3. **ファイル編集**: `saveFile`, `rename`, `copy`, `remove`
4. **パス解決**: `getRealpath`, `getResolvedPath`
5. **アクセス制御**: `isVisiblePath`, `isWritablePath`

### セキュリティ機能
- **読み取り専用パス**: `paths_readonly` オプションでパスを読み取り専用に設定
- **不可視パス**: `paths_invisible` オプションでパスを隠す
- ワイルドカードパターン対応（例: `/readonly/*`, `*.hide`）

## 開発ワークフロー

### セットアップ

```bash
# Node.js依存関係のインストール
npm install

# PHP依存関係のインストール
composer install
```

### ビルド

```bash
# 開発ビルド
npm run dev

# ウォッチモード
npm run watch

# 本番ビルド
npm run prod
```

### テスト実行

```bash
# Node.jsテスト
npm test

# PHPテスト
composer test
```

### 開発サーバー

```bash
# Node.jsサーバー起動
npm start

# PHPサーバー起動
composer start
composer open-in-browser
```

## コーディング規約

### ファイル命名
- クライアントサイド: ケバブケース（例: `remote-finder.js`）
- サーバーサイドAPI: キャメルケース（例: `getItemInfo.js`）
- クラス/モジュール: キャメルケース

### モジュール構造
- 各APIは独立したモジュールとして実装
- `module.exports` でエクスポート
- プロトタイプベースで機能を拡張

### コールバックパターン
- Node.jsスタイルのコールバック（エラーファースト）
- 結果は `{result: boolean, message: string, ...}` の形式

## 重要な注意点

### パス処理
- 仮想パスは常にUnixスタイル（`/`区切り）
- Windowsパス（`\`, `C:\`）は自動的に変換
- ルートディレクトリは設定で指定（`paths_root_dir`）

### セキュリティ
- ルートディレクトリ外へのアクセスは禁止
- パスのエスケープ処理を必ず実施
- API名の検証（英数字のみ許可）

### ブラウザ互換性
- jQuery依存のため、jQuery互換ブラウザが必要
- モダンブラウザ推奨

## リリースプロセス

1. 変更をコミット
2. テストが通ることを確認（`npm test`, `composer test`）
3. 本番ビルドを生成（`npm run prod`）
4. バージョンを更新（`package.json`, `composer.json`）
5. Git tagを作成してプッシュ

## トラブルシューティング

### ビルドエラー
- `node_modules/` を削除して `npm install` を再実行
- Node.jsバージョンを確認（推奨: 14.x以上）

### テストエラー
- テストデータディレクトリのパーミッションを確認
- `tests/data/root1/` の書き込み権限が必要

### パスアクセスエラー
- `paths_root_dir` の設定を確認
- ファイルシステムのパーミッションを確認
- `paths_readonly`, `paths_invisible` の設定を確認

## 依存関係の更新

定期的に依存関係を更新してください：

```bash
# Node.js依存関係
npm update
npm audit fix

# PHP依存関係
composer update
```

## ライセンス

MIT License

## 作者

Tomoya Koyanagi (tomk79@gmail.com)
