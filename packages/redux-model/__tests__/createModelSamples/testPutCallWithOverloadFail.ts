import { ItCall } from 'src/index';
import { overload } from './states';

const tCall: ItCall = () => void 0 as any;

export function* testOverloadPutAndCall() {
  // @cc: 报错，请勿修改，单元测试使用
  yield tCall(overload, 2);

  yield tCall(overload, 2, 2);
  yield tCall(overload, '', '');
  yield tCall(overload, 2, '');
}
