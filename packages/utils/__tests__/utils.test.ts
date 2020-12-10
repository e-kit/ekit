import { concatDirectory } from 'src/utils';

describe('@ekit/utils', () => {
  it('should concatDirectory works ok', () => {
    expect(concatDirectory(__dirname, 'xx')).toEqual([__dirname, 'xx'].join('/'));
  });
});
