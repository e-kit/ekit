/**
 * @file: description
 */
import factory, { Tction } from 'src/index';
import { modelWithEffectsState } from '../createModelSamples/states';

export const modelWithEffects = factory({
  namespace: 'socketmodelWithoutEffects',
  state: modelWithEffectsState,
  reducers: {
    testNoArguments: (state) => ({ ...state }),
    testOneArguments: (state, action: Tction<string>) => ({ ...state, name: action.payload }),
  },
  effects: {
    async testAsyncNoArguments({ asyncPut }) {
      const res = await asyncPut(modelWithEffects.actions.testAsyncNoArguments);
      // 类型错误
      const str: string = res;
      return 1;
    },
    async testAsyncOneArguments({ asyncPut }, action: Tction<string>) {
      const res = await asyncPut(modelWithEffects.actions.testAsyncOneArguments, '');
      // 类型错误
      const str: number = res.name;
      return { name: 'name' };
    },
  },
});
