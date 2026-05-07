import {
  AuslanHandedness,
  AuslanHandType,
  AuslanResultKind,
  AuslanSmoothnessFactor,
  KeyInterval,
  type AuslanKeyIntervals,
  type AuslanModelInfo,
  type AuslanRenderingConfig,
  type AuslanSignToken,
  type AuslanTrackConfig,
} from "auslan-spell";
import { fetch_max_sf_dictionary } from "../max-sf-dictionary";

const session_2_realistic_intervals: AuslanKeyIntervals = {
  a: KeyInterval.keyIntervalFromFrames(29, 29),
  b: KeyInterval.keyIntervalFromFrames(35, 35),
  c: KeyInterval.keyIntervalFromFrames(29, 39),
  d: KeyInterval.keyIntervalFromFrames(33, 33),
  e: KeyInterval.keyIntervalFromFrames(30, 30),
  f: KeyInterval.keyIntervalFromFrames(31, 31),
  g: KeyInterval.keyIntervalFromFrames(49, 54),
  h: KeyInterval.keyIntervalFromFrames(38, 70),
  i: KeyInterval.keyIntervalFromFrames(30, 30),
  j: KeyInterval.keyIntervalFromFrames(38, 68),
  k: KeyInterval.keyIntervalFromFrames(30, 30),
  l: KeyInterval.keyIntervalFromFrames(39, 39),
  m: KeyInterval.keyIntervalFromFrames(28, 31),
  n: KeyInterval.keyIntervalFromFrames(33, 33),
  o: KeyInterval.keyIntervalFromFrames(30, 30),
  p: KeyInterval.keyIntervalFromFrames(41, 41),
  q: KeyInterval.keyIntervalFromFrames(44, 44),
  r: KeyInterval.keyIntervalFromFrames(35, 40),
  s: KeyInterval.keyIntervalFromFrames(52, 59),
  t: KeyInterval.keyIntervalFromFrames(30, 30),
  u: KeyInterval.keyIntervalFromFrames(30, 30),
  v: KeyInterval.keyIntervalFromFrames(30, 30),
  w: KeyInterval.keyIntervalFromFrames(59, 59),
  x: KeyInterval.keyIntervalFromFrames(29, 29),
  y: KeyInterval.keyIntervalFromFrames(30, 30),
  z: KeyInterval.keyIntervalFromFrames(30, 30),
};

// TODO: Change the smoothness factor to 1 once collision avoidance is re-implemented.
const smoothnessFactorResult = AuslanSmoothnessFactor.create(0.5);
if (smoothnessFactorResult.kind == AuslanResultKind.Failure) {
  throw new Error("Invalid smoothness factor");
}

const meta: AuslanModelInfo = {
  id: "MODEL_1",
  name: "Right Handed",
  filepath: "/models/session2_realistic.glb",
  hand: AuslanHandedness.Right,
  type: AuslanHandType.Realistic,
};

const config: AuslanRenderingConfig & AuslanTrackConfig<AuslanSignToken> = {
  hasEmbeddedTexture: true,
  smoothnessFactor: smoothnessFactorResult.value,
  keyIntervals: session_2_realistic_intervals,
  tokenToAnimationName: (token) => `${token.toUpperCase()}-session2_realistic`,
  maxSfDictionary: await fetch_max_sf_dictionary(
    "/maxsfdicts/session2-realistic.json",
  ),
};

export type AuslanModel = AuslanModelInfo &
  AuslanRenderingConfig &
  AuslanTrackConfig<AuslanSignToken>;

export const SESSION_2_REALISTIC: AuslanModel = {
  ...meta,
  ...config,
};
