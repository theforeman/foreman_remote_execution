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
      const { 'host_ids[]': hostIds, search, feature, ...rest } = { ...fills };
      setFills({});
      if (hostIds) {
        dispatch(
          get({
            key: HOST_IDS,
            url: '/api/hosts',
            params: { search: `id = ${hostIds.join(' or id = ')}` },
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
      if (search) {
        setHostsSearchQuery(search);
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
            setTemplateValues(prev => ({ ...prev, [input]: rest[key] }));
            setAdvancedValues(prev => ({
              ...prev,
              templateValues: { ...prev.templateValues, [input]: rest[key] },
            }));
          }
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fills]);
};
