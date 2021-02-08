/**
 * @file: 局部 model with immer
 */

import { TkitUtils } from '@ekit/types';
import { CMReducers, ModernType } from '@ekit/model-factory';
import { HooksModelEffects } from './types';
import { M } from './m';

export function MM<M, R extends CMReducers<M>, E extends HooksModelEffects>(model: {
  /** 命令空间，区分日志使用 */
  namespace: string;
  /** 初始状态 */
  state: M;
  reducers: R;
  effects: E;
}) {
  // cheat
  return M<
    M,
    {
      [doSomething in keyof R]: (
        state: M,
        action: TkitUtils.GetArgumentsType<R[doSomething]>[1]
      ) => M;
    },
    E
  >({ ...model, m: ModernType.HookModern } as any);
}
