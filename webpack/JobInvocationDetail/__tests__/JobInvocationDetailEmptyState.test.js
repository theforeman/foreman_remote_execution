import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import JobInvocationEmptyState from '../JobInvocationEmptyState';
import { createForemanContextWrapper } from './foremanTestHelpers';

describe('JobInvocationEmptyState', () => {
  it('renders the failed load empty state for a job invocation', () => {
    const jobInvocationId = '99';
    const errorMessage = 'Record not found';
    const history = createMemoryHistory();
    const ForemanContextWrapper = createForemanContextWrapper();

    render(
      <Router history={history}>
        <ForemanContextWrapper>
          <JobInvocationEmptyState
            jobInvocationId={jobInvocationId}
            httpStatus={404}
            errorMessage={errorMessage}
          />
        </ForemanContextWrapper>
      </Router>
    );

    expect(
      screen.getByRole('heading', {
        name: 'Unable to load job invocation',
        level: 5,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        (_, element) =>
          element?.tagName === 'P' &&
          element.textContent?.includes(
            `The job invocation with id ${jobInvocationId} could not be found. It may have been deleted or may not be available in your current organization or location scope.`
          )
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(`Server returned: ${errorMessage}`)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Go to job invocations' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Create a new job invocation' })
    ).toBeInTheDocument();
  });
});
