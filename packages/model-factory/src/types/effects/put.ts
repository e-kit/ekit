/**
 * @file: typed put 接口定义
 * @author: yangqianjun
 * @Date: 2020-02-06 16:33:01
 * @LastEditors: yangqianjun
 * @LastEditTime: 2020-02-06 16:35:07
 */

import { Tction, TkitUtils } from '../action';

// TODO: ItPut 的类型定义应该简化了
/** TypeSafe Put */
export interface ItPut {
  (effect: string | Tction<any>): Promise<unknown>;
  <E extends () => any>(effect: E): Promise<ReturnType<E>>;
  <E extends (one: any) => any>(
    effect: E,
    args: TkitUtils.GetArgumentsType<E>[0] extends undefined
      ? E extends string
        ? any
        : never
      : TkitUtils.GetArgumentsType<E>[0]
  ): Promise<ReturnType<E>>;
  <E extends (...args: any[]) => any>(effect: E, ...args: TkitUtils.GetArgumentsType<E>): Promise<
    ReturnType<E>
  >;
}

// TODO: ItPut 的类型定义应该简化了
/** Non blocking TypeSafe Put */
export interface ItNBPut {
  (effect: string | Tction<any>): TkitUtils.ActionWithPayload<any>;
  <E extends () => any>(effect: E): TkitUtils.ActionWithPayload<any>;
  <E extends (one: any) => any>(
    effect: E,
    args: TkitUtils.GetArgumentsType<E>[0] extends undefined
      ? E extends string
        ? any
        : never
      : TkitUtils.GetArgumentsType<E>[0]
  ): TkitUtils.ActionWithPayload<
    TkitUtils.GetArgumentsType<E>[0] extends undefined
      ? E extends string
        ? any
        : never
      : TkitUtils.GetArgumentsType<E>[0]
  >;
  <E extends (...args: any[]) => any>(
    effect: E,
    ...args: TkitUtils.GetArgumentsType<E>
  ): TkitUtils.ActionWithPayload<TkitUtils.GetArgumentsType<E>>;
}

export type Action<E extends (...args: any[]) => any> = TkitUtils.ActionWithPayload<
  E extends (payload: infer P, ...args: any[]) => any ? P : never
>;
