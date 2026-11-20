# 主催者向け PR 動画（Remotion）

「使いやすいタイムテーブル、できました。」— 謎解きイベントの主催者に向けた約 86 秒の紹介動画です。
1920×1080・30fps・無音（X の音声オフ自動再生を前提に、文字だけで伝わる構成）。

## 構成（`src/theme.ts` の `SCENES`）

| 秒 | 場面 | ファイル |
|---|---|---|
| 0–5 | 開場：ポスター 7 枚 → 実機、見出し | `scenes/Hook.tsx` |
| 5–12 | 課題：画像・PDF の表の不便 | `scenes/Problem.tsx` |
| 12–16 | 要点 3 つ | `scenes/Points.tsx` |
| 16–40 | 参加者の体験（実機の操作 4 つ） | `scenes/Demo.tsx`（`Demo`） |
| 40–50 | 会場マップ：ルート案内・拡大・階段で上の階へ（新機能） | `scenes/Demo.tsx`（`Venue`） |
| 50–55 | 主催にも：参加者の＋1 は主催の＋1 | `scenes/Bridge.tsx` |
| 55–73 | 主催の設定：スプシ→ボタン／フォーム取込／着せ替え／利用レポート | `scenes/Organizer.tsx` |
| 73–83 | ご相談：導入サポート（会場マップの設定を含む）・DM | `scenes/Cta.tsx` |
| 83–86 | エンドカード | `scenes/Cta.tsx` |

画面下の時刻の目盛り（`components/Motion.tsx` の `Ruler`）は、動画そのものを 1 本のタイムテーブルに見立てた演出です。

## モーション版（`Film`・約 74 秒）

1 枚の大きな時間割の上に場面を 3×3 に並べ、地図アプリのルートと同じ青い線（`#1a73e8`・流れる白い点）1 本で、
開場からゴール（DM）までをカットなしでつなぐ。カメラは線を追い、最後に引いて全体の道のりを見せる。

| 秒 | 場面 | 主な動き |
|---|---|---|
| 0–6 | 開場 | 出発の点から線が走って時間の軸になり、時刻と公演枠のブロックが組み上がる。見出し「使いやすい／イベントタイムテーブル、／できました。」は線から立ち上がる |
| 6–12 | 課題 | いつもの画像・PDF の表が 20 枚の札にほどけ、スマホの画面へ組み替わって時間割になる（表は切らない）。「スマホでも、使いやすく。」 |
| 12–18 | いいところ 3 つ | 線が通るたびに、カードが 1 枚ずつ表へ返る |
| 18–30 | 基本機能 | 真ん中のスマホ 1 台を大きく見せ、画面が 選ぶ → 絞る → 共有 と切り替わる |
| 30–43 | 地図 | 線が画面に入って「ルートを見る」を押し、屋内の階をたどる → 「外へ」でズームアウトし、屋外の案内（周辺地図は OSM。灰色の小さな注記で出典を出す） |
| 43–50 | スキマ提案 | 見どころ 2 を単独の駅で。線はこのスマホを通り抜けて＋1 へ |
| 50–58 | ＋1 | 線が輪を描き終えたところで＋1 が灯る →「みんなの＋1。」→ 期待できる効果 |
| 58–63 | スプシ | 「設定は、」→ 線がメニュー「公演一覧へ反映する」を押す → 表がたたまれ、タイムテーブルが立ち上がる |
| 63–67 | ゴール | MIT ライセンスで公開・導入も改良も無料。導入のサポートが要るときは DM |
| 67–74 | 全体 | 引いて道のり全体 → 見出し |

- 表示時間の調整：コードの時刻は「設計の時刻」。`geo.ts` の `EDITS` で、場面ごとに間を足す・移動を詰める（`T()` で実際の時刻に直る）
- 読む時間の点検：`npx tsx capture/timing-audit.ts`（各文字のかたまりが見えている秒数と、読むのに要る秒数の目安を並べる）

- 構成：`src/film/geo.ts`（駅の位置・線の形と進み方・カメラ）、`Line.tsx`（線）、`Stations.tsx`・`PhoneStation.tsx`（場面）、`Sound.tsx`（BGM・効果音）、`Film.tsx`（全体）
- 素材：`capture/motion_assets.cjs` で、地図の後に残す最後のコマ（`public/motion/route_last.jpg`）を用意する。基本機能の止め絵（`select_start.jpg` など）も収録のコマから取る。音声は `public/audio/`（Lyria 3.5 生成の BGM ＋ `@remotion/sfx`・Kenney Interface Sounds の CC0 効果音）を使用
- 書き出し：`npx remotion render Film out/film.mp4 --codec=h264 --crf=18`

