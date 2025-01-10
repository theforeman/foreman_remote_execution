import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';

export const OutputCodeBlock = ({ code, showOutputType, scrollElement }) => {
  let lineCounter = 0;
  // eslint-disable-next-line no-control-regex
  const COLOR_PATTERN = /\x1b\[(\d+)m/g;
  const CONSOLE_COLOR = {
    '31': 'red',
    '32': 'lightgreen',
    '33': 'orange',
    '34': 'deepskyblue',
    '35': 'mediumpurple',
    '36': 'cyan',
    '37': 'grey',
    '91': 'red',
    '92': 'lightgreen',
    '93': 'yellow',
    '94': 'lightblue',
    '95': 'violet',
    '96': 'turquoise',
    '0': 'default',
  };

  const colorizeLine = line => {
    line = line.replace(COLOR_PATTERN, seq => {
      const color = seq.match(/(\d+)m/)[1];
      return `{{{format color:${color}}}}`;
    });

    let currentColor = 'default';
    const parts = line.split(/({{{format.*?}}})/).filter(Boolean);
    if (parts.length === 0) {
      return <span>{'\n'}</span>;
    }
    // eslint-disable-next-line array-callback-return, consistent-return
    return parts.map((consoleLine, index) => {
      if (consoleLine.includes('{{{format')) {
        const colorMatch = consoleLine.match(/color:(\d+)/);
        if (colorMatch) {
          const colorIndex = colorMatch[1];
          currentColor = CONSOLE_COLOR[colorIndex] || 'default';
        }
      } else {
        return (
          <span key={index} style={{ color: currentColor }}>
            {consoleLine.length ? consoleLine : '\n'}
          </span>
        );
      }
    });
  };
  const filteredCode = code.filter(
    ({ output_type: outputType }) => showOutputType[outputType]
  );
  if (!filteredCode.length) {
    return <div>{__('No output for the selected filters')}</div>;
  }
  const codeParse = filteredCode.map(line => {
    if (line.output === '\n') {
      return null;
    }
    const lineOutputs = line.output
      .replace(/\r\n/g, '\n')
      .replace(/\n$/, '')
      .split('\n');
    return lineOutputs.map((lineOutput, index) => {
      lineCounter += 1;
      return (
        <div key={index} className={`line ${line.output_type}`}>
          <span
            className="counter"
            title={new Date(line.timestamp * 1000).toISOString()}
          >
            {lineCounter.toString().padStart(4, '\u00A0')}:{' '}
          </span>
          <div className="content">{colorizeLine(lineOutput)}</div>
        </div>
      );
    });
  });
  const scrollElementSeleceted = () => document.querySelector(scrollElement);
  const onClickScrollToTop = () => {
    scrollElementSeleceted().scrollTo(0, 0);
  };
  const onClickScrollToBottom = () => {
    scrollElementSeleceted().scrollTo(0, scrollElementSeleceted().scrollHeight);
  };
  return (
    <div className="invocation-output">
      <Button
        component="a"
        href="#"
        variant="link"
        isInline
        className="scroll-link"
        onClick={onClickScrollToBottom}
        ouiaId="scroll-to-bottom"
      >
        {__('Scroll to bottom')}
      </Button>
      {codeParse}
      <Button
        component="a"
        href="#"
        variant="link"
        isInline
        className="scroll-link"
        onClick={onClickScrollToTop}
        ouiaId="scroll-to-top"
      >
        {__('Scroll to top')}
      </Button>
    </div>
  );
};

OutputCodeBlock.propTypes = {
  code: PropTypes.array.isRequired,
  showOutputType: PropTypes.object.isRequired,
  scrollElement: PropTypes.string.isRequired,
};
