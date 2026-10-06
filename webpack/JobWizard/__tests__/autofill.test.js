import { buildHostSearchFromIds } from '../autofill';

describe('buildHostSearchFromIds', () => {
  it('builds id search for numeric host ids', () => {
    expect(buildHostSearchFromIds('105')).toBe('id ^ (105)');
    expect(buildHostSearchFromIds(['105', '37'])).toBe('id ^ (105,37)');
  });

  it('builds name search for hostname/FQDN host ids', () => {
    expect(buildHostSearchFromIds('client.example.com')).toBe(
      'name ^ (client.example.com)'
    );
    expect(buildHostSearchFromIds(['host1', 'host3'])).toBe(
      'name ^ (host1, host3)'
    );
  });

  it('handles mixed numeric and hostname ids', () => {
    expect(buildHostSearchFromIds(['105', 'client.example.com'])).toBe(
      'id ^ (105) or name ^ (client.example.com)'
    );
  });
});
