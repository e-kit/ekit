import { Middleware } from 'redux';
import {
  EFFECTS_PROMISE_RESOLVE,
  EFFECTS_PROMISE_REJECT,
  TKIT_EFFECT,
  noop,
  TKIT_DISPATCH,
  TKIT_GET_STATE
} from '@ekit/model-factory';

/** promise redux 中间件 */
export const promiseMiddleware: Middleware = ({ dispatch, getState }) => next => action => {
  // 私有协议
  if (TKIT_EFFECT in action) {
    const prom = new Promise((resolve, reject) => {
      next({
        [EFFECTS_PROMISE_RESOLVE]: resolve,
        [EFFECTS_PROMISE_REJECT]: reject,
        [TKIT_DISPATCH]: dispatch,
        [TKIT_GET_STATE]: getState,
        ...action
      });
    });
    // IMP: 还是抛出 promise 错误
    // catch then won't throw uncaught error
    // prom.then(noop, noop);
    return prom;
  } else {
    return next(action);
  }
};
