/**
 * @file: useModel 语法层面测试
 */

import { parser } from '@ekit/typescript-type-tester';

const files = 'testLocalModelFail.ts testLocalModelOK.ts testUseModelFail.ts testUseModelOK.ts testMMFail.ts testMMOK.ts'.split(
  ' '
);

describe('utils/useModel work ok', () => {
  const errors = parser(files, '__tests__/useModelSamples');
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
