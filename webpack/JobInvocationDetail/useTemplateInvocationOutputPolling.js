import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { APIActions } from 'foremanReact/redux/API';
import {
  GET_TEMPLATE_INVOCATION,
  GET_TEMPLATE_INVOCATION_OUTPUT,
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
  const timeoutRef = useRef(null);
  const responseRef = useRef(response);
  const hostFinishedRef = useRef(response?.finished || false);
  const [liveOutput, setLiveOutput] = useState(response?.output || []);
  const lastTimestampRef = useRef(
    getLastOutputTimestamp(response?.output || [])
  );

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
    responseRef.current = response;
    if (Array.isArray(response?.output)) replaceOutput(response.output);
    if (response?.finished) hostFinishedRef.current = true;
  }, [replaceOutput, response]);

  useEffect(() => {
    let cancelled = false;
    const detailsURL = showTemplateInvocationUrl(hostID, jobID);
    const outputURL = templateInvocationOutputUrl(hostID, jobID);

    function scheduleOutputPoll() {
      if (cancelled) return;
      const isDocumentVisible =
        document.visibilityState === 'visible' ||
        document.visibilityState === 'prerender';
      if (!isDocumentVisible) {
        timeoutRef.current = setTimeout(
          scheduleOutputPoll,
          OUTPUT_REFRESH_INTERVAL_MS
        );
        return;
      }
      dispatch(
        APIActions.get({
          url: outputURL,
          key: `${GET_TEMPLATE_INVOCATION_OUTPUT}_${hostID}`,
          params:
            lastTimestampRef.current === null
              ? {}
              : { since: lastTimestampRef.current },
          handleSuccess: ({ data }) => {
            if (cancelled) return;
            appendOutput(data?.output || []);
            if (data?.refresh) {
              timeoutRef.current = setTimeout(
                scheduleOutputPoll,
                OUTPUT_REFRESH_INTERVAL_MS
              );
            } else {
              hostFinishedRef.current = true;
              timeoutRef.current = null;
              fetchDetails(false);
            }
          },
          handleError: () => {
            if (cancelled) return;
            timeoutRef.current = null;
          },
        })
      );
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
              timeoutRef.current = setTimeout(
                scheduleOutputPoll,
                OUTPUT_REFRESH_INTERVAL_MS
              );
            } else {
              timeoutRef.current = null;
            }
          },
          handleError: () => {
            if (cancelled) return;
            timeoutRef.current = null;
          },
        })
      );
    }

    clearTimeout(timeoutRef.current);
    timeoutRef.current = null;

    if (isExpanded) {
      if (hostFinishedRef.current) return undefined;
      if (Array.isArray(responseRef.current?.output)) {
        scheduleOutputPoll();
      } else {
        fetchDetails();
      }
    }

    return () => {
      cancelled = true;
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    };
  }, [appendOutput, dispatch, hostID, isExpanded, jobID, replaceOutput]);

  return liveOutput;
};
