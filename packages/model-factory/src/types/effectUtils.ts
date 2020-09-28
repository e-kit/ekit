
import { BaseEffectsUtils, EffectOptions } from './model/effects';

/** 对 effect 进行包裹，例如公共 loading、tips */
export interface IEffectWrapper {
  <T extends BaseEffectsUtils, A, S>(
    effect: S,
    /** 提供 tPut、tCall 的工具 */
    effectsUtils: T,
    effectName: string,
    options?: EffectOptions
  ): any;
}

/** 关联 store 和 effect */
export interface IEffectFactory {
  <A, S>(effect: S, effectName: string, options: EffectOptions): any;
}

/** 获取 generator 返回类型；兼容 promise  */
export type GetGeneratorReturnType<F> = F extends (...args: any) => Iterator<any, infer R, any>
  ? R
  : F extends (...args: any) => Promise<infer A>
  ? A
  : never; /** 是否应该是 ReturnType<F> ? */
