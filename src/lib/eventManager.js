const eventContext = new WeakMap();
const registeredEventTypes = new Set(); // 등록된 이벤트 타입들만 추적 객체저장을 안하기에 참조 추적 없음
let currentRoot = null;

export function setupEventListeners(root) {
  // 기존 리스너들 제거
  if (currentRoot) {
    registeredEventTypes.forEach((eventType) => {
      currentRoot.removeEventListener(eventType, eventDelegationHandler);
    });
  }

  currentRoot = root;

  registeredEventTypes.forEach((eventType) => {
    root.addEventListener(eventType, eventDelegationHandler);
  });
}

export function addEvent(element, eventType, handler) {
  if (!eventContext.has(element)) {
    eventContext.set(element, {});
  }

  const handlers = eventContext.get(element);

  if (!handlers[eventType]) {
    handlers[eventType] = {};
  }

  handlers[eventType][handler.name] = handler;
  registeredEventTypes.add(eventType);
}

export function removeEvent(element, eventType, handler) {
  if (!eventContext.has(element)) {
    return;
  }

  const handlers = eventContext.get(element);

  if (handlers[eventType]) {
    delete handlers[eventType][handler.name];

    if (!Object.keys(handlers[eventType]).length) {
      delete handlers[eventType];
      registeredEventTypes.delete(eventType);
    }

    if (!Object.keys(handlers).length) {
      eventContext.delete(element);
    }
  }
}

export const eventDelegationHandler = (e) => {
  const elementHandlers = eventContext.get(e.target);
  const eventHandlers = elementHandlers?.[e.type];

  if (eventHandlers) {
    Object.values(eventHandlers).forEach((handler) => {
      handler(e);
    });
  }
};
