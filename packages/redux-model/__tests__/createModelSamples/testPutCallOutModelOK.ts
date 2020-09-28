import { ItCall, ItPut } from 'src/index';
import { modelWithoutEffects } from './testCreateModelOK';

const tPut: ItPut = () => void 0 as any;
const tCall: ItCall = () => void 0 as any;

export function* testModelWithoutEffectsPutAndCall() {
  // 正确
  yield tPut(modelWithoutEffects.actions.testNoArguments);
  yield tCall(modelWithoutEffects.actions.testNoArguments);

  yield tPut(modelWithoutEffects.actions.testOneArguments, '');
  yield tCall(modelWithoutEffects.actions.testOneArguments, '');
}