## 手元で細かく直す

```bash
cd promo-video
npm install                # 初回だけ
npx remotion studio        # ブラウザで Film を開き、コマを送りながら確かめる（保存すると即反映）
npx remotion render Film out/film.mp4 --codec=h264 --crf=18   # 書き出し（out/ は Git に入らない）
```

| 直したいもの | ファイル | 場所の目印 |
|---|---|---|
| 開場の見出し | `src/film/Stations.tsx` | `{ text: "使いやすい", y: 222 }` の並び |
| いつもの表 → スマホ | `src/film/Stations.tsx` | `PdfTexts` |
| いいところの 3 枚のカード | `src/film/Stations.tsx` | `この 3 つが、いいところ。` の下の配列（`head` が本文・`tag` が札） |
| 基本機能（選ぶ・絞る・共有） | `src/film/PhoneStation.tsx` | `BASICS`（説明の 2 行）、`BasicTexts`、`BASIC_TEXT_X` / `BASIC_TEXT_Y`（位置） |
| 地図・屋外の字幕と OSM の注記 | `src/film/PhoneStation.tsx` | `MapCaption` |
| スキマ提案 | `src/film/PhoneStation.tsx` | `GapTexts` |
| ＋1 | `src/film/Stations.tsx` | `PlusTexts` |
| スプシ（設定は、…） | `src/film/Stations.tsx` | `SheetTexts` |
| ゴール（MIT・無料・DM） | `src/film/Stations.tsx` | `OFFERS`・`Cta` |
| 終わりの見出し | `src/film/Film.tsx` | `SlideChars text="使いやすいイベントタイムテーブル、"` |
| 場面ごとの長さ（間） | `src/film/geo.ts` | `EDITS`（正の数で間を足す・負の数で詰める。単位はコマ＝1/30 秒） |

- 文字の位置は世界座標（`abs(x, y)`）。カメラの倍率が 1.0 の場面では、画面上の px と同じ大きさで映る
- 文言を長くしたら、`capture/timing-audit.ts` で読む時間を確かめる
- **新しい文字を使ったら、フォントを作り直す**：`python3 capture/fetch_fonts.py`（`public/fonts/` は動画で使う文字だけを入れたフォント。入っていない文字は別のフォントで描かれ、太さや形が周りとずれる）

## 表現のルール
- 実機の画面は、すべて実際のアプリ（`?mock=1` のサンプル公演）を実際に操作して収録したもの。架空の機能は描かない。
- 見どころ（要点の 3 枚）に書いていないことは描かない（モーション版では、フォーム取込・着せ替え・利用レポートの場面を外した）。
- スプレッドシートの列名・メニュー名・利用レポートの項目名は `scripts/gas/Code.js` の実物どおり。レポートの数値だけはイメージ（画面に明記）。
- 「無料」は MIT ライセンスの説明としてだけ書く（導入も改良も無料）。売り込みの言い方はしない。窓口は投稿したアカウントの DM。

## 作り直し方

```bash
# 1) アプリを起動（リポジトリ直下）
npx vite --port 5179 --strictPort

# 2) 実機素材の収録（時間を止めて 1 コマずつ 3 倍解像度で撮る。1 本 30〜60 秒）
node promo-video/capture/record.cjs            # 全部
node promo-video/capture/record.cjs select gap # 一部だけ
node promo-video/capture/themes.cjs            # 着せ替え用の静止画

# 3) 文言を変えたら、フォントのサブセットを取り直す
cd promo-video && python3 capture/fetch_fonts.py

# 4) プレビュー・書き出し
npx remotion studio
npx remotion render PromoVideo out/promo.mp4 --codec=h264 --crf=18
```

### 収録の仕組み（`capture/record.cjs`）
ヘッドレス Chromium の画面配信（screencast）は端末のピクセル密度を反映せず 390px 幅になるため使わない。
`page.clock` で JS の時間を止め、CSS アニメーションは `Animation.setPlaybackRate(0)` ＋ `getAnimations()` の
`currentTime` 送りで 1 コマ（1/30 秒）ずつ進め、毎コマ 3 倍解像度のスクリーンショットを撮って ffmpeg でつなぐ。

### 書き出し環境
`remotion.config.ts` は、クラウドの作業環境（`/opt/pw-browsers/` がある所）でだけ Playwright 同梱のヘッドレス Chromium を使う。手元の PC では Remotion がふつうにブラウザを用意する。
日本語フォントは全分割を読むと時間切れになるため、`public/fonts/` の文字サブセットを使う。

## ライセンス
Remotion は個人・3 人以下のチームなら無料ライセンスで利用できる（https://www.remotion.dev/docs/license/faq ）。
