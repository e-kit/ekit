/**
 * @file: description
 * @author: yangqianjun
 * @Date: 2020-02-07 17:41:31
 * @LastEditors: yangqianjun
 * @LastEditTime: 2020-02-07 18:33:09
 */

import * as sagaEffects from 'redux-saga/effects';
import {
  BaseEffectsUtils,
  MixWithPayload,
  EffectWithPayload,
  ItCall,
  HooksModelEffectWithPayload,
  MixReduxModelAsyncEffectWithPayload
} from '@ekit/model-factory';

export type Saga = typeof sagaEffects;
export interface ReduxModelEffectsUtils extends BaseEffectsUtils, Saga {
  /** 仅generator适用 */
  tCall: ItCall;
  /** 仅async/await适用 */
  asyncSelect: <F extends (...args: any) => any>(s: F) => ReturnType<F>;
}

export interface ReduxModelAsyncEffectsUtils extends BaseEffectsUtils {
  /** 仅async/await适用 */
  asyncSelect: <F extends (...args: any) => any>(s: F) => ReturnType<F>;
}

/** redux model effects */
export interface ReduxModelEffects {
  [doSomethingAsync: string]:
    | MixWithPayload<ReduxModelEffectsUtils>
    | EffectWithPayload<ReduxModelEffectsUtils>
    | HooksModelEffectWithPayload<ReduxModelEffectsUtils>
    | MixReduxModelAsyncEffectWithPayload<ReduxModelEffectsUtils>;
}
