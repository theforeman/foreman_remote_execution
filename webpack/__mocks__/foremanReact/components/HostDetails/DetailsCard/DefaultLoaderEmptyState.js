import React from 'react';
import { translate as __ } from '../../../common/I18n';

const DefaultLoaderEmptyState = () => (
  <span className="disabled-text">{__('Not available')}</span>
);

export default DefaultLoaderEmptyState;
