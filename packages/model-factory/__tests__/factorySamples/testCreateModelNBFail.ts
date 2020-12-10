import factory, { Tction, Action } from 'src/index';
import { modelWithoutEffectsState } from '@ekit/model-factory/__tests__/factorySamples/states';

const model = factory({
  namespace: 'socketmodelWithoutEffects',
  state: modelWithoutEffectsState,
  reducers: {
    // 正确
    testOneArguments: (state, action: Tction<string>) => ({ ...state, name: action.payload })
  },
  effects: {
    *doA(utils, action: Tction<1>): Iterator<{}, number, any> {
      yield 1;
      return 1;
    },
    async doB(utils, action: Tction<number>) {
      return 1;
    },
    *doC({ tNBPut }): Iterator<{}, string, any> {
      const action: Action<typeof model.actions.doA> = yield tNBPut(model.actions.doA, 1);
      // 报错，请勿修改，单元测试使用，action.payload is number
      return action.payload;
    },
    async doD({ asyncNBPut }): Promise<string> {
      const action = await asyncNBPut(model.actions.doB, 1);
      // 报错，请勿修改，单元测试使用，action.payload is number
      return action.payload;
    }
  }
});
