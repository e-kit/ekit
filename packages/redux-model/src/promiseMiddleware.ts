import { Middleware } from 'redux';
import {
  EFFECTS_PROMISE_RESOLVE,
  EFFECTS_PROMISE_REJECT,
  TKIT_EFFECT,
  TKIT_DISPATCH,
  TKIT_GET_STATE,
  TKIT_NB_EFFECT,
  noop
} from '@ekit/model-factory';

/** promise redux 中间件 */
export const promiseMiddleware: Middleware = ({ dispatch, getState }) => next => action => {
  // 私有协议
  if (action[TKIT_EFFECT] && !action[TKIT_NB_EFFECT]) {
    const prom = new Promise((resolve, reject) => {
      next({
        [EFFECTS_PROMISE_RESOLVE]: resolve,
        [EFFECTS_PROMISE_REJECT]: reject,
        [TKIT_DISPATCH]: dispatch,
        [TKIT_GET_STATE]: getState,
        ...action
      });
    });
    // IMP: 自动捕获且不打印错误，在 effectWrapper 里打印
    prom.then(noop, noop);
    return prom;
  } else {
    return next(action);
  }
};
