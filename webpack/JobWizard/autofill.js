import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { get } from 'foremanReact/redux/API';
import { HOST_IDS } from './JobWizardConstants';
import { selectRouterSearch } from './JobWizardSelectors';
import './JobWizard.scss';

export const useAutoFill = ({ setSelectedTargets, setHostsSearchQuery }) => {
  const fills = useSelector(selectRouterSearch);
  const dispatch = useDispatch();

  useEffect(() => {
    if (Object.keys(fills).length) {
      if (fills['host_ids[]']) {
        dispatch(
          get({
            key: HOST_IDS,
            url: '/api/hosts',
            params: { search: `id = ${fills['host_ids[]'].join(' or id = ')}` },
            handleSuccess: ({ data }) => {
              setSelectedTargets(currentTargets => ({
                ...currentTargets,
                hosts: (data.results || []).map(({ name }) => ({
                  id: name,
                  name,
                })),
              }));
            },
          })
        );
      }
      if (fills.search) {
        setHostsSearchQuery(fills.search);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
