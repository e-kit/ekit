import { ItCall, ItPut } from 'src/index';
import { modelWithEffects } from './testCreateModelOK';

const tPut: ItPut = () => void 0 as any;
const tCall: ItCall = () => void 0 as any;

export function* testWithEffectsPutAndCall() {
  // 正确
  yield tPut(modelWithEffects.actions.testNoArguments);
  yield tCall(modelWithEffects.actions.testNoArguments);

  yield tPut(modelWithEffects.actions.testOneArguments, '');
  yield tCall(modelWithEffects.actions.testOneArguments, '');

  yield tPut(modelWithEffects.actions.testAsyncNoArguments);
  yield tCall(modelWithEffects.actions.testAsyncNoArguments);

  yield tPut(modelWithEffects.actions.testAsyncOneArguments, '');
  yield tCall(modelWithEffects.actions.testAsyncOneArguments, '');
}
