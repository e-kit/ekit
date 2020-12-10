/**
 * @file: description
 * @author: yangqianjun
 * @Date: 2020-02-07 11:11:17
 * @LastEditors: yangqianjun
 * @LastEditTime: 2020-02-07 15:34:36
 */

import {
  EFFECTS_START,
  EFFECTS_END,
  FakeEffectFactory,
  EFFECTS_ERROR,
  IEffectWrapper,
  Tction,
  EFFECTS_PROMISE_RESOLVE,
  EFFECTS_PROMISE_REJECT,
  TKIT_SUB_EFFECT,
  printError
} from '@ekit/model-factory';

/** for Hooks model */
export const effectWrapper: IEffectWrapper = (effect, effects, effectName, options) => {
  const { tPut: put } = effects;
  // 默认不展示loading
  const loading = (options && options.loading) || false;
  const silent = options && options.silent;
  // 局部Model不再使用gerator
  return async (action: Tction<any>) => {
    const isTopEffect = !action[TKIT_SUB_EFFECT];
    isTopEffect && (await put({ type: EFFECTS_START, payload: { effectName } } as any));
    const { getResolver, getRes, getEffect } = FakeEffectFactory({
      effectName,
      silent,
      loading
    });
    isTopEffect && getEffect()();
    const res = getRes();
    try {
      if (typeof effect === 'function') {
        const maybePromise = effect(effects, action);
        res.message = (await maybePromise) || false;
      }
    } catch (error) {
      res.code = 10100;
      res.message = error && error['message'] ? error['message'] : error;
      // IMP: 确保打印被自动捕获的错误信息
      try {
        isTopEffect && (await put({ type: EFFECTS_ERROR, payload: { effectName, error } } as any));
      } catch (error) {
        printError(`HOOKS_EFFECTS_ERROR: ${effectName} ${(error && error.message) || error}`);
      }
    } finally {
      isTopEffect && (await put({ type: EFFECTS_END, payload: { effectName } } as any));
      if (res.code) {
        // IMP: 确保打印被自动捕获的错误信息
        printError(`HOOKS_EFFECTS_ERROR: ${effectName} ${res.message}`);
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
