export const DEFAULT_PAYDAYS = Object.freeze([5, 20]);
export const MOSCOW_TIME_ZONE = "Europe/Moscow";

export const NON_WORKING_DATES = Object.freeze([
  "2026-06-06",
  "2026-06-07",
  "2026-06-12",
  "2026-06-13",
  "2026-06-14",
  "2026-06-20",
  "2026-06-21",
  "2026-06-27",
  "2026-06-28",
  "2026-07-04",
  "2026-07-05",
  "2026-07-11",
  "2026-07-12",
  "2026-07-18",
  "2026-07-19",
  "2026-07-25",
  "2026-07-26",
  "2026-08-01",
  "2026-08-02",
  "2026-08-08",
  "2026-08-09",
  "2026-08-15",
  "2026-08-16",
  "2026-08-22",
  "2026-08-23",
  "2026-08-29",
  "2026-08-30",
  "2026-09-05",
  "2026-09-06",
  "2026-09-12",
  "2026-09-13",
  "2026-09-19",
  "2026-09-20",
  "2026-09-26",
  "2026-09-27",
  "2026-10-03",
  "2026-10-04",
  "2026-10-10",
  "2026-10-11",
  "2026-10-17",
  "2026-10-18",
  "2026-10-24",
  "2026-10-25",
  "2026-10-31",
  "2026-11-01",
  "2026-11-04",
  "2026-11-07",
  "2026-11-08",
  "2026-11-14",
  "2026-11-15",
  "2026-11-21",
  "2026-11-22",
  "2026-11-28",
  "2026-11-29",
  "2026-12-05",
  "2026-12-06",
  "2026-12-12",
  "2026-12-13",
  "2026-12-19",
  "2026-12-20",
  "2026-12-26",
  "2026-12-27",
  "2027-01-01",
  "2027-01-02",
  "2027-01-03",
  "2027-01-04",
  "2027-01-05",
  "2027-01-06",
  "2027-01-07",
  "2027-01-08",
  "2027-01-09",
  "2027-01-10",
  "2027-01-16",
  "2027-01-17",
  "2027-01-23",
  "2027-01-24",
  "2027-01-30",
  "2027-01-31",
  "2027-02-06",
  "2027-02-07",
  "2027-02-13",
  "2027-02-14",
  "2027-02-20",
  "2027-02-21",
  "2027-02-23",
  "2027-02-27",
  "2027-02-28",
  "2027-03-06",
  "2027-03-07",
  "2027-03-08",
  "2027-03-13",
  "2027-03-14",
  "2027-03-20",
  "2027-03-21",
  "2027-03-27",
  "2027-03-28",
  "2027-04-03",
  "2027-04-04",
  "2027-04-10",
  "2027-04-11",
  "2027-04-17",
  "2027-04-18",
  "2027-04-24",
  "2027-04-25",
  "2027-05-01",
  "2027-05-02",
  "2027-05-03",
  "2027-05-08",
  "2027-05-09",
  "2027-05-10",
  "2027-05-15",
  "2027-05-16",
  "2027-05-22",
  "2027-05-23",
  "2027-05-29",
  "2027-05-30",
  "2027-06-05",
  "2027-06-06",
  "2027-06-12",
  "2027-06-13",
  "2027-06-14",
  "2027-06-19",
  "2027-06-20",
  "2027-06-26",
  "2027-06-27",
]);

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const NON_WORKING_SET = new Set(NON_WORKING_DATES);
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const WEEKEND_PAYDAY_PHRASES = Object.freeze([
  "ЗП сегодня. Завтра выходной. Хм",
  "Сегодня ЗП. Завтра выходной. Совпадение",
  "ЗП капнула. Выходной подмигнул",
  "Деньги сегодня, отдых завтра",
  "ЗП сегодня. Завтра можно красиво молчать",
  "Карта заряжена. Завтра выходной",
  "Сегодня ЗП. Завтра без будильника",
  "Бюджет пополнен. Выходной рядом",
]);

export function parseIsoDate(iso) {
  if (!ISO_DATE_RE.test(iso)) {
    throw new Error(`Invalid ISO date: ${iso}`);
  }

  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  const normalized = toIsoDate(date);

  if (normalized !== iso) {
    throw new Error(`Invalid calendar date: ${iso}`);
  }

  return { year, month, day };
}

export function toIsoDate(date) {
  return date.toISOString().slice(0, 10);
}

export function makeIsoDate(year, month, day) {
  const date = new Date(Date.UTC(year, month - 1, day));
  return toIsoDate(date);
}

export function getTodayIsoInMoscow(now = new Date()) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: MOSCOW_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = Object.fromEntries(formatter.formatToParts(now).map((part) => [part.type, part.value]));

  return `${parts.year}-${parts.month}-${parts.day}`;
}

export function parsePaydays(rawPaydays) {
  if (!rawPaydays) {
    return [...DEFAULT_PAYDAYS];
  }

  const paydays = rawPaydays
    .split(",")
    .map((item) => item.trim())
    .filter((item) => /^\d{1,2}$/.test(item))
    .map(Number)
    .filter((day) => day >= 1 && day <= 31);

  const unique = [...new Set(paydays)].sort((a, b) => a - b);

  return unique.length > 0 ? unique : [...DEFAULT_PAYDAYS];
}

