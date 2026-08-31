import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import HostItem from '../components/HostItem';
import { HostItemFixtures } from './fixtures';

jest.unmock('foremanReact/components/common/ActionButtons/ActionButtons');

const renderHostItem = props =>
  render(
    <table>
      <tbody>
        <HostItem {...props} />
      </tbody>
    </table>
  );

describe('HostItem', () => {
  it('renders the host name as a link with the provided URL', () => {
    renderHostItem(HostItemFixtures.renders);

    expect(screen.getByRole('link', { name: 'Host1' })).toHaveAttribute(
      'href',
      '/host1'
    );
  });

  it('renders the host status', () => {
    renderHostItem(HostItemFixtures.renders);

    expect(screen.getByText('Succeeded')).toBeInTheDocument();
  });

  it('renders no action buttons when actions are empty', () => {
    renderHostItem(HostItemFixtures.renders);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders a disabled link when link is not provided', () => {
    renderHostItem({
      ...HostItemFixtures.renders,
      link: '',
    });

    expect(screen.getByRole('link', { name: 'Host1' })).toHaveAttribute(
      'href',
      '#'
    );
  });

  it('renders action buttons and calls action on click', async () => {
    const onClick = jest.fn();

    renderHostItem({
      ...HostItemFixtures.renders,
      actions: [{ title: 'View output', action: { onClick } }],
    });

    await userEvent.click(
      screen.getByRole('button', { name: 'View output' })
    );

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders failed status text for error status', () => {
    renderHostItem({
      ...HostItemFixtures.renders,
      status: 'error',
    });

    expect(screen.getByText('Failed')).toBeInTheDocument();
  });
});
