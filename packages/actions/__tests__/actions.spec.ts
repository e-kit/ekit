import { parser } from '@ekit/typescript-type-tester';

const files = 'actionsOK.ts actionsFail.ts'.split(' ');

describe('actions work ok', () => {
  const errors = parser(files, '__tests__/actionsSamples');
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
