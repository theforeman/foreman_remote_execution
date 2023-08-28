import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { get } from 'foremanReact/redux/API';
import { HOST_IDS, REX_FEATURE } from './JobWizardConstants';
import './JobWizard.scss';

export const useAutoFill = ({
  fills,
  setFills,
  setSelectedTargets,
  setHostsSearchQuery,
  setJobTemplateID,
  setTemplateValues,
  setAdvancedValues,
}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (Object.keys(fills).length) {
      const {
        'host_ids[]': hostIds,
        search,
        feature,
        template_id: templateID,
        ...rest
      } = { ...fills };
      setFills({});
      if (hostIds) {
        const hostSearch = Array.isArray(hostIds)
          ? `id = ${hostIds.join(' or id = ')}`
          : `id = ${hostIds}`;
        dispatch(
          get({
            key: HOST_IDS,
            url: '/api/hosts',
            params: {
              search: hostSearch,
            },
            handleSuccess: ({ data }) => {
              setSelectedTargets(currentTargets => ({
                ...currentTargets,
                hosts: (data.results || []).map(({ id, name }) => ({
                  id,
                  name,
                })),
              }));
            },
          })
        );
      }
      if ((search || search === '') && !hostIds?.length) {
        // replace an empty string search with a dummy search query to match all hosts
        // but only if search query was entered (based on presence of :search parameter)
        const hostSearch = search === '' ? "name != ''" : search;
        setHostsSearchQuery(hostSearch);
      }
      if (templateID) {
        setJobTemplateID(+templateID);
      }
      if (feature) {
        dispatch(
          get({
            key: REX_FEATURE,
            url: `/api/remote_execution_features/${feature}`,
            handleSuccess: ({ data }) => {
              setJobTemplateID(data.job_template_id);
            },
          })
        );
      }
      if (rest) {
        Object.keys(rest).forEach(key => {
          const re = /inputs\[(?<input>.*)\]/g;
          const input = re.exec(key)?.groups?.input;
          if (input) {
            if (typeof rest[key] === 'string') {
              setTemplateValues(prev => ({ ...prev, [input]: rest[key] }));
              setAdvancedValues(prev => ({ ...prev, [input]: rest[key] }));
            } else if (rest[key].value !== null) {
              const { value, advanced } = rest[key];
              if (advanced) {
                setAdvancedValues(prev => ({
                  ...prev,
                  templateValues: { ...prev.templateValues, [input]: value },
                }));
              } else {
                setTemplateValues(prev => ({ ...prev, [input]: value }));
              }
            }
          }
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fills]);
};
