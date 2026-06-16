import { getWidgetState } from "./payday.js";
import { parseTheme } from "./theme.js";

const elements = {
  widget: document.querySelector("#widget"),
  front: document.querySelector(".face-front"),
  back: document.querySelector(".face-back"),
  status: document.querySelector("#status"),
  count: document.querySelector("#count"),
  unit: document.querySelector("#unit"),
  phrase: document.querySelector("#phrase"),
  dateLabel: document.querySelector("#date-label"),
};

function setText(element, value) {
  if (element) {
    element.textContent = value;
  }
}

function applyTheme() {
  const params = new URLSearchParams(window.location.search);
  const theme = parseTheme(params.get("theme"));

  if (theme) {
    document.documentElement.dataset.theme = theme;
    return;
  }

  delete document.documentElement.dataset.theme;
}

function setFlipped(isFlipped) {
  elements.widget?.classList.toggle("is-flipped", isFlipped);
  elements.widget?.setAttribute("aria-pressed", String(isFlipped));
  elements.front?.setAttribute("aria-hidden", String(isFlipped));
  elements.back?.setAttribute("aria-hidden", String(!isFlipped));
}

function toggleFlipped() {
  setFlipped(!elements.widget?.classList.contains("is-flipped"));
}

function render() {
  try {
    const state = getWidgetState(window.location.search);
    const { copy } = state;

    elements.widget?.classList.toggle("is-today", copy.isToday);
    setText(elements.status, copy.status);
    setText(elements.count, copy.count);
    setText(elements.unit, copy.unit);
    setText(elements.phrase, copy.phrase);
    setText(elements.dateLabel, copy.dateLabel);
  } catch (error) {
    elements.widget?.classList.remove("is-today");
    setText(elements.status, "Что-то пошло не так");
    setText(elements.count, "...");
    setText(elements.unit, "");
    setText(elements.phrase, "Проверь параметры виджета");
    setText(elements.dateLabel, error instanceof Error ? error.message : "Неизвестная ошибка");
  }
}

document.body.addEventListener("click", toggleFlipped);
document.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }

  if (document.activeElement !== elements.widget && document.activeElement !== document.body) {
    return;
  }

  event.preventDefault();
  toggleFlipped();
});

applyTheme();
setFlipped(false);
render();
