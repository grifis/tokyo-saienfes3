import React from "react";
import { Audio } from "@remotion/media";
import { Sequence, interpolate, staticFile } from "remotion";
import { clamp } from "../theme";
import { BASIC_WIN, CLICK, FILM_FRAMES, GAP_CLIP, LOOP_DONE, OUTDOOR_START, T } from "./geo";
import { CARD_AT } from "./Stations";

type SfxCue = {
  file: string;
  from: number;
  volume: number;
  playbackRate?: number;
};

const SFX_CUES: SfxCue[] = [
  // カメラ移動（whoosh）
  { file: "whoosh.wav", from: T(104) + 1, volume: 0.14 },
  { file: "whoosh.wav", from: T(252) + 1, volume: 0.13 },
  { file: "whoosh.wav", from: T(420) + 1, volume: 0.14 },
  { file: "whoosh.wav", from: T(722) + 1, volume: 0.14 },
  { file: "whoosh.wav", from: T(1042) + 1, volume: 0.13 },
  { file: "whoosh.wav", from: T(1211) + 1, volume: 0.15 },
  { file: "whoosh.wav", from: T(1360) + 1, volume: 0.13 },
  { file: "whoosh.wav", from: T(1500) + 1, volume: 0.12 },
  // 最後の全体引き
  { file: "whoosh.wav", from: T(1690), volume: 0.19, playbackRate: 0.78 },

  // いつもの表 → スマホへ組み替わり
  { file: "pageTurn.wav", from: T(204), volume: 0.22 },
  { file: "open_003.wav", from: T(204) + 12, volume: 0.18 },

  // いいところ 3 つ（カードが順に返る）
  { file: "pageTurn.wav", from: CARD_AT[0], volume: 0.2, playbackRate: 0.96 },
  { file: "select_002.wav", from: CARD_AT[0], volume: 0.09 },
  { file: "pageTurn.wav", from: CARD_AT[1], volume: 0.2, playbackRate: 1.0 },
  { file: "select_002.wav", from: CARD_AT[1], volume: 0.09 },
  { file: "pageTurn.wav", from: CARD_AT[2], volume: 0.2, playbackRate: 1.05 },
  { file: "select_002.wav", from: CARD_AT[2], volume: 0.09 },

  // 基本機能（選ぶ・絞る・共有）＋ ダブルブッキング警告
  { file: "switch_002.wav", from: BASIC_WIN[0][0], volume: 0.24 },
  { file: "error_003.wav", from: BASIC_WIN[0][0] + Math.round((4.17 - 2.0) * 30), volume: 0.13 },
  { file: "switch_002.wav", from: BASIC_WIN[1][0], volume: 0.24 },
  { file: "switch_002.wav", from: BASIC_WIN[2][0], volume: 0.24 },

  // 地図（ルートを見る → 屋外へズームアウト）
  { file: "mouseClick.wav", from: T(768), volume: 0.28 },
  { file: "maximize_006.wav", from: OUTDOOR_START, volume: 0.2 },

  // スキマ提案
  { file: "open_001.wav", from: Math.round(GAP_CLIP.start + (3.3 - GAP_CLIP.from) * 30), volume: 0.2 },

  // ＋1 が灯る
  { file: "confirmation_001.wav", from: LOOP_DONE, volume: 0.2 },

  // スプシ（押下 → たたまれ → 公開スマホ立ち上がり）
  { file: "mouseClick.wav", from: CLICK, volume: 0.28 },
  { file: "minimize_004.wav", from: CLICK + 8, volume: 0.17 },
  { file: "maximize_008.wav", from: CLICK + 16, volume: 0.2 },

  // ゴール（ピン到着）
  { file: "drop_002.wav", from: T(1528), volume: 0.25 },

  // 締めの見出し
  { file: "confirmation_002.wav", from: T(1744), volume: 0.2 },
];

/** Film 用の音声トラック（ノーカット AI BGM ＋ キューに同期した CC0 効果音） */
export const FilmSound: React.FC = () => (
  <>
    <Sequence from={2} layout="none">
      <Audio src={staticFile("audio/bgm.mp3")} volume={(f) => interpolate(f, [FILM_FRAMES - 18, FILM_FRAMES - 3], [1, 0], clamp)} />
    </Sequence>
    {SFX_CUES.map((cue, i) => (
      <Sequence key={`${i}-${cue.file}-${cue.from}`} from={cue.from} durationInFrames={36} layout="none">
        <Audio src={staticFile(`audio/sfx/${cue.file}`)} volume={cue.volume} playbackRate={cue.playbackRate} />
      </Sequence>
    ))}
  </>
);
