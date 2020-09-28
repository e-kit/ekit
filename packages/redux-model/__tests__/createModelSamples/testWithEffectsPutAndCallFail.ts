import { ItCall, ItPut } from 'src/index';
import { modelWithEffects } from './testCreateModelOK';

const tPut: ItPut = () => void 0 as any;
const tCall: ItCall = () => void 0 as any;

export function* testWithEffectsPutAndCall() {
  // @cc: 报错，请勿修改，单元测试使用
  yield tPut(modelWithEffects.actions.testAsyncNoArguments, '');
  yield tCall(modelWithEffects.actions.testAsyncNoArguments, '');

  yield tPut(modelWithEffects.actions.testAsyncOneArguments, '', '');
  yield tCall(modelWithEffects.actions.testAsyncOneArguments, '', '');
}
