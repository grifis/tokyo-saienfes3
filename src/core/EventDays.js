/**
 * 今日がフェスの何日目か（開催日でなければ 0）。
 *
 * 読む設定（Parser.normalizeConfig の結果）
 *   - 各日のラベル（dayLabels）に「11/14(土)」のような月日があれば、それを優先する（飛び飛びの開催日にも合う）
 *   - 無ければ、開催日（「2026.11.14-11.15」「20261114」「2026/11/14」「2026年11月14日」など）の最初の日から、
 *     開催日数ぶん続く日とみなす
 * 端末の時計の日付（その土地の日付）で比べる。
 */
const DATE_RE = /(\d{4})\s*[.\/\-年]?\s*(\d{1,2})\s*[.\/\-月]?\s*(\d{1,2})/;
const MD_RE = /(\d{1,2})\s*[\/月]\s*(\d{1,2})/;

const sameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

/** 開催日の文字列から最初の日（Date）。読めなければ null */
export function parseStartDate(raw) {
  const m = String(raw ?? '').match(DATE_RE);
  if (!m) return null;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  const dt = new Date(y, mo - 1, d);
  return dt.getMonth() === mo - 1 ? dt : null;
}

/**
 * @param {{ raw?: object, displayDate?: string, numDays?: number, dayLabels?: string[] }} config
 * @param {Date} [now]
 * @returns {number} 1 から始まる日の番号。開催日でなければ 0
 */
export function eventDayToday(config, now = new Date()) {
  if (!config) return 0;
  const rawDate = (config.raw && (config.raw['開催日(YYYYMMDD)'] || config.raw['開催日'])) || config.displayDate || '';
  const start = parseStartDate(rawDate);
  const numDays = Math.max(1, Number(config.numDays) || 1);
  const labels = Array.isArray(config.dayLabels) ? config.dayLabels : [];
  for (let n = 1; n <= numDays; n++) {
    let day = null;
    const md = String(labels[n - 1] || '').match(MD_RE);
    if (md) {
      const year = start ? start.getFullYear() : now.getFullYear();
      day = new Date(year, Number(md[1]) - 1, Number(md[2]));
    } else if (start) {
      day = new Date(start.getFullYear(), start.getMonth(), start.getDate() + (n - 1));
    }
    if (day && sameDay(day, now)) return n;
  }
  return 0;
}
