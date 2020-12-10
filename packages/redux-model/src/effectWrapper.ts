/**
 * @file: description
 * @author: yangqianjun
 * @Date: 2020-02-07 11:11:17
 * @LastEditors: yangqianjun
 * @LastEditTime: 2020-02-07 15:34:46
 */

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
  TKIT_GET_STATE,
  TKIT_NB_EFFECT,
  TKIT_SUB_EFFECT,
  printError
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
    const isTopEffect = !action[TKIT_SUB_EFFECT];
    isTopEffect && (yield put({ type: EFFECTS_START, payload: { effectName } } as any));
    const { getResolver, getRes, getEffect } = FakeEffectFactory({
      effectName,
      silent,
      loading
    });
    isTopEffect && getEffect()();
    const res = getRes();
    try {
      if (action[TKIT_DISPATCH]) {
        // IMP: 注入 asyncPut
        effects.asyncPut = putWrapper((act: Tction<any>) => {
          // IMP: 不单独显示 loading、error
          act[TKIT_SUB_EFFECT] = true;
          return action[TKIT_DISPATCH](act);
        });
        const wrappedNBDispatch = (act: Tction<any>) => {
          // 非阻塞
          act[TKIT_NB_EFFECT] = true;
          return action[TKIT_DISPATCH](act);
        };
        effects.asyncNBPut = putWrapper(wrappedNBDispatch);
        // IMP: 注入 asyncSelect
        ((effects as unknown) as ReduxModelEffectsUtils).asyncSelect = f =>
          f(action[TKIT_GET_STATE]());
      }
      if (typeof effect === 'function') {
        const mayBePromise = yield effect(effects, action);
        // 阻塞 Effect
        if (!action[TKIT_NB_EFFECT]) {
          // TODO: 如果使用 Redux Saga putResolve，下边 res.message 赋值逻辑疑似可以去掉
          res.message =
            mayBePromise && typeof mayBePromise['then'] === 'function'
              ? yield mayBePromise
              : mayBePromise;
        }
      }
    } catch (error) {
      res.code = 10100;
      res.message = error && error['message'] ? error['message'] : error;
      // IMP: 确保打印被自动捕获的错误信息
      try {
        isTopEffect && (yield put({ type: EFFECTS_ERROR, payload: { effectName, error } } as any));
      } catch (error) {
        printError(`EFFECTS_ERROR: ${effectName} ${(error && error.message) || error}`);
      }
    } finally {
      // IMP: Redux Saga cancel
      const isCancelled = yield cancelled();
      isTopEffect &&
        (yield put({ type: EFFECTS_END, payload: { effectName, cancelled: isCancelled } } as any));
      // cancel 10499 && 阻塞 Effect
      if (isCancelled) {
        res.code = res.message = 10499;
      }
      // IMP: 确保打印被自动捕获的错误信息
      if (res.code) {
        // IMP: cancel 不要打印错误信息
        res.code !== 10499 && printError(`EFFECTS_ERROR: ${effectName} ${res.message}`);
        // 阻塞 Effect
        if (action[EFFECTS_PROMISE_REJECT]) {
          action[EFFECTS_PROMISE_REJECT](res.message);
        }
      } else {
        if (action[EFFECTS_PROMISE_RESOLVE]) {
          action[EFFECTS_PROMISE_RESOLVE](res.message);
        }
      }
      // 隐藏 loading
      isTopEffect && getResolver()(res);
    }
  };
};
