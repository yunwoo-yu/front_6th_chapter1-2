export function createVNode(type, props, ...children) {
  const vNode = {
    type: type,
    props,
    children: children.flat(Infinity).filter((node) => node !== null && node !== undefined && node !== false),
  };

  return vNode;
}
