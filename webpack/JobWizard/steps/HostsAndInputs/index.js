import React, { useEffect, useState } from 'react';
import {
  Title,
  Button,
  Form,
  FormGroup,
  InputGroup,
  Text,
  Spinner,
} from '@patternfly/react-core';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { FilterIcon } from '@patternfly/react-icons';
import { debounce } from 'lodash';
import { get } from 'foremanReact/redux/API';
import { translate as __ } from 'foremanReact/common/I18n';
import { resetData } from 'foremanReact/components/AutoComplete/AutoCompleteActions';
import {
  selectJobTemplate,
  selectWithKatello,
  selectHostCount,
} from '../../JobWizardSelectors';
import { SelectField } from '../form/SelectField';
import { SelectedChips } from './SelectedChips';
import { TemplateInputs } from './TemplateInputs';
import { HostSelect } from './HostSelect';
import { HostSearch } from './HostSearch';
import { HostPreviewModal } from './HostPreviewModal';
import {
  HOSTS,
  HOST_COLLECTIONS,
  HOST_GROUPS,
  hostMethods,
  hostsController,
  hostQuerySearchID,
  HOSTS_API,
  hostsToPreviewAmount,
} from '../../JobWizardConstants';

const buildQuery = (selected, search) => {
  const { hosts, hostCollections, hostGroups } = selected;
  const hostsSearch = `(name = ${hosts.join(' or name = ')})`;
  const hostCollectionsSearch = `(host_collection = ${hostCollections.join(
    ' or host_collection = '
  )})`;
  const hostGroupsSearch = `(host_group = ${hostGroups.join(
    ' or host_group = '
  )})`;
  return [
    hosts.length ? hostsSearch : false,
    hostCollections.length ? hostCollectionsSearch : false,
    hostGroups.length ? hostGroupsSearch : false,
    search.length ? `(${search})` : false,
  ]
    .filter(Boolean)
    .join(' or ');
};

const HostsAndInputs = ({
  templateValues,
  setTemplateValues,
  selected,
  setSelected,
  hostsSearchQuery,
  setHostsSearchQuery,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    debounce(() => {
      setIsLoading(true);
      dispatch(
        get({
          key: HOSTS_API,
          url: '/api/hosts',
          params: {
            search: buildQuery(selected, hostsSearchQuery),
            per_page: hostsToPreviewAmount,
          },
          handleSuccess: () => setIsLoading(false),
        })
      );
    }, 700)();
  }, [
    dispatch,
    selected,
    selected.hosts,
    selected.hostCollections,
    selected.hostCollections,
    hostsSearchQuery,
  ]);
  const templateInputs = useSelector(selectJobTemplate).template_inputs || [];
  const withKatello = useSelector(selectWithKatello);
  const hostCount = useSelector(selectHostCount);
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
  const [hostMethod, setHostMethod] = useState(hostMethods.hosts);
  const [hostPreviewOpen, setHostPreviewOpen] = useState(false);
  return (
    <div className="target-hosts-and-inputs">
      <HostPreviewModal
        isOpen={hostPreviewOpen}
        setIsOpen={setHostPreviewOpen}
        searchQuery={buildQuery(selected, hostsSearchQuery)}
      />
      <Title headingLevel="h2" className="wizard-title">
        {__('Target hosts and inputs')}
      </Title>
      <Form>
        <FormGroup fieldId="host_selection">
          <InputGroup>
            <SelectField
              className="target-method-select"
              toggleIcon={<FilterIcon />}
              fieldId="host_methods"
              options={Object.values(hostMethods)}
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
              <HostSelect
                selectedHosts={selectedHosts}
                setSelectedHosts={setSelectedHosts}
                apiKey={HOSTS}
                url="/api/hosts?per_page=100"
                placeholderText={__('Filter by hosts')}
              />
            )}
            {withKatello && hostMethod === hostMethods.hostCollections && (
              <HostSelect
                selectedHosts={selectedHostCollections}
                setSelectedHosts={setSelectedHostCollections}
                apiKey={HOST_COLLECTIONS}
                url="/katello/api/host_collections?per_page=100"
                placeholderText={__('Filter by host collections')}
              />
            )}
            {hostMethod === hostMethods.hostGroups && (
              <HostSelect
                selectedHosts={selectedHostGroups}
                setSelectedHosts={setSelectedHostGroups}
                apiKey={HOST_GROUPS}
                url="/api/hostgroups?per_page=100"
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
          <Button
            variant="link"
            isInline
            onClick={() => setHostPreviewOpen(true)}
          >
            {hostCount} {__('hosts')}
          </Button>{' '}
          {isLoading && <Spinner size="sm" />}
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
