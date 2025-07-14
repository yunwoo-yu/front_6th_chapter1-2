import { setupEventListeners } from "./eventManager";
import { createElement } from "./createElement";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

const currentNodeMap = new WeakMap();

export function renderElement(vNode, container) {
  const currentNodeTree = currentNodeMap.get(container);
  const progressWorkInNodeTree = normalizeVNode(vNode);

  if (!currentNodeTree) {
    console.log("최초 렌더링 #################");
    container.appendChild(createElement(progressWorkInNodeTree));
  } else {
    console.log("업데이트 실행 #################");
    updateElement(container, progressWorkInNodeTree, currentNodeTree);
    // container.replaceChild(createElement(progressWorkInNodeTree), container.firstChild);
  }

  currentNodeMap.set(container, progressWorkInNodeTree);
  setupEventListeners(container);

  // 최초 렌더링시에는 createElement로 DOM을 생성하고
  // 이후에는 updateElement로 기존 DOM을 업데이트한다.
  // 렌더링이 완료되면 container에 이벤트를 등록한다.
}
