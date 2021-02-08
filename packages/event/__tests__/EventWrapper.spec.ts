import * as ts from 'typescript';
import { parser } from '@ekit/typescript-type-tester';

const files = 'EventWrapperOK.tsx EventWrapperFail.tsx'.split(' ');

describe('@ekit/event work ok', () => {
  const errors = parser(files, '__tests__/samples', {
    jsx: ts.JsxEmit.Preserve,
    esModuleInterop: true,
  });
  files.forEach((file) =>
    it(`check sample/${file} work ok`, () => {
      const current = errors[file];
      console.log(current);
      if (file.match(/OK/)) {
        expect(current).toHaveLength(0);
      } else if (file.match(/Fail/)) {
        expect(current.length).toBeGreaterThan(0);
      }
      expect(current).toMatchSnapshot();
    })
  );
});
