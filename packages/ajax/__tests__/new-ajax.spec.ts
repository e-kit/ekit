/**
 * @author: yangqianjun
 * @file: 确保接口类型正常
 * @Date: 2019-12-05 11:49:54
 * @LastEditors: yangqianjun
 * @LastEditTime: 2019-12-05 17:34:44
 */
import { parser } from '@ekit/typescript-type-tester';

const files = 'responseOK.ts responseFail.ts'.split(' ');

describe('@ekit/ajax work ok', () => {
  const errors = parser(files, `${process.cwd()}/__tests__/samples`);
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
