import { REACT_ELEMENT } from "./constants/index";
/**
 * 将JSX转换为reactElement
 * @param {*} type typeof FC 为 function
 * @param {*} config
 * @param  {...any} children children应该是类似插槽
 */
function createElement(type, config, ...children) {
  let key = null;
  let ref = null;
  let props = {};

  // 处理props
  if (config) {
    key = config.key || null;
    ref = config.ref || null;
    Reflect.deleteProperty(config, key);
    Reflect.deleteProperty(config, ref);
    // 源码中需要对属性进行合法性校验以及拷贝 略
    props = config;
  }

  // 处理 children
  if (children.length > 0) {
    if (children.length === 1) {
      props.children = children[0];
    } else {
      props.children = children;
    }
  }

  return {
    $$typeof: REACT_ELEMENT,
    type,
    key,
    ref,
    props,
  };
}

export default { createElement };
