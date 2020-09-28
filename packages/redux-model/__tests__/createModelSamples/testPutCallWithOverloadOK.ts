import { ItCall, ItPut } from 'src/index';
import { overload } from './states';

const tPut: ItPut = () => Promise.resolve(0);
const tCall: ItCall = function*() {
  yield 0;
};

export function* testOverloadPutAndCall() {
  // 正确
  yield tPut(overload);
  yield tCall(overload);
  yield tPut(overload, '');
  yield tCall(overload, '');
  yield tPut(overload, '', 2);
  yield tCall(overload, '', 2);
}
