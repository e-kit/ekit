/**
 * @author: yangqianjun
 * @file: 类似 dva model 的 TypeScript 封装
 * @Date: 2019-11-19 16:14:12
 * @LastEditors: yangqianjun
 * @LastEditTime: 2020-02-07 20:52:54
 */

import * as sagaEffects from 'redux-saga/effects';
import factory, {
  ItPut,
  ItCall,
  Reducers,
  ModernType,
  putWrapper,
  IEffectFactory,
  TKIT_EFFECT,
  ItNBPut,
  TKIT_NB_EFFECT,
  fakeUtilsThrowErrorIfInvoked,
  TKIT_SUB_EFFECT
} from '@ekit/model-factory';
import { ReduxModelEffects, ReduxModelEffectsUtils } from './types';
import { effectWrapper } from './effectWrapper';

const { all, call } = sagaEffects;

// for Redux Saga V0
export function* globalPut<A>(action: A): any {
  action[TKIT_SUB_EFFECT] = true;
  const res = yield sagaEffects.put(action as any);
  return res && typeof res['then'] === 'function' ? yield res : res;
}

// export function* globalPut<A>(action: A): any {
//   try {
//     action[TKIT_SUB_EFFECT] = true;
//     const res = yield sagaEffects.put(action as any);
//     return res && typeof res['then'] === 'function' ? yield res : res;
//   } catch (error) {
//     // TODO: not quite sure
//     return yield sagaEffects.cancel();
//   }
// }

// TODO: for Redux Saga v1
// action[TKIT_SUB_EFFECT] = true;
// if (process.env.NODE_ENV === 'development' && typeof sagaEffects.putResolve === 'undefined') {
//   throw Error(`1.*.* Version of Redux Saga Required`);
// }
// export const globalPut = sagaEffects.putResolve as any;

const wrappedPut = putWrapper(globalPut);

/** TypeSafe tPut Blocking */
export const tPut: ItPut = (effect: string, ...args: any[]) => {
  return wrappedPut(effect, ...args);
};

const wrappedNBPut = putWrapper(<A>(action: A): any => {
  // 非阻塞
  action[TKIT_NB_EFFECT] = true;
  return sagaEffects.put(action as any);
});

/** TypeSafe tNBPut Non Blocking */
export const tNBPut: ItNBPut = (effect: string, ...args: any[]) => wrappedNBPut(effect, ...args);

/** 用以替代 redux-saga call 的 typed tCall */
export const tCall: ItCall = <E extends (...args: any[]) => any>(
  effect: E,
  ...args: any[]
): Iterator<ReturnType<E>> => {
  // 不可以: sagaCall(effect, ...args)
  return call.apply(null, [effect, ...args]);
};

/**
 * Model工厂
 * @param model
 * @param model.namespace 命令空间
 * @param model.state 初始状态
 * @param model.reducers 推导reducers和同步actions
 * @param model.effects 副作用，推导异步actions
 */
export default function createModel<M, R extends Reducers<M>, E extends ReduxModelEffects>(model: {
  /** 命名空间 */
  namespace: string;
  /**  初始状态 */
  state: M;
  reducers: R;
  effects?: E;
  /** modern 模式，引入 immer，解决 namespace 的问题 */
  m?: ModernType;
}) {
  const { namespace } = model;
  const sagas: any[] = [];
  const TypedEffects: ReduxModelEffectsUtils = {
    ...sagaEffects,
    namespace,
    /** 仅generator适用 */
    tPut,
    /** 仅generator适用 */
    tNBPut,
    /** 仅generator适用 */
    tCall,
    asyncSelect: fakeUtilsThrowErrorIfInvoked as any,
    asyncPut: fakeUtilsThrowErrorIfInvoked as any,
    asyncNBPut: fakeUtilsThrowErrorIfInvoked as any
  };

  if (process.env.NODE_ENV === 'development') {
    [
      ...Object.keys(model.reducers),
      ...((model.effects && Object.keys(model.effects)) || [])
    ].forEach(action => {
      if (action in createModel.ActionNameMap) {
        throw Error(
          `model ${namespace} ${action} 已存在于 model ${createModel.ActionNameMap[action]}，存在不可控风险`
        );
      }
      createModel.ActionNameMap[action] = namespace;
    });
  }

  const effectFactory: IEffectFactory = (effect, type, options) => {
    const wrappedEffect = effectWrapper(effect, TypedEffects, type, options);
    switch (options.type) {
      case 'throttle':
        sagas.push(sagaEffects.throttle(options.ms || 100, type, wrappedEffect));
        break;
      case 'takeEvery':
      case 'takeLatest':
        sagas.push(sagaEffects[options.type](type, wrappedEffect));
        break;
    }
  };

  const ReduxModel = {
    ...factory({
      ...model,
      effectFactory
    }),
    *sagas() {
      yield all(sagas);
    }
  };

  // 写入 tkit action type 标记
  const { effects } = model;
  const { actions } = ReduxModel;
  if (effects) {
    Object.keys(effects).forEach((doSomethingAsync: keyof E) => {
      const creator = actions[doSomethingAsync];
      // 实际上 creator 并不是返回的 promise，只是类型上包装成 promise，经过了 middleware 包装才是
      actions[doSomethingAsync] = ((...args: any) => ({
        ...((creator as any)(...args) as any),
        [TKIT_EFFECT]: true
      })) as typeof creator;
    });
  }

  return ReduxModel;
}

/** 开发环境下，对 action name 进行唯一性校验，避免复杂项目下潜在风险 */
// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
createModel.ActionNameMap = <{ [action: string]: string }>{};
