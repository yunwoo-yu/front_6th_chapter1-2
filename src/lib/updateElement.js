import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";

function updateAttributes(target, newProps, oldProps) {
  // newProps, oldProps가 없을경우 빈 객체로 초기화
  const safeNewProps = newProps || {};
  const safeOldProps = oldProps || {};

  Object.keys(safeOldProps).forEach((key) => {
    if (!(key in safeNewProps)) {
      if (key.startsWith("on")) {
        const eventType = key.slice(2).toLowerCase();

        removeEvent(target, eventType, oldProps[key]);
      } else if (key === "className") {
        target.removeAttribute("class");
      } else if (key === "style") {
        target.style = {};
      } else if (oldProps[key] === true) {
        delete target[key];
      } else if (oldProps[key] === false) {
        delete target[key];
      } else {
        target.removeAttribute(key);
      }
    }
  });

  // 새 속성 추가/업데이트
  if (newProps) {
    Object.keys(newProps).forEach((key) => {
      if (key.startsWith("on")) {
        const eventType = key.slice(2).toLowerCase();

        if (oldProps[key]) {
          removeEvent(target, eventType, oldProps[key]);
        }

        if (typeof safeNewProps[key] === "function") {
          addEvent(target, eventType, safeNewProps[key]);
        }
      } else if (key === "className") {
        target.setAttribute("class", newProps[key]);
      } else if (key === "style") {
        Object.assign(target.style, newProps[key]);
      } else if (newProps[key] === true) {
        target[key] = true;
      } else if (newProps[key] === false) {
        target[key] = false;
      } else {
        target.setAttribute(key, newProps[key]);
      }
    });
  }
}

export function updateElement(parentElement, newNode, oldNode, index = 0) {
  const currentElement = parentElement.childNodes[index];

  // 기존 노드가 있는데 새 노드가 없으면 제거
  if (oldNode && !newNode) {
    parentElement.removeChild(currentElement);
    return;
  }

  // 기존 노드가 없는데 새 노드가 있으면 생성해서 추가
  if (!oldNode && newNode) {
    parentElement.appendChild(createElement(newNode));
    return;
  }

  // 둘 다 텍스트/숫자 노드인 경우 textContent 업데이트
  if (
    (typeof newNode === "string" || typeof newNode === "number") &&
    (typeof oldNode === "string" || typeof oldNode === "number")
  ) {
    if (newNode !== oldNode) {
      currentElement.textContent = newNode;
    }
    return;
  }

  // Element의 타입이 다르면 교체
  if (typeof newNode !== typeof oldNode || newNode.type !== oldNode.type) {
    parentElement.replaceChild(createElement(newNode), currentElement);
    return;
  }

  // 업데이트 실행
  updateAttributes(currentElement, newNode.props, oldNode.props);

  // 자식 노드들 처리하기
  const newChildren = newNode.children || [];
  const oldChildren = oldNode.children || [];

  const minLength = Math.min(newChildren.length, oldChildren.length);

  // 먼저 겹치는 인덱스 요소까지 업데이트하기
  for (let i = 0; i < minLength; i++) {
    updateElement(currentElement, newChildren[i], oldChildren[i], i);
  }

  // 이후 newChildren이 length가 더 길면 추가
  if (newChildren.length > oldChildren.length) {
    for (let i = oldChildren.length; i < newChildren.length; i++) {
      updateElement(currentElement, newChildren[i], oldChildren[i], i);
    }
  }

  // 만약 oldChildren이 newChildren보다 많으면 뒤에서부터 제거
  else if (oldChildren.length > newChildren.length) {
    for (let i = oldChildren.length - 1; i >= newChildren.length; i--) {
      updateElement(currentElement, newChildren[i], oldChildren[i], i);
    }
  }
}
