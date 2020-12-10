/**
 * @file: description
 * @author: yangqianjun
 * @Date: 2019-07-20 15:12:00
 * @LastEditors: yangqianjun
 * @LastEditTime: 2020-02-07 20:25:13
 */
import { parser } from '@ekit/typescript-type-tester';

describe('model-factory/createModel work ok', () => {
  const files = 'testCreateModelFail.ts testCreateModelOK.ts testCreateModelStateReadOnlyFail.ts testCreateModelStateReadOnlyOK.ts testCreateModelTYPESFail.ts testCreateModelTYPESOK.ts testPutCallInModelFail.ts testPutCallInModelOK.ts testCreateModelNBFail.ts testCreateModelNBOK.ts'.split(
    ' '
  );
  const errors = parser(files, 'factorySamples');
  files.forEach(file =>
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

describe('model-factory/createModel async work ok', () => {
  const files = 'testCreateAsyncModelFail.ts testCreateMixAsyncModelFail.ts testCreateAsyncModelOK.ts testCreateMixAsyncModelOK.t'.split(
    ' '
  );
  const errors = parser(files, 'asyncFactorySamples');
  files.forEach(file =>
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
