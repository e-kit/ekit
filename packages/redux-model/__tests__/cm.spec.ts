/**
 * @file: CM 语法层面测试
 */
import { parser } from '@ekit/typescript-type-tester';

const files = 'testCMFail.ts testCMOK.ts'.split(' ');

describe('utils/useModel work ok', () => {
  const errors = parser(files, '__tests__/cmSamples');
  files.forEach((file) =>
    it(`check cmSamples/${file} work ok`, () => {
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
