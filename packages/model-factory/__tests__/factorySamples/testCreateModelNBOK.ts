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
    *doA(utils, action: Tction<string>): Iterator<{}, number, any> {
      yield 1;
      return 1;
    },
    async doB(utils, action: Tction<string>) {
      return 1;
    },
    *doC({ tNBPut }): Iterator<{}, string, any> {
      const action: Action<typeof model.actions.doA> = yield tNBPut(model.actions.doA, '');
      // action.payload is string
      return action.payload;
    },
    async doD({ asyncNBPut }): Promise<string> {
      const action = await asyncNBPut(model.actions.doB, '');
      // action.payload is string
      return action.payload;
    }
  }
});
