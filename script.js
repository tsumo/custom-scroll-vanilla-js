"use strict";

const content = document.querySelector(".content");

const scroll = document.querySelector(".scroll");

const infoTable = document.querySelector(".info");

let contentHeight = 0;
let windowHeight = 0;

let sizePercent = 0;
let sizePx = 0;

let posPercent = 0;
let posPx = 0;

let currentContentOffset = 0;
let targetContentOffset = 0;

let dragOffsetPx = 0;

let wheelScrollStep = 25;
let arrowKeyScrollStep = 12.5;
let pageKeyScrollCoef = 0.9;

const updateInfoTable = () => {
  infoTable.innerHTML = `
  <tr><td>contentHeight</td><td>${contentHeight}</td></tr>
  <tr><td>windowHeight</td><td>${windowHeight}</td></tr>
  <tr><td>sizePercent</td><td>${sizePercent}</td></tr>
  <tr><td>sizePx</td><td>${sizePx}</td></tr>
  <tr><td>posPercent</td><td>${posPercent}</td></tr>
  <tr><td>posPx</td><td>${posPx}</td></tr>
  <tr><td>currentContentOffset</td><td>${currentContentOffset}</td></tr>
  <tr><td>targetContentOffset</td><td>${targetContentOffset}</td></tr>
  `;
};

const lerp = (v0, v1, t) => {
  return v0 * (1 - t) + v1 * t;
};

const clampScrollPos = (pos) =>
  Math.min(windowHeight - sizePx, Math.max(0, pos));

const moveScroll = (newPosPx) => {
  const clampedPosPx = clampScrollPos(newPosPx);
  posPercent = clampedPosPx / (windowHeight - sizePx);
  scroll.style.top = `${clampedPosPx}px`;
  posPx = clampedPosPx;
  // Adjust content
  targetContentOffset = (posPercent * (contentHeight - windowHeight)).toFixed(
    2
  );
};

const updateContentOffset = () => {
  currentContentOffset = lerp(
    currentContentOffset,
    targetContentOffset,
    0.1
  ).toFixed(2);
  content.style.transform = `translateY(-${currentContentOffset}px)`;
  updateInfoTable();
  window.requestAnimationFrame(updateContentOffset);
};
updateContentOffset();

const resizeListener = () => {
  contentHeight = content.getBoundingClientRect().height;
  windowHeight = window.innerHeight;
  // Scroll size cannot be more than 1
  sizePercent = Math.min(1, 1 / (contentHeight / windowHeight));
  sizePx = windowHeight * sizePercent;
  scroll.style.height = `${sizePx}px`;
  // Readjust scroll position
  moveScroll(posPx);
};
resizeListener();

window.addEventListener("resize", resizeListener);

const dragStart = (e) => {
  dragOffsetPx = e.clientY - posPx;
  document.addEventListener("mousemove", dragging);
  document.addEventListener("mouseup", dragEnd, { once: true });
};

const dragging = (e) => {
  const newPosPx = e.clientY - dragOffsetPx;
  moveScroll(newPosPx);
};

const dragEnd = () => {
  dragOffsetPx = 0;
  document.removeEventListener("mousemove", dragging);
};

scroll.addEventListener("mousedown", dragStart);

const wheelListener = (e) => {
  const direction = Math.sign(e.deltaY);
  const newPosPx = posPx + direction * wheelScrollStep;
  moveScroll(newPosPx);
};

document.addEventListener("wheel", wheelListener);

const keydownListener = (e) => {
  let newPosPx = posPx;
  switch (e.key) {
    case "Up":
    case "ArrowUp":
      newPosPx -= arrowKeyScrollStep;
      break;
    case "Down":
    case "ArrowDown":
      newPosPx += arrowKeyScrollStep;
      break;
    case "PageUp":
      newPosPx -= sizePx * pageKeyScrollCoef;
      break;
    case "PageDown":
      newPosPx += sizePx * pageKeyScrollCoef;
      break;
  }
  moveScroll(newPosPx);
};

window.addEventListener("keydown", keydownListener);
