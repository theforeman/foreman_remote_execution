import React from 'react';
import { Popover } from '@patternfly/react-core';
import { HelpIcon } from '@patternfly/react-icons';
import { translate as __ } from 'foremanReact/common/I18n';

export const helpLabel = (text, id) => {
  if (!text) return null;
  return (
    <Popover id={`${id}-help`} bodyContent={text} aria-label="help-text">
      <button
        type="button"
        aria-label={__('open-help-tooltip-button')}
        onClick={e => e.preventDefault()}
        className="pf-c-form__group-label-help"
      >
        <HelpIcon noVerticalAlign />
      </button>
    </Popover>
  );
};

export const isPositiveNumber = text => parseInt(text, 10) > 0;

export const isValidDate = d => d instanceof Date && !Number.isNaN(d);
