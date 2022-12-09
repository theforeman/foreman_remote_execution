import React from 'react';
import { shallow } from '@theforeman/test';
import AggregateStatus from './index';

jest.unmock('./index.js');

describe('AggregateStatus', () => {
  describe('has no data', () => {
    it('renders cards with no data', () => {
      const chartNumbers = shallow(
        <AggregateStatus statuses={{}} chartFilter={_x => {}} />
      );
      const success = chartNumbers.find('#success_count').text();
      const failed = chartNumbers.find('#failed_count').text();
      const pending = chartNumbers.find('#pending_count').text();
      const cancelled = chartNumbers.find('#cancelled_count').text();
      expect(success).toBe('');
      expect(failed).toBe('');
      expect(cancelled).toBe('');
      expect(pending).toBe('');
    });

    it('renders cards with props passed', () => {
      const statuses = {
        success: 19,
        failed: 20,
        cancelled: 31,
        pending: 3,
      };
      const chartNumbers = shallow(
        <AggregateStatus statuses={statuses} chartFilter={_x => {}} />
      );
      const success = chartNumbers.find('#success_count').text();
      const failed = chartNumbers.find('#failed_count').text();
      const pending = chartNumbers.find('#pending_count').text();
      const cancelled = chartNumbers.find('#cancelled_count').text();
      expect(success).toBe(statuses.success.toString());
      expect(failed).toBe(statuses.failed.toString());
      expect(cancelled).toBe(statuses.cancelled.toString());
      expect(pending).toBe(statuses.pending.toString());
    });
  });
});
