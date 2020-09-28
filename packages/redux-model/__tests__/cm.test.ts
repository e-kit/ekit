/**
 * @file: CM 使用层面测试
 * @author: yangqianjun
 * @Date: 2019-12-20 11:14:36
 * @LastEditors: yangqianjun
 * @LastEditTime: 2020-02-07 17:33:23
 */

import createModel, { CM } from 'src/index';
import { modelWithEffectsState } from './createModelSamples/states';
import { cmModel } from './cmSamples/testCMOK';

describe('cm ok', () => {
  // 仅测试包装后的 reducers 是否 ok
  it('cm reducer ok', () => {
    const newName = 'newName';
    const { reducers, actions, namespace } = cmModel;
    const initialState = { [namespace]: { ...modelWithEffectsState } };

    // test set name
    {
      const action = actions.doSetName(newName);
      const newState = reducers(initialState as any, action as any);
      // immer
      expect(initialState[namespace] !== newState[namespace]).toBeTruthy();
      expect(newState[namespace].name).toEqual(newName);
    }
  });
  it('cm action check ok', () => {
    process.env.NODE_ENV = 'development';
    createModel.ActionNameMap = {};
    CM({
      namespace: 'a',
      state: [] as number[],
      reducers: {
        doA: (state) => {
          state.push(1);
        }
      },
      effects: {}
    });
    expect(() =>
      CM({
        namespace: 'b',
        state: [] as number[],
        reducers: {
          doA: (state) => {
            state.push(1);
          }
        },
        effects: {}
      })
    ).toThrow();
    process.env.NODE_ENV = 'test';
  });
});
