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

const moveScroll = n => {
  const scrollOffset = Math.min(
    windowHeight - scrollSizePx,
    Math.max(0, n - scrollDragOffsetPx)
  );
  scrollPosPercent = scrollOffset / (windowHeight - scrollSizePx);
  scroll.style.top = `${scrollOffset}px`;
};

const adjustContent = () => {
  const contentOffset = scrollPosPercent * (contentHeight - windowHeight);
  content.style.transform = `translateY(-${contentOffset}px)`;
};

const resizeListener = () => {
  contentHeight = content.getBoundingClientRect().height;
  windowHeight = window.innerHeight;
  scrollSizePercent = 1 / (contentHeight / windowHeight);
  scrollSizePx = windowHeight * scrollSizePercent;
  scroll.style.height = `${scrollSizePx}px`;
  moveScroll(scrollPosPx);
  adjustContent();
};
resizeListener();

window.addEventListener("resize", resizeListener);

const dragStart = e => {
  scrollDragOffsetPx = e.layerY;
  document.addEventListener("mousemove", dragging);
  document.addEventListener("mouseup", dragEnd, { once: true });
};

const dragging = e => {
  moveScroll(e.clientY);
  adjustContent();
  scrollPosPx = e.clientY;
};

const dragEnd = () => {
  document.removeEventListener("mousemove", dragging);
};

scroll.addEventListener("mousedown", dragStart);
