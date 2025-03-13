import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { SelectVariant } from '@patternfly/react-core/deprecated';
import {
  useForemanOrganization,
  useForemanLocation,
} from 'foremanReact/Root/Context/ForemanContext';
import { decodeId } from 'foremanReact/common/globalIdHelpers';
import { HOSTS, HOST_GROUPS, dataName } from '../../JobWizardConstants';
import { SearchSelect } from '../form/SearchSelect';
import hostsQuery from './hosts.gql';
import hostgroupsQuery from './hostgroups.gql';

export const useNameSearchGQL = apiKey => {
  const org = useForemanOrganization();
  const location = useForemanLocation();
  const [search, setSearch] = useState('');
  const queries = {
    [HOSTS]: hostsQuery,
    [HOST_GROUPS]: hostgroupsQuery,
  };
  const { loading, data } = useQuery(queries[apiKey], {
    variables: {
      search: [
        `name~"${search}"`,
        org ? `organization_id=${org.id}` : null,
        location ? `location_id=${location.id}` : null,
      ]
        .filter(i => i)
        .join(' and '),
    },
  });
  return [
    setSearch,
    {
      subtotal: data?.[dataName[apiKey]]?.totalCount,
      results:
        data?.[dataName[apiKey]]?.nodes.map(node => ({
          id: decodeId(node.id),
          name: node.name,
          displayName: node.displayName,
        })) || [],
    },
    loading,
  ];
};

export const SelectGQL = props => (
  <SearchSelect
    {...props}
    variant={SelectVariant.typeaheadMulti}
    useNameSearch={useNameSearchGQL}
  />
);
