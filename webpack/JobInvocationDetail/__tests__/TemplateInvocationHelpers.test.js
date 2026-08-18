import {
  getLastOutputTimestamp,
  mergeOutput,
} from '../TemplateInvocationHelpers';

describe('TemplateInvocationHelpers', () => {
  describe('getLastOutputTimestamp', () => {
    it('returns null for empty output', () => {
      expect(getLastOutputTimestamp([])).toBeNull();
    });

    it('returns the timestamp of the last output chunk', () => {
      expect(
        getLastOutputTimestamp([
          { timestamp: 1, output: 'first\n' },
          { timestamp: 2, output: 'second\n' },
        ])
      ).toBe(2);
    });
  });

  describe('mergeOutput', () => {
    it('appends new chunks without changing existing objects', () => {
      const existingChunk = { timestamp: 1, output: 'first\n' };
      const newChunk = { timestamp: 2, output: 'second\n' };

      const result = mergeOutput([existingChunk], [newChunk]);

      expect(result).toEqual([existingChunk, newChunk]);
      expect(result[0]).toBe(existingChunk);
      expect(result[1]).toBe(newChunk);
    });

    it('joins a line split across two polling responses', () => {
      const result = mergeOutput(
        [{ timestamp: 1, output: 'partial ' }],
        [{ timestamp: 2, output: 'line\nnext line\n' }]
      );

      expect(result).toEqual([
        { timestamp: 1, output: 'partial line\n' },
        { timestamp: 2, output: 'next line\n' },
      ]);
    });

    it('does not join chunks of different output types', () => {
      const result = mergeOutput(
        [{ timestamp: 1, output_type: 'stdout', output: 'partial ' }],
        [{ timestamp: 2, output_type: 'stderr', output: 'error\n' }]
      );

      expect(result).toEqual([
        { timestamp: 1, output_type: 'stdout', output: 'partial ' },
        { timestamp: 2, output_type: 'stderr', output: 'error\n' },
      ]);
    });

    it('does not append an empty chunk after completing a split line', () => {
      const result = mergeOutput(
        [{ timestamp: 1, output_type: 'stdout', output: 'partial ' }],
        [{ timestamp: 2, output_type: 'stdout', output: 'line\n' }]
      );

      expect(result).toEqual([
        { timestamp: 1, output_type: 'stdout', output: 'partial line\n' },
      ]);
    });

    it('returns the current output when there is nothing to append', () => {
      const currentOutput = [{ timestamp: 1, output: 'first\n' }];

      expect(mergeOutput(currentOutput, [])).toBe(currentOutput);
    });
  });
});
