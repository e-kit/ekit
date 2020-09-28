import {
  EFFECTS_START,
  EFFECTS_END,
  FakeEffectFactory,
  EFFECTS_ERROR,
  IEffectWrapper,
  Tction,
  EFFECTS_PROMISE_RESOLVE,
  EFFECTS_PROMISE_REJECT
} from '@ekit/model-factory';

/** for Hooks model */
export const effectWrapper: IEffectWrapper = (effect, effects, effectName, options) => {
  const { tPut: put } = effects;
  // 默认不展示loading
  const loading = (options && options.loading) || false;
  const silent = options && options.silent;
  // 局部Model不再使用gerator
  return async (action: Tction<any>) => {
    await put({ type: EFFECTS_START, payload: { effectName } } as any);
    const { getResolver, getRes, getEffect } = FakeEffectFactory({
      effectName,
      silent,
      loading
    });
    getEffect()();
    const res = getRes();
    try {
      if (typeof effect === 'function') {
        res.message = (await effect(effects, action)) || false;
        if (action[EFFECTS_PROMISE_RESOLVE]) {
          action[EFFECTS_PROMISE_RESOLVE](res.message);
        }
      }
    } catch (e) {
      res.code = 10100;
      res.message = e && e['message'] ? e['message'] : e;
      await put({ type: EFFECTS_ERROR, payload: { effectName } } as any);
      if (action[EFFECTS_PROMISE_REJECT]) {
        action[EFFECTS_PROMISE_REJECT](res.message);
      }
    }
    await put({ type: EFFECTS_END, payload: { effectName } } as any);
    // 隐藏 loading
    getResolver()(res);
  };
};
