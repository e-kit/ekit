import { cancelled } from 'redux-saga/effects';
import {
  EFFECTS_START,
  EFFECTS_END,
  FakeEffectFactory,
  EFFECTS_ERROR,
  IEffectWrapper,
  Tction,
  putWrapper,
  EFFECTS_PROMISE_RESOLVE,
  EFFECTS_PROMISE_REJECT,
  TKIT_DISPATCH,
  TKIT_GET_STATE
} from '@ekit/model-factory';
import { ReduxModelEffectsUtils } from './types';

/** for Redux Model */
export const effectWrapper: IEffectWrapper = (effect, effects, effectName, options) => {
  const { tPut: put } = effects;
  /**
   * 默认不展示loading
   */
  const loading = (options && options.loading) || false;
  const silent = options && options.silent;
  /**
   * 局部Model不再使用gerator
   */
  return function* wrapper(action: Tction<any>) {
    yield put({ type: EFFECTS_START, payload: { effectName } } as any);
    const { getResolver, getRes, getEffect } = FakeEffectFactory({
      effectName,
      silent,
      loading
    });
    getEffect()();
    const res = getRes();
    try {
      if (TKIT_DISPATCH in action && action[TKIT_DISPATCH]) {
        // 注入 asyncPut
        effects.asyncPut = putWrapper(action[TKIT_DISPATCH]);
        // 注入 asyncSelect
        ((effects as unknown) as ReduxModelEffectsUtils).asyncSelect = (f) =>
          f(action[TKIT_GET_STATE]());
      }
      if (typeof effect === 'function') {
        const mayBePromise = yield effect(effects, action);
        // 支持 async & await
        res.message =
          mayBePromise && typeof mayBePromise['then'] === 'function'
            ? yield mayBePromise
            : mayBePromise;
        if (action[EFFECTS_PROMISE_RESOLVE]) {
          action[EFFECTS_PROMISE_RESOLVE](res.message);
        }
      }
    } catch (e) {
      res.code = 10100;
      res.message = e && e['message'] ? e['message'] : e;
      yield put({ type: EFFECTS_ERROR, payload: { effectName } } as any);
      if (action[EFFECTS_PROMISE_REJECT]) {
        action[EFFECTS_PROMISE_REJECT](res.message);
      }
    } finally {
      // IMP: 特殊处理saga cancel
      // eslint-disable-next-line no-constant-condition
      if ((yield cancelled()) || true) {
        yield put({ type: EFFECTS_END, payload: { effectName } } as any);
        // cancel 10499
        if (action[EFFECTS_PROMISE_REJECT]) {
          action[EFFECTS_PROMISE_REJECT](10499);
        }
        // 隐藏 loading
        getResolver()(res);
      }
    }
  };
};
