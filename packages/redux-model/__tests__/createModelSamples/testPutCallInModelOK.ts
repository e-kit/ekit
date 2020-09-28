import factory, { Tction } from 'src/index';
import { modelWithEffectsState } from './states';

const testModelWithEffects = factory({
  namespace: 'socketmodelWithoutEffects',
  state: modelWithEffectsState,
  reducers: {
    testNoArguments: (state) => ({ ...state }),
    testOneArguments: (state, action: Tction<string>) => ({ ...state, name: action.payload })
  },
  effects: {
    *testAsyncNoArguments({ tCall, tPut }): Iterator<any> {
      yield tPut(testModelWithEffects.actions.testAsyncNoArguments);
    },
    *testAsyncOneArguments({ tCall, tPut }, action: Tction<string>): Iterator<any> {
      yield tCall((name: string) => name, action.payload);
      yield tPut(testModelWithEffects.actions.testAsyncOneArguments, '');
    }
  }
});
