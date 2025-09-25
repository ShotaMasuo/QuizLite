# QuizLite --- 実装ブリーフ（アーキ設計のみ）

## 1) 目的と範囲

-   **目的**：小中高向けの「クイズ学習」MVP。**科目選択→出題→結果**の最短導線で、フロント実装力（状態管理/テスト/Storybook/VRT）を示す。\
-   **範囲**：フロント単体（React）。バックエンドは **msw**
    によりモック。\
-   **評価観点**：React + 状態管理（Context &
    Zustand）、テスト（Vitest/RTL/Cypress）、UIドキュメント（Storybook/Chromatic）、a11y。

------------------------------------------------------------------------

## 2) 画面フロー & 情報設計

### 画面

1.  **Home**：科目・出題数・形式選択（英語/数学、1問1答 or 4択）
2.  **Quiz**：問題表示・回答・進捗バー
3.  **Result**：正答率・誤答一覧・再挑戦

### 共有設定（低頻度）＝ **Context**

-   `AppSettings`: `{ subject, mode, total, userName? }`
-   `AppContext`: `settings`, `setSettings(partial)`

### クイズ進行（高頻度）＝ **Zustand**

-   `questions: Question[]`
-   `index: number`
-   `answers: Record<qid, answer>`
-   `status: 'idle'|'loading'|'ready'|'finished'`
-   `load(settings)`, `answer(qid,val)`, `next()`, `reset()`, `score()`

> **原則**：\
> - 低頻度で全域共有する設定系は **Context**。\
> - 高頻度で変化するUI状態は **Zustand**（疎結合・テスタブル）。

------------------------------------------------------------------------

## 3) データ契約（APIインターフェイス）

-   エンドポイント（msw）：`GET /api/quizzes?subject&mode&total`
-   レスポンス（`QuizResponse`）：
    -   `items: Question[]`
    -   `Question` ユニオン：
        -   英語：`{ id, kind:'english', word, answer, choices? }`
        -   数学：`{ id, kind:'math', expr, answer }`
-   **制約**：英語 `mode=choice4` の場合のみ `choices[]`
    を返す。記述式は `choices` 省略。

> ここは**変えない契約**。実装側は自由だが、この入出力は守る。

------------------------------------------------------------------------

## 4) コンポーネント境界（関心の分離）

-   **SubjectPicker**：科目/形式/出題数フォーム（Contextへ保存）
-   **QuestionCard**：問題描画（英語/数学/形式違いを内包、a11y対応）
-   **ProgressBar**：進捗表示（index/total から%）
-   **ResultSummary**：`score()` と誤答一覧を受けて表示

> **UIロジックはコンポーネント、業務ロジックは features/**\
> 「採点」「進捗計算」などの純ロジックは `features/quiz/utils`
> へ寄せる。

------------------------------------------------------------------------

## 5) ディレクトリ（論理構造）

    src/
      app/
        providers/          # Context（AppProvider）
        routes/             # Home / Quiz / Result（ページ）
      components/           # UIコンポーネント群（Storybook対象）
      features/
        quiz/               # ドメインロジック＆状態（Zustand + utils + selectors）
      services/
        api.ts              # fetchQuestions(settings) ※mswを透過
        types.ts            # Question/AppSettings/QuizResponse 型定義
      mocks/
        handlers.ts         # /api/quizzes のmswハンドラ
        browser.ts / server.ts
      tests/                # RTLの統合テストなど（任意）
    cypress/
      e2e/                  # E2Eシナリオ（smoke / full-flow）
    .storybook/
      main.ts / preview.ts  # Storybook設定（a11y addon, Chromatic）

------------------------------------------------------------------------

## 6) テスト/品質の枠組み（何を担保するか）

### 単体（Vitest）

-   採点/進捗/整形など**純ロジック**（`features/quiz/utils`）
-   Zustand ストアの**状態遷移**（`load→answer→next→score`）

### コンポーネント（RTL）

-   `QuestionCard`：表示/操作（英語4択、英語記述、数学）
-   `ResultSummary`：スコア計算結果の反映

### 結合（RTL+msw）

-   `/quiz` 初回マウント → API（msw）呼び出し → 初問表示

### **E2E（Cypress）**

-   `smoke`: Home→Quiz→Result の遷移と最小操作が通る
-   `full-flow`: N問連続回答→正答率表示→再挑戦で初期化
-   a11yスモーク（重大違反が無いこと）

### UI回帰（Storybook + Chromatic）

-   `QuestionCard / ProgressBar / ResultSummary / SubjectPicker`
    の代表状態をStories化
-   PR時にChromatic実行、差分レビュー

> **セレクタ方針**：`getByRole`/`getByLabelText`
> を優先（a11y重視）。E2Eで必要な箇所のみ `data-cy` を付与。

------------------------------------------------------------------------

## 7) 非機能要件（MVP向けミニマム）

-   **a11y**：キーボード操作/フォーカス可視/aria属性（最低限）
-   **i18n**（任意）：英/日のトグル（教育領域での訴求点）
-   **エラー処理**：API失敗時の再試行UI（mswで500を用意）
-   **パフォーマンス**：ルート単位の`lazy`/`suspense`（任意）
-   **型安全**：APIレスポンスのバリデーション（zodは任意）

------------------------------------------------------------------------

## 8) 受け入れ基準（面接で見せるチェックリスト）

-   [ ] **フロー**：`/`→`/quiz`→`/result` が動作（ローカル or Vercel）
-   [ ] **状態分離**：Context（設定）とZustand（進行）を併用
-   [ ] **APIモック**：mswで`/api/quizzes`が機能（subject/mode/total）
-   [ ] **テスト**：Vitest/RTL/Cypress が一通り通る
-   [ ] **UIドキュメント**：Storybook が立ち、Chromatic 履歴がある
-   [ ] **a11y**：基本操作（Tab/Enter/Space）で完結できる

------------------------------------------------------------------------

## 9) デモ台本（30〜60秒）

> 「設定など**低頻度の共有はContext**、クイズ進行の**高頻度状態はZustand**に分離。\
> **msw**でバックエンドを仮想化し、**Vitest/RTL**でロジックとUIを、**Cypress**で"科目選択→回答→結果"の一連を保証。\
> **Storybook+Chromatic**でUI回帰を自動検出できる構成です。」

------------------------------------------------------------------------

## 10) 拡張余地（示唆のみ）

-   難易度調整・弱点タグ学習・履歴グラフ
-   マルチプレイ（リアルタイム同期）／認証（外部IdP）
-   SSR/SSG（Next.js）/ PWA 化

------------------------------------------------------------------------

## 11) 実装ポリシー（守るべき約束）

-   **ドメインとUIの分離**：採点/整形は `features/quiz` に集約
-   **副作用の集約**：データ取得は `services/api`
    経由（直接fetchしない）
-   **テスタブルな設計**：状態遷移は副作用を避け、関数境界を薄く保つ
-   **a11yファースト**：ロール/ラベル起点で操作できる構造を最優先
