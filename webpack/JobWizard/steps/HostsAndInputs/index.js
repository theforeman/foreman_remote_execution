import React, { useState } from 'react';
import { Button, Form, FormGroup } from '@patternfly/react-core';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { translate as __ } from 'foremanReact/common/I18n';
import { selectTemplateInputs } from '../../JobWizardSelectors';
import { SelectField } from '../form/SelectField';
import { SelectedChips } from './SelectedChips';
import { TemplateInputs } from './TemplateInputs';
import { WIZARD_TITLES } from '../../JobWizardConstants';
import { WizardTitle } from '../form/WizardTitle';

const HostsAndInputs = ({
  templateValues,
  setTemplateValues,
  selectedHosts,
  setSelectedHosts,
}) => {
  const templateInputs = useSelector(selectTemplateInputs);
  const hostMethods = [
    __('Hosts'),
    __('Host collection'),
    __('Host group'),
    __('Search query'),
  ];
  const [hostMethod, setHostMethod] = useState(hostMethods[0]);
  return (
    <>
      <WizardTitle title={WIZARD_TITLES.hostsAndInputs} />
      <Form>
        <FormGroup fieldId="host_selection">
          <SelectField
            fieldId="host_methods"
            options={hostMethods}
            setValue={setHostMethod}
            value={hostMethod}
          />
          <SelectedChips
            selected={selectedHosts}
            setSelected={setSelectedHosts}
          />
        </FormGroup>
        <span>
          {__('Apply to')}{' '}
          <Button variant="link" isInline>
            {selectedHosts.length} {__('hosts')}
          </Button>
        </span>
        <TemplateInputs
          inputs={templateInputs}
          value={templateValues}
          setValue={setTemplateValues}
        />
      </Form>
    </>
  );
};

HostsAndInputs.propTypes = {
  templateValues: PropTypes.object.isRequired,
  setTemplateValues: PropTypes.func.isRequired,
  selectedHosts: PropTypes.array.isRequired,
  setSelectedHosts: PropTypes.func.isRequired,
};

export default HostsAndInputs;
