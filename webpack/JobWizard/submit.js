import { post } from 'foremanReact/redux/API';
import { repeatTypes, JOB_INVOCATION } from './JobWizardConstants';
import { buildHostQuery } from './steps/HostsAndInputs/buildHostQuery';

export const submit = ({
  jobTemplateID,
  templateValues,
  advancedValues,
  scheduleValue,
  selectedTargets,
  hostsSearchQuery,
  location,
  organization,
  feature,
  provider,
  advancedInputs,
  dispatch,
}) => {
  const {
    repeatAmount,
    repeatType,
    repeatData,
    startsAt,
    startsBefore,
    ends,
    purpose,
  } = scheduleValue;
  const {
    sshUser,
    effectiveUserValue,
    effectiveUserPassword,
    description,
    timeoutToKill,
    isRandomizedOrdering,
    concurrencyLevel,
    templateValues: advancedTemplateValues,
    password,
    keyPassphrase,
    timeToPickup,
  } = advancedValues;
  const providerInputs = advancedInputs.filter(v => v.provider_input);
  const providerValues = {};
  providerInputs.forEach(({ name }) => {
    providerValues[name] = advancedTemplateValues[name];
    delete advancedTemplateValues[name];
  });

  const getCronLine = () => {
    const [hour, minute] = repeatData.at
      ? repeatData.at.split(':')
      : [null, null];
    switch (repeatType) {
      case repeatTypes.cronline:
        return repeatData.cronline;
      case repeatTypes.monthly:
        return `${minute} ${hour} ${repeatData.days} * *`;
      case repeatTypes.weekly: {
        const daysKeys = Object.keys(repeatData.daysOfWeek).filter(
          k => repeatData.daysOfWeek[k]
        );
        const days = daysKeys.join(',');
        return `${minute} ${hour} * * ${days}`;
      }
      case repeatTypes.daily:
        return `${minute} ${hour} * * *`;
      case repeatTypes.hourly:
        return `${repeatData.minute} * * * *`;
      case repeatTypes.noRepeat:
      default:
        return null;
    }
  };
  const api = {
    location,
    organization,
    job_invocation: {
      job_template_id: feature ? null : jobTemplateID,
      targeting_type: scheduleValue?.isTypeStatic
        ? 'static_query'
        : 'dynamic_query',
      randomized_ordering: isRandomizedOrdering,
      inputs: { ...templateValues, ...advancedTemplateValues },
      ssh_user: sshUser || null,
      ssh: {
        effective_user: effectiveUserValue,
        effective_user_password: effectiveUserPassword,
      },
      password,
      key_passphrase: keyPassphrase,
      recurrence:
        repeatType !== repeatTypes.noRepeat
          ? {
              cron_line: getCronLine(),
              max_iteration: repeatAmount,
              end_time: ends?.length ? new Date(ends).toISOString() : null,
              purpose,
            }
          : null,
      scheduling:
        startsAt?.length || startsBefore?.length
          ? {
              start_at: startsAt?.length
                ? new Date(startsAt).toISOString()
                : null,
              start_before: startsBefore?.length
                ? new Date(startsBefore).toISOString()
                : null,
            }
          : null,
      concurrency_control: {
        concurrency_level: concurrencyLevel,
      },
      bookmark_id: null,
      search_query: buildHostQuery(selectedTargets, hostsSearchQuery),
      description_format: description,
      execution_timeout_interval: timeoutToKill,
      feature,
      time_to_pickup: timeToPickup,
    },
  };
  if (Object.keys(providerValues).length) {
    api.job_invocation[provider] = providerValues;
  }

  dispatch(
    post({
      key: JOB_INVOCATION,
      url: '/api/job_invocations',
      params: api,
      handleSuccess: ({ data: { id } }) => {
        window.location.href = `/job_invocations/${id}`;
      },
      errorToast: ({ response }) =>
        response?.data?.error?.message ||
        response?.message ||
        response?.statusText,
    })
  );
};
