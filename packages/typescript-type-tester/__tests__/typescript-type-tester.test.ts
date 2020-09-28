import path from 'path';
import parser from '../src';

describe('typescript-type-tester', () => {
  it('parser should detect error', () => {
    const sample = 'error.ts';
    const { [sample]: error } = parser([sample], path.join(__dirname, 'samples'));
    expect(error.length).toBeGreaterThan(0);
    expect({ [sample]: error }).toMatchSnapshot(sample);
  });
});
