/**
 * @file: model 常量
 * @author: yangqianjun
 * @Date: 2020-02-06 14:42:35
 * @LastEditors: yangqianjun
 * @LastEditTime: 2020-02-10 10:06:56
 */

import { EffectOptions } from './types';

/** 默认副作用配置 */
export const defaultEffectOptions: EffectOptions = {
  type: 'takeEvery',
  ms: 100
};

/** 如引入 immer，枚举标记 redux 或者 react hooks */
export const enum ModernType {
  /** redux */
  ReduxModern = 0,
  /** useModel */
  HookModern = 1
}

/**
 * 执行 effect 广播的事件
 * 从 @ekit/async 拆过来，以逐步解除 model & async 的循环引用
 */
export const ASYNC_EFFECT_EVENT_NAME = 'ASYNC_EFFECT_EVENT_NAME';

/** Redux Type 副作用开始 */
export const EFFECTS_START = 'EFFECTS_START';

/** Redux Type 副作用结束 */
export const EFFECTS_END = 'EFFECTS_END';

/** Redux Type 副作用错误 */
export const EFFECTS_ERROR = 'EFFECTS_ERROR';

/** Redux Type 副作用成功 */
export const EFFECTS_SUCCESS = 'EFFECTS_SUCCESS';

/**  副作用消息EventCenter事件 */
export const EFFECTS_MSG = 'EFFECTS_MSG';

export const fakeEffectRes = { code: 0 };

/** 副作用返回的promise的resolve */
export const EFFECTS_PROMISE_RESOLVE = '__EFFECTS_PROMISE_RESOLVE__';

/** 副作用返回的promise的resolve */
export const EFFECTS_PROMISE_REJECT = '__EFFECTS_PROMISE_REJECT__';

/** 是否 tkit effet */
export const TKIT_EFFECT = '__TKIT_EFFECT__';

/** 是否 Tkit Non blocking Effect */
export const TKIT_NB_EFFECT = '__TKIT_NB_EFFECT__';

/** 标记是子 effect，不自动捕获错误以及发起 EFFECT START */
export const TKIT_SUB_EFFECT = '__TKIT_SUB_EFFECT__';

/** 注入 tDispath */
export const TKIT_DISPATCH = '__TKIT_DISPATCH__';

/** 注入 get State */
export const TKIT_GET_STATE = '__TKIT_GET_STATE__';

/** 为 action 标记子 effect 标记  */
export const markSubEffect = <A>(action: A) => {
  action[TKIT_SUB_EFFECT] = true;
};

export const noop = () => void 0;
export const fakeUtilsThrowErrorIfInvoked = () => {
  throw 'Fake Utils mustn\'t be Invoked';
};
export const printError = (message: string) => {
  // TODO: UC Browser for Android 不支持 console.error
  // eslint-disable-next-line no-console
  if (typeof console.error === 'function') {
    // eslint-disable-next-line no-console
    console.error(message);
  }
};
