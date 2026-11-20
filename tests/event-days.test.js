// node --test tests/event-days.test.js
import test from 'node:test';
import assert from 'node:assert/strict';
import { eventDayToday, parseStartDate } from '../src/core/EventDays.js';

const at = (y, m, d, h = 9) => new Date(y, m - 1, d, h);

test('開催日の書き方いろいろから最初の日を読む', () => {
  for (const s of ['2026.11.14-11.15', '20261114', '2026/11/14', '2026-11-14', '2026年11月14日（土）']) {
    const d = parseStartDate(s);
    assert.ok(d, s);
    assert.deepEqual([d.getFullYear(), d.getMonth() + 1, d.getDate()], [2026, 11, 14], s);
  }
  assert.equal(parseStartDate(''), null);
  assert.equal(parseStartDate('未定'), null);
  assert.equal(parseStartDate('2026.13.40'), null);
});

test('日のラベルに月日があればそれで、無ければ開催日から続く日で、今日が何日目かを返す', () => {
  const withLabels = { raw: { '開催日(YYYYMMDD)': '2026.11.14-11.15' }, numDays: 2, dayLabels: ['11/14(土)', '11/15(日)', 'Day 3'] };
  assert.equal(eventDayToday(withLabels, at(2026, 11, 14)), 1);
  assert.equal(eventDayToday(withLabels, at(2026, 11, 15, 23)), 2);
  assert.equal(eventDayToday(withLabels, at(2026, 11, 13)), 0);
  assert.equal(eventDayToday(withLabels, at(2026, 11, 16)), 0);
  assert.equal(eventDayToday(withLabels, at(2027, 11, 14)), 0, '別の年は開催日ではない');

  // ラベルが「Day 1」のように月日でないときは、開催日から続く日
  const noLabels = { raw: { '開催日(YYYYMMDD)': '20261130' }, numDays: 2, dayLabels: ['Day 1', 'Day 2'] };
  assert.equal(eventDayToday(noLabels, at(2026, 12, 1)), 2, '月をまたぐ 2 日目');

  // 飛び飛びの開催日（ラベルが優先）
  const apart = { raw: { '開催日(YYYYMMDD)': '2026.11.14' }, numDays: 2, dayLabels: ['11/14(土)', '11/21(土)'] };
  assert.equal(eventDayToday(apart, at(2026, 11, 21)), 2);
  assert.equal(eventDayToday(apart, at(2026, 11, 15)), 0);

  // 設定が無い・読めないときは 0
  assert.equal(eventDayToday(null), 0);
  assert.equal(eventDayToday({ raw: { '開催日(YYYYMMDD)': '未定' }, numDays: 1, dayLabels: ['Day 1'] }, at(2026, 11, 14)), 0);
});
