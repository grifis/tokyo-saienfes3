/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { existsSync } from "node:fs";
import { Config } from "@remotion/cli/config";

Config.setRspack(true);
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setDefaultPremountInSeconds(2);

// クラウドの作業環境では、入っている Playwright のヘッドレス Chromium を使う（Remotion 独自のダウンロードができないため）。
// 手元の PC にはこのファイルが無いので何も設定せず、Remotion がふつうにブラウザを用意する
const CLOUD_CHROMIUM = "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
if (existsSync(CLOUD_CHROMIUM)) {
  Config.setBrowserExecutable(CLOUD_CHROMIUM);
  Config.setChromiumOpenGlRenderer("swangle");
}
