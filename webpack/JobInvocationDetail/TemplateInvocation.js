import React, { useEffect, useRef } from 'react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { ClipboardCopyButton, Alert, Skeleton } from '@patternfly/react-core';
import { useDispatch, useSelector } from 'react-redux';
import { APIActions } from 'foremanReact/redux/API';
import { translate as __ } from 'foremanReact/common/I18n';
import { useForemanHostDetailsPageUrl } from 'foremanReact/Root/Context/ForemanContext';
import { STATUS } from 'foremanReact/constants';
import {
  showTemplateInvocationUrl,
  templateInvocationPageUrl,
  GET_TEMPLATE_INVOCATION,
} from './JobInvocationConstants';
import {
  selectTemplateInvocationStatus,
  selectTemplateInvocation,
} from './JobInvocationSelectors';
import { OutputToggleGroup } from './TemplateInvocationComponents/OutputToggleGroup';
import { PreviewTemplate } from './TemplateInvocationComponents/PreviewTemplate';
import { OutputCodeBlock } from './TemplateInvocationComponents/OutputCodeBlock';

const CopyToClipboard = ({ fullOutput }) => {
  const clipboardCopyFunc = async (event, text) => {
    try {
      await navigator.clipboard.writeText(text.toString());
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error?.message);
    }
  };

  const onClick = (event, text) => {
    clipboardCopyFunc(event, text);
    setCopied(true);
  };
  const [copied, setCopied] = React.useState(false);
  return (
    <ClipboardCopyButton
      id="expandable-copy-button"
      textId="code-content"
      aria-label="Copy to clipboard"
      onClick={e => onClick(e, fullOutput)}
      exitDelay={copied ? 1500 : 600}
      maxWidth="110px"
      variant="plain"
      onTooltipHidden={() => setCopied(false)}
    >
      {copied
        ? __('Successfully copied to clipboard!')
        : __('Copy to clipboard')}
    </ClipboardCopyButton>
  );
};

export const TemplateInvocation = ({
  hostID,
  jobID,
  isInTableView,
  isExpanded,
  hostName,
  hostProxy,
  showOutputType,
  setShowOutputType,
  showTemplatePreview,
  setShowTemplatePreview,
  showCommand,
  setShowCommand,
}) => {
  const intervalRef = useRef(null);
  const templateURL = showTemplateInvocationUrl(hostID, jobID);
  const hostDetailsPageUrl = useForemanHostDetailsPageUrl();

  const status = useSelector(selectTemplateInvocationStatus(hostID));
  const response = useSelector(selectTemplateInvocation(hostID));
  const dispatch = useDispatch();

  const responseRef = useRef(response);
  useEffect(() => {
    responseRef.current = response;
  }, [response]);

  useEffect(() => {
    const dispatchFetch = () => {
      dispatch(
        APIActions.get({
          url: templateURL,
          key: `${GET_TEMPLATE_INVOCATION}_${hostID}`,
        })
      );
    };

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (isExpanded) {
      if (isEmpty(responseRef.current)) {
        dispatchFetch();
      }

      intervalRef.current = setInterval(() => {
        const latestResponse = responseRef.current;
        const finished = latestResponse?.finished ?? true;
        // eslint-disable-next-line camelcase
        const autoRefresh = latestResponse?.auto_refresh || false;

        if (!finished && autoRefresh) {
          dispatchFetch();
        } else if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      }, 5000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isExpanded, dispatch, templateURL, hostID]);

  if (!response || (status === STATUS.PENDING && isEmpty(response))) {
    return <Skeleton data-testid="template-invocation-skeleton" />;
  }

  const errorMessage =
    response?.response?.data?.error?.message ||
    response?.response?.data?.error ||
    JSON.stringify(response);

  if (status === STATUS.ERROR) {
    return (
      <Alert
        ouiaId="template-invocation-error-alert"
        variant="danger"
        title={__(
          'An error occurred while fetching the template invocation details.'
        )}
      >
        {errorMessage}
      </Alert>
    );
  }

  const {
    preview,
    output,
    input_values: inputValues,
    task,
    permissions,
  } = response;
  const { id: taskID, cancellable: taskCancellable } = task || {};

  return (
    <div
      id={`template-invocation-${hostID}`}
      className={`template-invocation ${
        isInTableView ? ' output-in-table-view' : ''
      }`}
    >
      <OutputToggleGroup
        showOutputType={showOutputType}
        setShowOutputType={setShowOutputType}
        setShowTemplatePreview={setShowTemplatePreview}
        showTemplatePreview={showTemplatePreview}
        showCommand={showCommand}
        setShowCommand={setShowCommand}
        newTabUrl={templateInvocationPageUrl(hostID, jobID)}
        isInTableView={isInTableView}
        copyToClipboard={
          <CopyToClipboard
            fullOutput={output
              ?.filter(
                ({ output_type: outputType }) => showOutputType[outputType]
              )
              .map(({ output: _output }) => _output)
              .join('\n')}
          />
        }
        taskID={taskID}
        jobID={jobID}
        hostID={hostID}
        taskCancellable={taskCancellable}
        permissions={permissions}
      />
      {!isInTableView && (
        <>
          <div>
            {__('Target:')}{' '}
            <a href={`${hostDetailsPageUrl}${hostName}`}>{hostName}</a>{' '}
            {!!hostProxy && (
              <>
                {__('using Smart Proxy')}{' '}
                <a href={hostProxy.href}>{hostProxy.name}</a>
              </>
            )}
          </div>
        </>
      )}
      {showTemplatePreview && <PreviewTemplate inputValues={inputValues} />}
      {showCommand && (
        <>
          {preview?.status ? (
            <Alert
              variant="danger"
              ouiaId="template-invocation-preview-alert"
              title={preview?.plain}
            />
          ) : (
            <pre className="template-invocation-preview">{preview?.plain}</pre>
          )}
        </>
      )}
      <OutputCodeBlock
        code={output || []}
        showOutputType={showOutputType}
        scrollElement={
          isInTableView
            ? `#template-invocation-${hostID} .invocation-output`
            : '#foreman-main-container'
        }
      />
    </div>
  );
};

TemplateInvocation.propTypes = {
  hostID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  hostName: PropTypes.string, // only used when isInTableView is false
  hostProxy: PropTypes.object, // only used when isInTableView is false
  jobID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  isInTableView: PropTypes.bool,
  isExpanded: PropTypes.bool,
  showOutputType: PropTypes.shape({
    stderr: PropTypes.bool,
    stdout: PropTypes.bool,
    debug: PropTypes.bool,
  }).isRequired,
  setShowOutputType: PropTypes.func.isRequired,
  showTemplatePreview: PropTypes.bool.isRequired,
  setShowTemplatePreview: PropTypes.func.isRequired,
  showCommand: PropTypes.bool.isRequired,
  setShowCommand: PropTypes.func.isRequired,
};

TemplateInvocation.defaultProps = {
  isInTableView: true,
  hostName: '',
  hostProxy: {},
  isExpanded: false,
};

CopyToClipboard.propTypes = {
  fullOutput: PropTypes.string,
};
CopyToClipboard.defaultProps = {
  fullOutput: '',
};