export function getDaysInMonth(year, month) {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export function addDays(iso, delta) {
  const { year, month, day } = parseIsoDate(iso);
  const date = new Date(Date.UTC(year, month - 1, day + delta));
  return toIsoDate(date);
}

export function getDayIndex(iso) {
  const { year, month, day } = parseIsoDate(iso);
  return Math.floor(Date.UTC(year, month - 1, day) / MS_PER_DAY);
}

export function daysBetween(startIso, endIso) {
  return getDayIndex(endIso) - getDayIndex(startIso);
}

export function isWeekend(iso) {
  const { year, month, day } = parseIsoDate(iso);
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();

  return weekday === 0 || weekday === 6;
}

export function isNonWorkingDay(iso) {
  return NON_WORKING_SET.has(iso) || isWeekend(iso);
}

export function moveToPreviousWorkingDay(iso) {
  let candidate = iso;

  while (isNonWorkingDay(candidate)) {
    candidate = addDays(candidate, -1);
  }

  return candidate;
}

export function getPaydayCandidates(todayIso, paydays, monthsAhead = 18) {
  const today = parseIsoDate(todayIso);
  const candidates = [];

  for (let offset = 0; offset <= monthsAhead; offset += 1) {
    const monthIndex = today.year * 12 + (today.month - 1) + offset;
    const year = Math.floor(monthIndex / 12);
    const month = (monthIndex % 12) + 1;
    const maxDay = getDaysInMonth(year, month);

    for (const payday of paydays) {
      if (payday > maxDay) {
        continue;
      }

      const plannedIso = makeIsoDate(year, month, payday);
      const actualIso = moveToPreviousWorkingDay(plannedIso);

      if (daysBetween(todayIso, actualIso) >= 0) {
        candidates.push({ plannedIso, actualIso, payday });
      }
    }
  }

  const byActualDate = new Map();

  for (const candidate of candidates) {
    const existing = byActualDate.get(candidate.actualIso);
    if (!existing || candidate.payday < existing.payday) {
      byActualDate.set(candidate.actualIso, candidate);
    }
  }

  return [...byActualDate.values()].sort((a, b) => getDayIndex(a.actualIso) - getDayIndex(b.actualIso));
}

export function findNextPayday(todayIso, rawPaydays = DEFAULT_PAYDAYS) {
  const paydays = Array.isArray(rawPaydays) ? [...rawPaydays] : parsePaydays(rawPaydays);
  const candidates = getPaydayCandidates(todayIso, paydays);
  const next = candidates[0];

  if (!next) {
    throw new Error("No payday found in the configured range");
  }

  return {
    ...next,
    daysLeft: daysBetween(todayIso, next.actualIso),
    paydays,
    todayIso,
  };
}

export function pluralizeDay(count) {
  const absolute = Math.abs(count);
  const lastTwo = absolute % 100;
  const last = absolute % 10;

  if (lastTwo >= 11 && lastTwo <= 14) {
    return "дней";
  }

  if (last === 1) {
    return "день";
  }

  if (last >= 2 && last <= 4) {
    return "дня";
  }

  return "дней";
}

export function formatRuDate(iso) {
  const { year, month, day } = parseIsoDate(iso);
  return new Intl.DateTimeFormat("ru-RU", {
    timeZone: "UTC",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(Date.UTC(year, month - 1, day, 12)));
}

export function getWeekendPaydayPhrase(iso) {
  const index = getDayIndex(iso) % WEEKEND_PAYDAY_PHRASES.length;
  return WEEKEND_PAYDAY_PHRASES[index];
}

export function buildDisplayCopy(state) {
  const { daysLeft, actualIso } = state;
  const unit = pluralizeDay(daysLeft);
  const isPaydayBeforeNonWorkingDay = daysLeft === 0 && isNonWorkingDay(addDays(actualIso, 1));

  if (daysLeft === 0) {
    return {
      status: "День денег",
      count: "Сегодня",
      unit: "",
      phrase: isPaydayBeforeNonWorkingDay ? getWeekendPaydayPhrase(actualIso) : "ЗПшка капнет",
      dateLabel: formatRuDate(actualIso),
      isToday: true,
    };
  }

  if (daysLeft === 1) {
    return {
      status: "Почти у цели",
      count: "1",
      unit,
      phrase: "ЗПшка уже завтра",
      dateLabel: formatRuDate(actualIso),
      isToday: false,
    };
  }

  if (daysLeft === 2) {
    return {
      status: "Финишная прямая",
      count: "2",
      unit,
      phrase: "Казна уже видна на горизонте",
      dateLabel: formatRuDate(actualIso),
      isToday: false,
    };
  }

  if (daysLeft >= 3 && daysLeft <= 4) {
    return {
      status: "Деньги в пути",
      count: String(daysLeft),
      unit,
      phrase: "Холодильник верит в тебя",
      dateLabel: formatRuDate(actualIso),
      isToday: false,
    };
  }

  return {
    status: "Режим экономии",
    count: String(daysLeft),
    unit,
    phrase: "Экономим без паники",
    dateLabel: formatRuDate(actualIso),
    isToday: false,
  };
}

export function getWidgetState(search = "", now = new Date()) {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const requestedToday = params.get("today");
  const todayIso = requestedToday && ISO_DATE_RE.test(requestedToday) ? requestedToday : getTodayIsoInMoscow(now);
  const paydays = parsePaydays(params.get("paydays") ?? params.get("payday"));
  const payday = findNextPayday(todayIso, paydays);

  return {
    ...payday,
    copy: buildDisplayCopy(payday),
  };
}
