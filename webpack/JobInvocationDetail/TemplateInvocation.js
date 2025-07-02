import React, { useState, useEffect, useRef } from 'react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { ClipboardCopyButton, Alert, Skeleton } from '@patternfly/react-core';
import { useAPI } from 'foremanReact/common/hooks/API/APIHooks';
import { translate as __ } from 'foremanReact/common/I18n';
import { useForemanHostDetailsPageUrl } from 'foremanReact/Root/Context/ForemanContext';
import { STATUS } from 'foremanReact/constants';
import {
  showTemplateInvocationUrl,
  templateInvocationPageUrl,
  GET_TEMPLATE_INVOCATION,
} from './JobInvocationConstants';
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
  hostName,
  hostProxy,
}) => {
  const intervalRef = useRef(null);
  const templateURL = showTemplateInvocationUrl(hostID, jobID);
  const hostDetailsPageUrl = useForemanHostDetailsPageUrl();
  const { response, status, setAPIOptions } = useAPI('get', templateURL, {
    key: GET_TEMPLATE_INVOCATION,
    headers: { Accept: 'application/json' },
    handleError: () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    },
  });
  const { finished, auto_refresh: autoRefresh } = response;

  useEffect(() => {
    if (!finished && autoRefresh) {
      intervalRef.current = setInterval(() => {
        setAPIOptions(prevOptions => ({
          ...prevOptions,
        }));
      }, 5000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [finished, autoRefresh, setAPIOptions]);

  const errorMessage =
    response?.response?.data?.error?.message ||
    response?.response?.data?.error ||
    JSON.stringify(response);
  const {
    preview,
    output,
    input_values: inputValues,
    task_id: taskID,
    task_cancellable: taskCancellable,
    permissions,
  } = response;
  const [showOutputType, setShowOutputType] = useState({
    stderr: true,
    stdout: true,
    debug: true,
  });
  const [showTemplatePreview, setShowTemplatePreview] = useState(false);
  const [showCommand, setCommand] = useState(false);
  if (status === STATUS.PENDING && isEmpty(response)) {
    return <Skeleton />;
  } else if (status === STATUS.ERROR) {
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
        setShowCommand={setCommand}
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
              title={preview.plain}
            />
          ) : (
            <pre className="template-invocation-preview">{preview.plain}</pre>
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
};

TemplateInvocation.defaultProps = {
  isInTableView: true,
  hostName: '',
  hostProxy: {},
};

CopyToClipboard.propTypes = {
  fullOutput: PropTypes.string,
};
CopyToClipboard.defaultProps = {
  fullOutput: '',
};
