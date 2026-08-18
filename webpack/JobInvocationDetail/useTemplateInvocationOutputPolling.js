import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
// eslint-disable-next-line import/no-extraneous-dependencies
import API from 'foremanReact/API';
import { translate as __ } from 'foremanReact/common/I18n';
import { addToast } from 'foremanReact/components/ToastsList';
import { APIActions } from 'foremanReact/redux/API';
import {
  GET_TEMPLATE_INVOCATION,
  OUTPUT_MAX_REFRESH_INTERVAL_MS,
  OUTPUT_REFRESH_INTERVAL_MS,
  showTemplateInvocationUrl,
  templateInvocationOutputUrl,
} from './JobInvocationConstants';
import {
  getLastOutputTimestamp,
  mergeOutput,
} from './TemplateInvocationHelpers';

export const useTemplateInvocationOutputPolling = ({
  hostID,
  jobID,
  isExpanded,
  response,
}) => {
  const dispatch = useDispatch();
  const responseOutput = response?.output;
  const responseFinished = response?.finished || false;
  const hostFinishedRef = useRef(response?.finished || false);
  const [liveOutput, setLiveOutput] = useState(responseOutput || []);
  const lastTimestampRef = useRef(getLastOutputTimestamp(responseOutput || []));
  const syncResponseRef = useRef(true);
  const hasCachedOutput = Array.isArray(responseOutput);

  const replaceOutput = useCallback(output => {
    const nextOutput = Array.isArray(output) ? output : [];
    lastTimestampRef.current = getLastOutputTimestamp(nextOutput);
    setLiveOutput(nextOutput);
  }, []);

  const appendOutput = useCallback(output => {
    const nextOutput = Array.isArray(output) ? output : [];
    const lastTimestamp = getLastOutputTimestamp(nextOutput);
    if (lastTimestamp !== null && lastTimestamp !== undefined) {
      lastTimestampRef.current = lastTimestamp;
    }
    setLiveOutput(currentOutput => mergeOutput(currentOutput, nextOutput));
  }, []);

  useEffect(() => {
    if (syncResponseRef.current && Array.isArray(responseOutput)) {
      replaceOutput(responseOutput);
      syncResponseRef.current = false;
    }
    if (responseFinished) hostFinishedRef.current = true;
  }, [replaceOutput, responseFinished, responseOutput]);

  useEffect(() => {
    let cancelled = false;
    let timeoutId = null;
    let idlePolls = 0;
    let outputErrorShown = false;
    const detailsURL = showTemplateInvocationUrl(hostID, jobID);
    const outputURL = templateInvocationOutputUrl(hostID, jobID);

    const scheduleNextPoll = newOutput => {
      idlePolls = newOutput.length ? 0 : idlePolls + 1;
      const interval = Math.min(
        OUTPUT_REFRESH_INTERVAL_MS * Math.max(idlePolls, 1),
        OUTPUT_MAX_REFRESH_INTERVAL_MS
      );
      timeoutId = setTimeout(scheduleOutputPoll, interval);
    };

    async function scheduleOutputPoll() {
      if (cancelled) return;
      const isDocumentVisible =
        document.visibilityState === 'visible' ||
        document.visibilityState === 'prerender';
      if (!isDocumentVisible) {
        timeoutId = setTimeout(scheduleOutputPoll, OUTPUT_REFRESH_INTERVAL_MS);
        return;
      }
      try {
        const { data } = await API.get(outputURL, {
          params:
            lastTimestampRef.current === null
              ? {}
              : { since: lastTimestampRef.current },
        });
        if (cancelled) return;

        outputErrorShown = false;
        const newOutput = Array.isArray(data?.output) ? data.output : [];
        appendOutput(newOutput);
        if (data?.refresh) {
          scheduleNextPoll(newOutput);
        } else {
          hostFinishedRef.current = true;
          timeoutId = null;
          fetchDetails(false);
        }
      } catch (error) {
        if (cancelled) return;
        if (!outputErrorShown) {
          dispatch(
            addToast({
              key: `template-invocation-output-error-${hostID}`,
              type: 'danger',
              message:
                // eslint-disable-next-line camelcase
                error?.response?.data?.error?.full_messages?.[0] ||
                error?.response?.data?.error?.message ||
                __('Failed to load live job output'),
            })
          );
          outputErrorShown = true;
        }
        scheduleNextPoll([]);
      }
    }

    function fetchDetails(pollOutput = true) {
      if (cancelled) return;
      dispatch(
        APIActions.get({
          url: detailsURL,
          key: `${GET_TEMPLATE_INVOCATION}_${hostID}`,
          handleSuccess: ({ data }) => {
            if (cancelled) return;
            replaceOutput(data?.output || []);
            const isFinished = data?.finished ?? true;
            // eslint-disable-next-line camelcase
            const autoRefresh = data?.auto_refresh || false;
            if (pollOutput && !isFinished && autoRefresh) {
              hostFinishedRef.current = false;
              idlePolls = 0;
              timeoutId = setTimeout(
                scheduleOutputPoll,
                OUTPUT_REFRESH_INTERVAL_MS
              );
            } else {
              timeoutId = null;
            }
          },
          handleError: () => {
            if (cancelled) return;
            timeoutId = null;
          },
          errorToast: ({ response: errorResponse }) =>
            // eslint-disable-next-line camelcase
            errorResponse?.data?.error?.full_messages?.[0] ||
            errorResponse?.data?.error?.message ||
            __('Failed to load template invocation details'),
        })
      );
    }

    if (isExpanded) {
      if (hostFinishedRef.current || responseFinished) return undefined;
      if (hasCachedOutput) {
        scheduleOutputPoll();
      } else {
        fetchDetails();
      }
    }

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [
    appendOutput,
    dispatch,
    hasCachedOutput,
    hostID,
    isExpanded,
    jobID,
    replaceOutput,
    responseFinished,
  ]);

  return liveOutput;
};
