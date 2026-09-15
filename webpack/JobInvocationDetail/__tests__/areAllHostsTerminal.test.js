import { areAllHostsTerminal } from '../JobInvocationConstants';

describe('areAllHostsTerminal', () => {
  it('returns false for an empty results array', () => {
    expect(areAllHostsTerminal([])).toBe(false);
  });

  it('returns false for undefined results', () => {
    expect(areAllHostsTerminal(undefined)).toBe(false);
  });

  it('returns true when every host is in a terminal state', () => {
    expect(
      areAllHostsTerminal([
        { id: 1, job_status: 'success' },
        { id: 2, job_status: 'error' },
        { id: 3, job_status: 'cancelled' },
      ])
    ).toBe(true);
  });

  it('returns false when at least one host is non-terminal', () => {
    expect(
      areAllHostsTerminal([
        { id: 1, job_status: 'success' },
        { id: 2, job_status: 'running' },
      ])
    ).toBe(false);
  });

  it('returns false when every host is non-terminal', () => {
    expect(
      areAllHostsTerminal([
        { id: 1, job_status: 'running' },
        { id: 2, job_status: 'planned' },
        { id: 3, job_status: 'N/A' },
      ])
    ).toBe(false);
  });
});
