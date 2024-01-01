import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { SearchSelect } from '../SearchSelect';

const apiKey = 'HOSTS_KEY';

describe('SearchSelect', () => {
  it('too many', () => {
    const onSearch = jest.fn();
    const setLabel = jest.fn();
    render(
      <SearchSelect
        selected={['hosts1,host2']}
        setSelected={jest.fn()}
        apiKey={apiKey}
        url="/hosts"
        placeholderText="Test hosts"
        useNameSearch={() => [
          onSearch,
          { results: ['host1', 'host2', 'host3'], subtotal: 101 },
          false,
        ]}
        setLabel={setLabel}
      />
    );
    const openSelectbutton = screen.getByRole('button', {
      name: 'typeahead select toggle',
    });
    fireEvent.click(openSelectbutton);
    const tooMany = screen.queryAllByText(
      'You have %s results to display. Showing first %s results + 101 + 100'
    );
    expect(tooMany).toHaveLength(1);
  });
});
