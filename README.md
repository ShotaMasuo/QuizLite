# QuizLite

小中高向けのクイズ学習アプリケーション

## 概要

QuizLiteは、React + TypeScriptで構築されたクイズ学習アプリケーションです。英語と数学の問題を解きながら楽しく学習できます。

## 主な機能

- 📚 **科目選択**: 英語・数学から選択可能
- ✍️ **回答形式**: 記述式・4択問題に対応
- 📊 **進捗表示**: リアルタイムで進捗状況を確認
- 📈 **結果表示**: スコアと誤答の確認
- ♿ **アクセシビリティ**: キーボード操作、スクリーンリーダー対応

## 技術スタック

- **フロントエンド**: React + TypeScript + Vite
- **状態管理**: 
  - Context API（低頻度更新の設定管理）
  - Zustand（高頻度更新のクイズ進行管理）
- **APIモック**: MSW（Mock Service Worker）
- **スタイリング**: CSS Modules
- **テスト**: 
  - Vitest（単体テスト）
  - React Testing Library（コンポーネントテスト）
  - Cypress（E2Eテスト）

## セットアップ

### 必要な環境
- Node.js 18.x 以上
- npm 8.x 以上

### インストール

```bash
# リポジトリのクローン
git clone [repository-url]
cd QuizLite

# 依存関係のインストール
npm install
```

## 開発

### 開発サーバーの起動

```bash
npm run dev
```

http://localhost:5173 でアプリケーションが起動します。

### ビルド

```bash
npm run build
```

ビルド成果物は `dist` ディレクトリに出力されます。

### テスト

```bash
# 単体テストの実行
npm test

# テストUIの起動
npm run test:ui

# カバレッジレポート
npm run test:coverage

# E2Eテストの実行（開発モード）
npm run cypress:open

# E2Eテストの実行（CIモード）
npm run cypress:run
```

### リント

```bash
npm run lint
```

## プロジェクト構成

```
src/
  app/
    providers/       # Context Provider
    routes/          # ページコンポーネント（Home, Quiz, Result）
  components/        # UIコンポーネント
  features/
    quiz/           # クイズ機能のロジックとストア
  services/
    api.ts          # API通信層
    types.ts        # 型定義
  mocks/
    handlers.ts     # MSWハンドラー
  tests/            # テスト関連
```

## アーキテクチャの特徴

### 状態管理の分離

- **Context API**: アプリ全体の設定（科目、モード、問題数など）を管理
- **Zustand**: クイズ進行中の状態（現在の問題、回答、スコアなど）を管理

この分離により、更新頻度の異なる状態を効率的に管理しています。

### テスト戦略

1. **単体テスト**: ビジネスロジックの検証
2. **統合テスト**: コンポーネントとストアの連携確認
3. **E2Eテスト**: ユーザーフローの検証
4. **アクセシビリティテスト**: キーボード操作とARIA属性の確認

## 使い方

1. アプリケーションを起動
2. ホーム画面で以下を選択：
   - 名前（任意）
   - 科目（英語 or 数学）
   - 回答形式（記述式 or 4択）
   - 問題数（3問、5問、10問）
3. 「クイズを開始」ボタンをクリック
4. 各問題に回答
5. 結果画面でスコアと誤答を確認
6. 「もう一度挑戦する」で最初から

## ライセンス

MIT
