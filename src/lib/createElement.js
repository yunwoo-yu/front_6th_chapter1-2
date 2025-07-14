import { addEvent } from "./eventManager";

function updateAttributes($el, props) {
  Object.entries(props).forEach(([key, value]) => {
    if (key.startsWith("on") && typeof value === "function") {
      const eventType = key.slice(2).toLowerCase();

      addEvent($el, eventType, value);
    } else if (key === "className") {
      $el.setAttribute("class", value);
    } else if (key === "style") {
      Object.assign($el.style, value);
    } else if (value === true) {
      $el[key] = value;
    } else if (value === false) {
      $el.removeAttribute(key);
    } else {
      $el.setAttribute(key, value);
    }
  });
}

export function createElement(vNode) {
  if (vNode === undefined || vNode === null || typeof vNode === "boolean") {
    return document.createTextNode("");
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return document.createTextNode(vNode);
  }

  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();

    vNode.forEach((child) => {
      fragment.appendChild(createElement(child));
    });

    return fragment;
  }

  const $element = document.createElement(vNode.type);

  if (vNode.props) {
    updateAttributes($element, vNode.props);
  }

  $element.append(...vNode.children.map((child) => createElement(child)));

  return $element;
}
