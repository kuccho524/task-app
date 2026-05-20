# Task App

## 概要

Task App は、Project単位でTaskを管理できる小規模タスク管理アプリです。

個人・小規模チームでのタスク管理を想定し、Project / Task のCRUD、検索・絞り込み、進捗率表示、作成者ベースの編集・削除制御に対応しています。

単なるToDo管理ではなく、実務で必要になりやすい以下の観点を意識して実装しました。

- ProjectとTaskの親子関係管理
- ステータス・優先度・担当者による絞り込み
- Project単位の進捗率表示
- 関連Taskが存在するProjectの削除制御
- 作成者のみ編集・削除できる権限制御
- Supabase Authとアプリ用ユーザー情報の分離
- Vitestによる主要ロジックの単体テスト

## デモ

以下のURLから動作確認できます。

- 本番環境：https://task-app-two-vert.vercel.app/

### テストアカウント

```text
メールアドレス：test@example.com
パスワード：password
```

## 主な機能

### 認証

- ユーザー登録
- ログイン
- ログアウト
- Supabase Authによる認証
- public.users へのユーザー情報自動登録
- user_code の自動採番

### Task管理

- Task一覧
- Task詳細
- Task作成
- Task編集
- Task削除
- taskId の自動採番
- Projectとの紐づけ
- 作成者のみ編集・削除可能

### Project管理

- Project一覧
- Project詳細
- Project作成
- Project編集
- Project削除
- projectId の自動採番
- 関連Task一覧表示
- Task件数・完了件数・進捗率表示
- 関連TaskがあるProjectは削除不可

### 検索・絞り込み

- Task一覧のProject絞り込み
- Task一覧のStatus絞り込み
- Task一覧のPriority絞り込み
- Task一覧の担当者絞り込み
- Task一覧のキーワード検索
- Project一覧のStatus絞り込み
- Project一覧のPriority絞り込み
- Project一覧の担当者絞り込み
- Project一覧のキーワード検索
- 現在の検索条件表示
- 条件リセット

## 画面一覧

- `/signup`：ユーザー登録
- `/login`：ログイン
- `/tasks`：Task一覧
- `/tasks/new`：Task作成
- `/tasks/[taskId]`：Task詳細
- `/tasks/[taskId]/edit`：Task編集
- `/projects`：Project一覧
- `/projects/new`：Project作成
- `/projects/[projectId]`：Project詳細
- `/projects/[projectId]/edit`：Project編集

## 工夫した点

- Supabase Authとpublic.usersを連携し、認証情報とアプリ用ユーザー情報を分離
- DB trigger / functionにより、user_codeを自動採番
- taskId / projectId を `tsk000001` / `prj000001` 形式で自動採番
- Project詳細からTask作成した場合、作成後にProject詳細へ戻るように制御
- URLクエリを使って検索条件を保持
- 条件リセット時にフォーム入力値も初期化
- Project削除時、関連Taskが存在する場合は削除不可にして安全性を確保
- 作成者のみ編集・削除できるように権限制御
- 共通CSSにより一覧・詳細・フォーム画面の見た目を統一

## テスト

Vitestを使用して、以下の主要ロジックに対する単体テストを実装しています。

- Project進捗率計算
- Task完了件数の集計
- 編集・削除権限判定
- Project削除可否判定
- 日付フォーマット
- 開始日・期限日のバリデーション

## セットアップ

### 1. リポジトリをクローン
git clone <repository-url>
cd task-app

### 2. パッケージをインストール
npm install

### 3. 環境変数を設定
.env.example を参考に .env または .env.local を作成します。

DATABASE_URL=""
DIRECT_URL=""
NEXT_PUBLIC_SUPABASE_URL=""
NEXT_PUBLIC_SUPABASE_ANON_KEY=""
SUPABASE_SERVICE_ROLE_KEY=""

### 4. Prisma Clientを生成
npx prisma generate

### 5. 開発サーバー起動
npm run dev

### 6. テスト
npm run test:run

### 7. ビルド
npm run build

## 今後の改善予定

- UIデザインのさらなる改善
- スクリーンショット追加
- Task / Projectの並び替え
- 期限日での絞り込み
- ユーザー招待・複数ユーザー運用
- コメント機能
- 権限ロールの追加
