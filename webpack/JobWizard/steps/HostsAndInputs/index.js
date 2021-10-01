import React, { useState } from 'react';
import {
  Button,
  Form,
  FormGroup,
  InputGroup,
  Text,
} from '@patternfly/react-core';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { FilterIcon } from '@patternfly/react-icons';
import { translate as __ } from 'foremanReact/common/I18n';
import { resetData } from 'foremanReact/components/AutoComplete/AutoCompleteActions';
import {
  selectTemplateInputs,
  selectWithKatello,
} from '../../JobWizardSelectors';
import { SelectField } from '../form/SelectField';
import { SelectedChips } from './SelectedChips';
import { TemplateInputs } from './TemplateInputs';
import {
  WIZARD_TITLES,
  HOSTS,
  HOST_COLLECTIONS,
  HOST_GROUPS,
  hostMethods,
  hostsController,
  hostQuerySearchID,
} from '../../JobWizardConstants';
import { WizardTitle } from '../form/WizardTitle';
import { HostSearch } from './HostSearch';
import { SelectAPI } from './SelectAPI';
import { SelectGQL } from './SelectGQL';

const HostsAndInputs = ({
  templateValues,
  setTemplateValues,
  selected,
  setSelected,
  hostsSearchQuery,
  setHostsSearchQuery,
}) => {
  const [hostMethod, setHostMethod] = useState(hostMethods.hosts);
  const templateInputs = useSelector(selectTemplateInputs);
  const withKatello = useSelector(selectWithKatello);
  const dispatch = useDispatch();

  const selectedHosts = selected.hosts;
  const setSelectedHosts = newSelected =>
    setSelected(prevSelected => ({
      ...prevSelected,
      hosts: newSelected(prevSelected.hosts),
    }));
  const selectedHostCollections = selected.hostCollections;
  const setSelectedHostCollections = newSelected =>
    setSelected(prevSelected => ({
      ...prevSelected,
      hostCollections: newSelected(prevSelected.hostCollections),
    }));
  const selectedHostGroups = selected.hostGroups;
  const setSelectedHostGroups = newSelected => {
    setSelected(prevSelected => ({
      ...prevSelected,
      hostGroups: newSelected(prevSelected.hostGroups),
    }));
  };

  const clearSearch = () => {
    dispatch(resetData(hostsController, hostQuerySearchID));
    setHostsSearchQuery('');
  };
  return (
    <div className="target-hosts-and-inputs">
      <WizardTitle title={WIZARD_TITLES.hostsAndInputs} />
      <Form>
        <FormGroup fieldId="host_selection" id="host-selection">
          <InputGroup>
            <SelectField
              className="target-method-select"
              toggleIcon={<FilterIcon />}
              fieldId="host_methods"
              options={Object.values(hostMethods).filter(method => {
                if (method === hostMethods.hostCollections && !withKatello) {
                  return false;
                }
                return true;
              })}
              setValue={setHostMethod}
              value={hostMethod}
            />
            {hostMethod === hostMethods.searchQuery && (
              <HostSearch
                setValue={setHostsSearchQuery}
                value={hostsSearchQuery}
              />
            )}
            {hostMethod === hostMethods.hosts && (
              <SelectGQL
                selected={selectedHosts}
                setSelected={setSelectedHosts}
                apiKey={HOSTS}
                name="hosts"
                placeholderText={__('Filter by hosts')}
              />
            )}
            {hostMethod === hostMethods.hostCollections && (
              <SelectAPI
                selected={selectedHostCollections}
                setSelected={setSelectedHostCollections}
                apiKey={HOST_COLLECTIONS}
                name="host collections"
                url="/katello/api/host_collections?per_page=100"
                placeholderText={__('Filter by host collections')}
              />
            )}
            {hostMethod === hostMethods.hostGroups && (
              <SelectGQL
                selected={selectedHostGroups}
                setSelected={setSelectedHostGroups}
                apiKey={HOST_GROUPS}
                name="host groups"
                placeholderText={__('Filter by host groups')}
              />
            )}
          </InputGroup>
        </FormGroup>
        <SelectedChips
          selectedHosts={selectedHosts}
          setSelectedHosts={setSelectedHosts}
          selectedHostCollections={selectedHostCollections}
          setSelectedHostCollections={setSelectedHostCollections}
          selectedHostGroups={selectedHostGroups}
          setSelectedHostGroups={setSelectedHostGroups}
          hostsSearchQuery={hostsSearchQuery}
          clearSearch={clearSearch}
        />
        <Text>
          {__('Apply to')}{' '}
          <Button variant="link" isInline>
            {selectedHosts.length} {__('hosts')}
          </Button>
        </Text>
        <TemplateInputs
          inputs={templateInputs}
          value={templateValues}
          setValue={setTemplateValues}
        />
      </Form>
    </div>
  );
};

HostsAndInputs.propTypes = {
  templateValues: PropTypes.object.isRequired,
  setTemplateValues: PropTypes.func.isRequired,
  selected: PropTypes.shape({
    hosts: PropTypes.array.isRequired,
    hostCollections: PropTypes.array.isRequired,
    hostGroups: PropTypes.array.isRequired,
  }).isRequired,
  setSelected: PropTypes.func.isRequired,
  hostsSearchQuery: PropTypes.string.isRequired,
  setHostsSearchQuery: PropTypes.func.isRequired,
};

export default HostsAndInputs;
