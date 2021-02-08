/**
 * @file: MM 语法层面测试
 */

import { Tction, MM, useModel } from 'src/index';
import { UserMMModel } from './testMMOK';

export const UserFailModel = MM({
  namespace: 'test',
  state: {
    username: '',
  },
  reducers: {
    doRename: (state, action: Tction<{ username: number }>) => {
      state.username = action.payload.username;
    },
    doClear: (state) => {
      state.username = '';
    },
  },
  effects: {
    doFetchName: async ({ tPut }, action: Tction<{ time: number }>): Promise<{}> => {
      await new Promise((rs) => {
        // @cc: 请勿修改 delay 时间，单元测试使用，必须第二个参数 - `parser.ts` 解析时才不会报错
        setTimeout(() => {
          rs();
        }, 0);
      });
      return tPut(UserMMModel.actions.doRename, { username: action.payload.time });
    },
  },
});

// should throw error
export function A(): string {
  const [store, localActions] = useModel(UserMMModel);
  // 应报错
  localActions.doRename({ username: 2 });
  localActions.doClear('');
  localActions.doFetchName({ time: '1' });

  const { username2 } = store;
  return username2;
}
