import React, { useEffect, useState } from 'react';
import { isEmpty, debounce } from 'lodash';
import {
  Alert,
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
import { get } from 'foremanReact/redux/API';
import { translate as __ } from 'foremanReact/common/I18n';
import {
  selectTemplateInputs,
  selectWithKatello,
  selectHostCount,
  selectHostsMissingPermissions,
  selectIsLoadingHosts,
} from '../../JobWizardSelectors';
import { SelectField } from '../form/SelectField';
import { SelectedChips } from './SelectedChips';
import { TemplateInputs } from './TemplateInputs';
import { HostSearch } from './HostSearch';
import { HostPreviewModal } from './HostPreviewModal';
import {
  WIZARD_TITLES,
  HOSTS,
  HOST_COLLECTIONS,
  HOST_GROUPS,
  hostMethods,
  HOSTS_API,
  HOSTS_TO_PREVIEW_AMOUNT,
  DEBOUNCE_API,
} from '../../JobWizardConstants';
import { WizardTitle } from '../form/WizardTitle';
import { SelectAPI } from './SelectAPI';
import { SelectGQL } from './SelectGQL';
import { buildHostQuery } from './buildHostQuery';

const HostsAndInputs = ({
  templateValues,
  setTemplateValues,
  selected,
  setSelected,
  hostsSearchQuery,
  setHostsSearchQuery,
}) => {
  const [hostMethod, setHostMethod] = useState(hostMethods.hosts);
  const isLoading = useSelector(selectIsLoadingHosts);
  const templateInputs = useSelector(selectTemplateInputs);
  const [hostPreviewOpen, setHostPreviewOpen] = useState(false);
  const [wasFocus, setWasFocus] = useState(false);
  const [isError, setIsError] = useState(false);
  useEffect(() => {
    if (wasFocus) {
      if (
        selected.hosts.length === 0 &&
        selected.hostCollections.length === 0 &&
        selected.hostGroups.length === 0 &&
        hostsSearchQuery.length === 0
      ) {
        setIsError(true);
      } else {
        setIsError(false);
      }
    }
  }, [
    hostMethod,
    hostsSearchQuery.length,
    selected,
    selected.hostCollections.length,
    selected.hostGroups.length,
    selected.hosts.length,
    wasFocus,
  ]);
  useEffect(() => {
    debounce(() => {
      dispatch(
        get({
          key: HOSTS_API,
          url: '/api/hosts',
          params: {
            search: buildHostQuery(selected, hostsSearchQuery),
            per_page: HOSTS_TO_PREVIEW_AMOUNT,
          },
        })
      );
    }, DEBOUNCE_API)();
  }, [
    dispatch,
    selected,
    selected.hosts,
    selected.hostCollections,
    selected.hostCollections,
    hostsSearchQuery,
  ]);
  const withKatello = useSelector(selectWithKatello);
  const hostCount = useSelector(selectHostCount);
  const missingPermissions = useSelector(selectHostsMissingPermissions);
  const dispatch = useDispatch();

  const selectedHosts = selected.hosts;
  const setLabel = result => result.displayName || result.name;
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
    setHostsSearchQuery('');
  };
  const [errorText, setErrorText] = useState(
    __('Please select at least one host')
  );

  return (
    <div className="target-hosts-and-inputs">
      <WizardTitle title={WIZARD_TITLES.hostsAndInputs} />
      {hostPreviewOpen && (
        <HostPreviewModal
          isOpen={hostPreviewOpen}
          setIsOpen={setHostPreviewOpen}
          searchQuery={buildHostQuery(selected, hostsSearchQuery)}
        />
      )}
      <Form>
        <FormGroup
          fieldId="host_selection"
          id="host-selection"
          helperTextInvalid={errorText}
          validated={isError ? 'error' : 'default'}
        >
          <InputGroup onBlur={() => setWasFocus(true)}>
            <SelectField
              isRequired
              className="target-method-select"
              toggleIcon={<FilterIcon />}
              fieldId="host_methods"
              options={Object.values(hostMethods).filter(method => {
                if (method === hostMethods.hostCollections && !withKatello) {
                  return false;
                }
                return true;
              })}
              setValue={val => {
                setHostMethod(val);
                if (val === hostMethods.searchQuery) {
                  setErrorText(__('Please enter a search query'));
                }
                if (val === hostMethods.hosts) {
                  setErrorText(__('Please select at least one host'));
                }
                if (val === hostMethods.hostCollections) {
                  setErrorText(
                    __('Please select at least one host collection')
                  );
                }
                if (val === hostMethods.hostGroups) {
                  setErrorText(__('Please select at least one host group'));
                }
              }}
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
                setLabel={setLabel}
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
                setLabel={setLabel}
              />
            )}
            {hostMethod === hostMethods.hostGroups && (
              <SelectGQL
                selected={selectedHostGroups}
                setSelected={setSelectedHostGroups}
                apiKey={HOST_GROUPS}
                name="host groups"
                placeholderText={__('Filter by host groups')}
                setLabel={setLabel}
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
          setLabel={setLabel}
        />
        <Text ouiaId="host-preview-label">
          {__('Apply to')}{' '}
          <Button
            ouiaId="host-preview-open-button"
            variant="link"
            isInline
            onClick={() => setHostPreviewOpen(true)}
            isDisabled={isLoading}
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
        {!isEmpty(missingPermissions) && (
          <Alert
            ouiaId="host-access-denied"
            variant="warning"
            title={__('Access denied')}
          >
            <span>
              {__(
                `Missing the required permissions: ${missingPermissions.join(
                  ', '
                )}`
              )}
            </span>
          </Alert>
        )}
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
