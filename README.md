# Task App

## 概要

Task Appは、Project単位でTaskを管理できるタスク管理アプリです。  
ユーザー認証、Project / Task CRUD、検索・絞り込み、進捗表示に対応しています。

## 使用技術

- Next.js
- TypeScript
- Prisma
- Supabase PostgreSQL
- Supabase Auth
- Tailwind CSS
- Vercel

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

## 今後の改善予定

- UIデザインのさらなる改善
- スクリーンショット追加
- Task / Projectの並び替え
- 期限日での絞り込み
- ユーザー招待・複数ユーザー運用
- コメント機能
- 権限ロールの追加