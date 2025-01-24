import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { OutputCodeBlock } from '../TemplateInvocationComponents/OutputCodeBlock';
import { jobInvocationOutput } from './fixtures';

const mockShowOutputType = {
  stdout: true,
  stderr: true,
  debug: true,
};

describe('OutputCodeBlock', () => {
  beforeAll(() => {
    Element.prototype.scrollTo = () => {};
  });
  afterAll(() => {
    delete Element.prototype.scrollTo;
  });
  test('displays the correct output', () => {
    render(
      <OutputCodeBlock
        code={jobInvocationOutput}
        showOutputType={mockShowOutputType}
        scrollElement="body"
      />
    );

    expect(screen.getByText('3:')).toBeInTheDocument();
    expect(screen.getByText('This is red text')).toHaveStyle('color: red');
    expect(screen.getByText('This is green text')).toHaveStyle(
      'color: lightgreen'
    );
  });

  test('displays no output message when filtered', () => {
    render(
      <OutputCodeBlock
        code={jobInvocationOutput}
        showOutputType={{ stdout: false, stderr: false, debug: false }}
        scrollElement="body"
      />
    );

    expect(
      screen.getByText('No output for the selected filters')
    ).toBeInTheDocument();
  });

  test('scrolls to top and bottom', async () => {
    render(
      <div className="template-invocation">
        <div className="invocation-output" style={{ overflow: 'auto' }}>
          <OutputCodeBlock
            code={jobInvocationOutput}
            showOutputType={mockShowOutputType}
            scrollElement=".invocation-output"
          />
        </div>
      </div>
    );

    const scrollToTopButton = screen.getByText('Scroll to top');
    const scrollToBottomButton = screen.getByText('Scroll to bottom');

    fireEvent.click(scrollToTopButton);
    fireEvent.click(scrollToBottomButton);
  });
});
