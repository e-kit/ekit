/**
 * @description 基于 React Hooks 封装的 model，适用于局部状态
 */
import { useReducer, useMemo, useEffect, useRef } from 'react';
import {
  Tction,
  putWrapper,
  EffectOptions,
  EFFECTS_PROMISE_RESOLVE,
  EFFECTS_PROMISE_REJECT,
  markSubEffect,
  printError,
  noop
} from '@ekit/model-factory';
import { effectWrapper } from './effectWrapper';

export const tCall = <E extends (...args: any[]) => any>(
  effect: E,
  ...args: any[]
): ReturnType<E> => {
  console.error(`画蛇添足，请直接直接调用“effect.name”`);
  return effect.apply(args);
};

const localOpts = { local: true };

/**
 * 类似 Redux 的 bindActionToDispatch
 */
export function bindDispatchToAction<A, E, M extends { actions: A; effects: E; TYPES: any }>(
  actions: A,
  dispatch: ReturnType<typeof useReducer>[1],
  model: M
) {
  const { effects: modelEffects } = model;
  const wrappedEffects: E = {} as E;
  /** 在 dispatch 过程中副作用 */
  const wrappedDiaptch = <A>(action: A) => {
    dispatch(action);
    const effect = wrappedEffects[action['type']];
    return effect
      ? new Promise((rs, rj) => {
          action[EFFECTS_PROMISE_RESOLVE] = rs;
          action[EFFECTS_PROMISE_REJECT] = rj;
          effect(action);
        })
      : void 0;
  };

  const blockingDispatch = <A>(action: A) => {
    const maybePromise = wrappedDiaptch(action);
    return maybePromise || action;
  };
  /** 阻塞 */
  const wrappedTopPut = putWrapper(<A>(action: A) => {
    return blockingDispatch(action);
  });
  // IMP: 阻塞自动 loading、error 单一
  const wrappedPut = putWrapper(<A>(action: A) => {
    markSubEffect(action);
    return blockingDispatch(action);
  });

  const nonBlockingDispatch = <A>(action: A) => {
    const maybePromise = wrappedDiaptch(action);
    if (maybePromise) {
      // IMP: 捕获但不打印错误，在 effectWrapper 里打印
      maybePromise.catch(noop);
    }
    return action;
  };
  /** 非阻塞 */
  const wrappedNBPut = putWrapper(<A>(action: A) => {
    return nonBlockingDispatch(action);
  });
  // IMP: 非阻塞自动 loading、error 处理独立
  const wrappedTopNBPut = wrappedNBPut; /**putWrapper(<A>(action: A) => {
    return nonBlockingDispatch(action);
  });*/

  const effectsUtils = {
    tPut: wrappedPut,
    tNBPut: wrappedNBPut,
    asyncPut: wrappedPut,
    asyncNBPut: wrappedNBPut,
    tCall,
    namespace: model['namespace']
  };

  // IMP: 不同于全局 store，需要关联 dispatch
  // eslint-disable-next-line prefer-const
  return Object.keys(actions).reduce((newActions, actionName) => {
    {
      const originEffect = modelEffects[actionName];
      const opts: EffectOptions = Array.isArray(originEffect)
        ? { ...originEffect[1], ...localOpts }
        : localOpts;
      if (originEffect) {
        wrappedEffects[model.TYPES[actionName]] = effectWrapper(
          Array.isArray(originEffect) ? originEffect[0] : originEffect,
          effectsUtils,
          model.TYPES[actionName],
          opts
        );
      }
    }
    {
      const originAction = actions[actionName];
      newActions[actionName] = modelEffects[actionName]
        ? (...args: any) => wrappedTopPut(originAction, ...args)
        : (...args: any) => wrappedTopNBPut(originAction, ...args);
    }
    return newActions;
  }, {}) as typeof actions;
}

/**
 * 注入调试工具
 */
const commonReducer: (reducer: <M>(prevState: M, action: Tction<any>) => M) => any =
  process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'
    ? (reducer) =>
        useMemo(
          () => <M>(prevState: M, action: Tction<any>) => {
            const newState = reducer(prevState, action);
            if (window.__TKIT_USE_MODEL_LOGGER__) {
              window.__TKIT_USE_MODEL_LOGGER__(
                'LOCAL ACTION',
                action['type'],
                prevState,
                action,
                newState
              );
            }
            return newState;
          },
          [reducer]
        )
    : (reducer) => reducer;

/**
 * Hooks Model
 */
export const useModel = <
  M extends {
    reducers: any;
    actions: any;
    state: any;
    effects: any;
    TYPES: any;
    namespace: string;
  }
>(
  model: M,
  initialState: M['state'] = model['state']
) => {
  const [store, dispatch] = useReducer(commonReducer(model.reducers), initialState);

  const isNotUnmounted = useRef(true);
  // @IMP: 解除 dispatch 响应，避免内存泄露
  useEffect(() => {
    return () => {
      isNotUnmounted.current = false;
    };
  }, []);

  return [
    store,
    useMemo(
      () =>
        bindDispatchToAction(
          model.actions,
          // eslint-disable-next-line prefer-spread
          (...args) => isNotUnmounted.current && dispatch.apply(null, args),
          model
        ),
      [model, dispatch]
    )
  ] as [M extends { state: any } ? M['state'] : {}, M extends { actions: any } ? M['actions'] : {}];
};
export default useModel;
