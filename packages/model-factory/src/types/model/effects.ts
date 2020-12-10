/**
 * @file: model.effect 接口定义
 * @author: yangqianjun
 * @Date: 2020-02-06 16:39:25
 * @LastEditors: yangqianjun
 * @LastEditTime: 2020-02-10 09:29:35
 */

import { AbstractAction } from '../action';
import { ItNBPut, ItPut } from '../effects/put';

export interface BaseEffectsUtils {
  namespace: string;
  /** 仅适用 Generator，tPut 触发副作用是阻塞的，返回值是 Promise， */
  tPut: ItPut;
  /** tNBPut 是非阻塞 tPut，返回值是 action */
  tNBPut: ItNBPut;
  /** 仅ayns/await适用 */
  asyncPut: ItPut;
  /** asyncNBPut 是非阻塞 asyncPut，返回值是 action */
  asyncNBPut: ItNBPut;
}

/**
 * ====================== Hooks Model Effects ======================
 */

export type HooksModelEffectWithPayload<Utils extends BaseEffectsUtils> = <
  P extends AbstractAction
>(
  saga: Utils,
  action: P
) => Promise<any>;

export type MixHooksModelEffectWithPayload<Utils extends BaseEffectsUtils> = [
  <P extends AbstractAction>(saga: Utils, action: P) => Promise<any>,
  Omit<EffectOptions, 'type' | 'ms'>
];

/**
 * ====================== Redux Model Effects ======================
 */

export type MixReduxModelAsyncEffectWithPayload<Utils extends BaseEffectsUtils> = [
  <P extends AbstractAction>(saga: Utils, action: P) => Promise<any>,
  EffectOptions
];

export type EffectWithPayload<Utils extends BaseEffectsUtils> = <P extends AbstractAction>(
  saga: Utils,
  action: P
) => Iterator<{}>;
type EffectType = 'takeEvery' | 'takeLatest' | 'throttle';

/**
 * Model Effects配置参数
 * @property type 类型
 * @property [ms] type为“throttle”下节流毫秒数
 * @property [loading] 是否要求显示全局loading效果
 */
export interface EffectOptions {
  /** 类型 */
  type: EffectType;
  /** type为“throttle”下节流毫秒数 */
  ms?: number;
  /** 是否要求显示全局loading效果 */
  loading?: boolean;
  /** 是否局部副作用，Hooks Model */
  local?: boolean;
  /** 屏蔽交互效果，设置为true，则不会广播事件 */
  silent?: boolean;
}
export type MixWithPayload<Utils extends BaseEffectsUtils> = [
  EffectWithPayload<Utils>,
  EffectOptions
];

/**
 * ====================== Compatible Model Effects ======================
 */

export interface Effects<Utils extends BaseEffectsUtils> {
  [doSomethingAsync: string]:
    | MixWithPayload<Utils>
    | EffectWithPayload<Utils>
    | MixReduxModelAsyncEffectWithPayload<Utils>
    | HooksModelEffectWithPayload<Utils>
    | MixHooksModelEffectWithPayload<Utils>;
}
