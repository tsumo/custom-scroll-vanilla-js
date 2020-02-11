"use strict";

const content = document.querySelector(".content");

const scroll = document.querySelector(".scroll");

let contentHeight = 0;
let windowHeight = 0;

let scrollSizePercent = 0;
let scrollSizePx = 0;

let scrollPosPercent = 0;
let scrollPosPx = 0;

let scrollDragOffsetPx = 0;

let wheelScrollStep = 25;
let arrowKeyScrollStep = 12.5;
let pageKeyScrollCoef = 0.9;

const clampScroll = n => Math.min(windowHeight - scrollSizePx, Math.max(0, n));

const moveScroll = newScrollPosPx => {
  const clampedPosPx = clampScroll(newScrollPosPx);
  scrollPosPercent = clampedPosPx / (windowHeight - scrollSizePx);
  scroll.style.top = `${clampedPosPx}px`;
  scrollPosPx = clampedPosPx;
  // Adjust content
  const contentOffset = scrollPosPercent * (contentHeight - windowHeight);
  content.style.transform = `translateY(-${contentOffset}px)`;
};

const resizeListener = () => {
  contentHeight = content.getBoundingClientRect().height;
  windowHeight = window.innerHeight;
  // Scroll size cannot be more than 1
  scrollSizePercent = Math.min(1, 1 / (contentHeight / windowHeight));
  scrollSizePx = windowHeight * scrollSizePercent;
  scroll.style.height = `${scrollSizePx}px`;
  // Readjust scroll position
  moveScroll(scrollPosPx);
};
resizeListener();

window.addEventListener("resize", resizeListener);

const dragStart = e => {
  scrollDragOffsetPx = e.layerY;
  document.addEventListener("mousemove", dragging);
  document.addEventListener("mouseup", dragEnd, { once: true });
};

const dragging = e => {
  const newScrollPosPx = e.clientY - scrollDragOffsetPx;
  moveScroll(newScrollPosPx);
};

const dragEnd = () => {
  scrollDragOffsetPx = 0;
  document.removeEventListener("mousemove", dragging);
};

scroll.addEventListener("mousedown", dragStart);

const wheelListener = e => {
  const direction = Math.sign(e.deltaY);
  const newScrollPosPx = scrollPosPx + direction * wheelScrollStep;
  moveScroll(newScrollPosPx);
};

document.addEventListener("wheel", wheelListener);

const keydownListener = e => {
  let newScrollPosPx = scrollPosPx;
  switch (event.key) {
    case "Up":
    case "ArrowUp":
      newScrollPosPx -= arrowKeyScrollStep;
      break;
    case "Down":
    case "ArrowDown":
      newScrollPosPx += arrowKeyScrollStep;
      break;
    case "PageUp":
      newScrollPosPx -= scrollSizePx * pageKeyScrollCoef;
      break;
    case "PageDown":
      newScrollPosPx += scrollSizePx * pageKeyScrollCoef;
      break;
  }
  moveScroll(newScrollPosPx);
};

window.addEventListener("keydown", keydownListener);
