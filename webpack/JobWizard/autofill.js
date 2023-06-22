import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { get } from 'foremanReact/redux/API';
import { HOST_IDS, REX_FEATURE, JOB_TEMPLATE } from './JobWizardConstants';
import './JobWizard.scss';
import { selectDefaultOutputTemplates } from './JobWizardSelectors';

export const useAutoFill = ({
  fills,
  setFills,
  setSelectedTargets,
  setHostsSearchQuery,
  setJobTemplateID,
  setOutputTemplates,
  setTemplateValues,
  setAdvancedValues,
}) => {
  const defaultTemplates = useSelector(selectDefaultOutputTemplates);
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
        dispatch(
          get({
            key: JOB_TEMPLATE,
            url: `/ui_job_wizard/template/${+templateID}`,
            handleSuccess: ({ data }) => {
              if (data) setOutputTemplates(data.default_output_templates || []);
            },
          })
        );
      }
      if (feature) {
        dispatch(
          get({
            key: REX_FEATURE,
            url: `/api/remote_execution_features/${feature}`,
            handleSuccess: ({ data }) => {
              setJobTemplateID(data.job_template_id);
              dispatch(
                get({
                  key: JOB_TEMPLATE,
                  url: `/ui_job_wizard/template/${data.job_template_id}`,
                  handleSuccess: ({ templateData }) => {
                    if (templateData)
                      setOutputTemplates(
                        templateData.default_output_templates || []
                      );
                  },
                })
              );
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
            } else {
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
    setOutputTemplates(defaultTemplates);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fills]);
};
