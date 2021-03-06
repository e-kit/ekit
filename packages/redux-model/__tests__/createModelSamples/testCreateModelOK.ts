/**
 * @file: description
 */
import factory, { Tction } from 'src/index';
import { modelWithoutEffectsState, modelWithEffectsState } from './states';

export const modelWithoutEffects = factory({
  namespace: 'socketmodelWithoutEffects',
  state: modelWithoutEffectsState,
  reducers: {
    testNoArguments: (state) => ({ ...state }),
    testOneArguments: (state, action: Tction<string>) => ({ ...state, name: action.payload }),
  },
});

export const modelWithEffects = factory({
  namespace: 'socketmodelWithoutEffects',
  state: modelWithEffectsState,
  reducers: {
    testNoArguments: (state) => ({ ...state }),
    testOneArguments: (state, action: Tction<string>) => ({ ...state, name: action.payload }),
  },
  effects: {
    *testAsyncNoArguments({ tPut }): Iterator<any> {
      yield tPut(modelWithEffects.actions.testAsyncNoArguments);
    },
    *testAsyncOneArguments({ tPut, tCall }, action: Tction<string>): Iterator<any> {
      yield tCall((name: string) => name, action.payload);
      yield tPut(modelWithEffects.actions.testAsyncOneArguments, '');
    },
  },
});

// 测试 TYPES，不应出错
const {
  TYPES: { testNoArguments, testOneArguments, testAsyncNoArguments, testAsyncOneArguments },
} = modelWithEffects;

let StringA: string = testNoArguments;
StringA = testOneArguments;
StringA = testAsyncNoArguments;
StringA = testAsyncOneArguments;

const {
  TYPES: { testNoArguments: testNoArgumentsNoEffects, testOneArguments: testOneArgumentsNoEffects },
} = modelWithoutEffects;

StringA = testNoArgumentsNoEffects;
StringA = testOneArgumentsNoEffects;
