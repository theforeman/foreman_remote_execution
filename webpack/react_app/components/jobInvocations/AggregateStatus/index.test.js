import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import AggregateStatus from './index';

const defaultStatuses = {
  success: 19,
  failed: 20,
  pending: 3,
  cancelled: 31,
};

const renderAggregateStatus = ({
  statuses = defaultStatuses,
  chartFilter = jest.fn(),
} = {}) => {
  const view = render(
    <AggregateStatus statuses={statuses} chartFilter={chartFilter} />
  );

  return { chartFilter, ...view };
};

describe('AggregateStatus', () => {
  it('renders status notifications without counts when statuses are empty', () => {
    const { container } = renderAggregateStatus({ statuses: {} });

    expect(container.textContent.trim()).toBe('');
  });

  it('renders status counts from props', () => {
    renderAggregateStatus();

    expect(screen.getByText('19')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('31')).toBeInTheDocument();
  });

  it('calls chartFilter with success when the success count is clicked', async () => {
    const { chartFilter } = renderAggregateStatus();

    await userEvent.click(screen.getByText('19'));

    expect(chartFilter).toHaveBeenCalledTimes(1);
    expect(chartFilter).toHaveBeenCalledWith('success');
  });

  it('calls chartFilter with failed when the failed count is clicked', async () => {
    const { chartFilter } = renderAggregateStatus();

    await userEvent.click(screen.getByText('20'));

    expect(chartFilter).toHaveBeenCalledTimes(1);
    expect(chartFilter).toHaveBeenCalledWith('failed');
  });

  it('calls chartFilter with pending when the pending count is clicked', async () => {
    const { chartFilter } = renderAggregateStatus();

    await userEvent.click(screen.getByText('3'));

    expect(chartFilter).toHaveBeenCalledTimes(1);
    expect(chartFilter).toHaveBeenCalledWith('pending');
  });

  it('calls chartFilter with cancelled when the cancelled count is clicked', async () => {
    const { chartFilter } = renderAggregateStatus();

    await userEvent.click(screen.getByText('31'));

    expect(chartFilter).toHaveBeenCalledTimes(1);
    expect(chartFilter).toHaveBeenCalledWith('cancelled');
  });
});
