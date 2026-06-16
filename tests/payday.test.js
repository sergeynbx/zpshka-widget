import test from "node:test";
import assert from "node:assert/strict";
import {
  findNextPayday,
  getPaydayCandidates,
  getTodayIsoInMoscow,
  getWidgetState,
  getWeekendPaydayPhrase,
  moveToPreviousWorkingDay,
  parsePaydays,
  pluralizeDay,
} from "../src/payday.js";

test("default paydays move June 20, 2026 from Saturday to Friday", () => {
  const next = findNextPayday("2026-06-16", parsePaydays(null));

  assert.equal(next.plannedIso, "2026-06-20");
  assert.equal(next.actualIso, "2026-06-19");
  assert.equal(next.daysLeft, 3);
});

test("payday today shows zero days left", () => {
  const state = getWidgetState("?paydays=17&today=2026-06-17");

  assert.equal(state.actualIso, "2026-06-17");
  assert.equal(state.daysLeft, 0);
  assert.equal(state.copy.status, "День денег");
  assert.equal(state.copy.count, "Сегодня");
  assert.equal(state.copy.phrase, "ЗПшка капнет");
});

test("payday today before a non-working day uses a short joke", () => {
  const state = getWidgetState("?today=2026-06-19");

  assert.equal(state.actualIso, "2026-06-19");
  assert.equal(state.daysLeft, 0);
  assert.equal(state.copy.phrase, getWeekendPaydayPhrase("2026-06-19"));
  assert.notEqual(state.copy.phrase, "ЗПшка капнет");
});

test("passed weekend payday is skipped after it was paid earlier", () => {
  const next = findNextPayday("2026-06-20", [5, 20]);

  assert.equal(next.plannedIso, "2026-07-05");
  assert.equal(next.actualIso, "2026-07-03");
  assert.equal(next.daysLeft, 13);
});

test("custom paydays from query are used", () => {
  const state = getWidgetState("?paydays=2,15,17&today=2026-06-16");

  assert.deepEqual(state.paydays, [2, 15, 17]);
  assert.equal(state.plannedIso, "2026-06-17");
  assert.equal(state.actualIso, "2026-06-17");
  assert.equal(state.daysLeft, 1);
});

test("singular payday query alias is accepted", () => {
  const state = getWidgetState("?payday=3,17&today=2026-06-16");

  assert.deepEqual(state.paydays, [3, 17]);
  assert.equal(state.actualIso, "2026-06-17");
});

test("Sunday payday moves to the previous Friday", () => {
  const next = findNextPayday("2026-07-01", [5]);

  assert.equal(next.plannedIso, "2026-07-05");
  assert.equal(next.actualIso, "2026-07-03");
});

test("long January holidays move payday back before the break", () => {
  const next = findNextPayday("2026-12-30", [5]);

  assert.equal(next.plannedIso, "2027-01-05");
  assert.equal(next.actualIso, "2026-12-31");
  assert.equal(next.daysLeft, 1);
});

test("duplicate adjusted paydays collapse to one actual date", () => {
  const candidates = getPaydayCandidates("2027-04-29", [1, 2, 3], 1);

  assert.equal(candidates[0].actualIso, "2027-04-30");
  assert.equal(candidates.filter((candidate) => candidate.actualIso === "2027-04-30").length, 1);
});

test("invalid paydays fall back to defaults", () => {
  assert.deepEqual(parsePaydays("abc,0,32"), [5, 20]);
});

test("payday parser keeps valid numbers and sorts unique values", () => {
  assert.deepEqual(parsePaydays("20,5,5, 2, nope"), [2, 5, 20]);
});

test("Moscow date is used for the current day", () => {
  const now = new Date("2026-06-16T21:30:00.000Z");

  assert.equal(getTodayIsoInMoscow(now), "2026-06-17");
});

test("plural forms are Russian-friendly", () => {
  assert.equal(pluralizeDay(1), "день");
  assert.equal(pluralizeDay(2), "дня");
  assert.equal(pluralizeDay(5), "дней");
  assert.equal(pluralizeDay(11), "дней");
});

test("explicit holiday moves to previous working day", () => {
  assert.equal(moveToPreviousWorkingDay("2026-11-04"), "2026-11-03");
});
