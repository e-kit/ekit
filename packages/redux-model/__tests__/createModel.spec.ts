/**
 * @file: createModel 语法测试
 */
import { parser } from '@ekit/typescript-type-tester';

describe('utils/createModel work ok', () => {
  const files = 'testCreateModelFail.ts testCreateModelOK.ts testCreateModelStateReadOnlyFail.ts testCreateModelStateReadOnlyOK.ts testCreateModelTYPESFail.ts testCreateModelTYPESOK.ts testPutCallInModelFail.ts testPutCallInModelOK.ts testPutCallOutModelFail.ts testPutCallOutModelOK.ts testPutCallWithOverloadFail.ts testPutCallWithOverloadOK.ts testWithEffectsPutAndCallFail.ts testWithEffectsPutAndCallOK.ts'.split(
    ' '
  );
  const errors = parser(files, '__tests__/createModelSamples');
  files.forEach((file) =>
    it(`check sample/${file} work ok`, () => {
      const current = errors[file];
      if (file.match(/OK/)) {
        expect(current).toHaveLength(0);
      } else if (file.match(/Fail/)) {
        expect(current.length).toBeGreaterThan(0);
      }
      expect(current).toMatchSnapshot();
    })
  );
});

describe('utils/createModel async work ok', () => {
  const files = 'testCreateAsyncModelFail.ts testCreateAsyncModelOK.ts testCreateMixAsyncModelFail.ts testCreateMixAsyncModelOK.ts'.split(
    ' '
  );
  const errors = parser(files, '__tests__/asyncFactorySamples');
  files.forEach((file) =>
    it(`check sample/${file} work ok`, () => {
      const current = errors[file];
      if (file.match(/OK/)) {
        expect(current).toHaveLength(0);
      } else if (file.match(/Fail/)) {
        expect(current.length).toBeGreaterThan(0);
      }
      expect(current).toMatchSnapshot();
    })
  );
});
