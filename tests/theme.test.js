import test from "node:test";
import assert from "node:assert/strict";
import { parseTheme } from "../src/theme.js";

test("theme query supports explicit light and dark values", () => {
  assert.equal(parseTheme("light"), "light");
  assert.equal(parseTheme("dark"), "dark");
  assert.equal(parseTheme(" DARK "), "dark");
});

test("theme query falls back to system for unknown values", () => {
  assert.equal(parseTheme(null), null);
  assert.equal(parseTheme("system"), null);
  assert.equal(parseTheme("auto"), null);
  assert.equal(parseTheme("pink"), null);
});
