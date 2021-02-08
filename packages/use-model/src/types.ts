/**
 * @file: description
 */

import 'react';
import {
  BaseEffectsUtils,
  HooksModelEffectWithPayload,
  MixHooksModelEffectWithPayload,
} from '@ekit/model-factory';

declare global {
  interface Window {
    /**
     * 局部Model调试工具函数
     */
    __TKIT_USE_MODEL_LOGGER__: (...args: any) => any;
  }
}

/** useModel effects */
export interface HooksModelEffects {
  [doSomethingAsync: string]:
    | HooksModelEffectWithPayload<BaseEffectsUtils>
    | MixHooksModelEffectWithPayload<BaseEffectsUtils>;
}
