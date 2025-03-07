import React from 'react';
import PropTypes from 'prop-types';
import {
  ToggleGroup,
  ToggleGroupItem,
  Flex,
  FlexItem,
  Button,
} from '@patternfly/react-core';
import { OutlinedWindowRestoreIcon } from '@patternfly/react-icons';
import { translate as __ } from 'foremanReact/common/I18n';
import { TemplateActionButtons } from './TemplateActionButtons';

export const OutputToggleGroup = ({
  showOutputType,
  setShowOutputType,
  showTemplatePreview,
  setShowTemplatePreview,
  showCommand,
  setShowCommand,
  newTabUrl,
  isInTableView,
  copyToClipboard,
  taskID,
  jobID,
  hostID,
  taskCancellable,
  permissions,
}) => {
  const handleSTDERRClick = _isSelected => {
    setShowOutputType(prevShowOutputType => ({
      ...prevShowOutputType,
      stderr: _isSelected,
    }));
  };

  const handleSTDOUTClick = _isSelected => {
    setShowOutputType(prevShowOutputType => ({
      ...prevShowOutputType,
      stdout: _isSelected,
    }));
  };
  const handleDEBUGClick = _isSelected => {
    setShowOutputType(prevShowOutputType => ({
      ...prevShowOutputType,
      debug: _isSelected,
    }));
  };
  const handlePreviewTemplateClick = _isSelected => {
    setShowTemplatePreview(_isSelected);
  };
  const handleCommandClick = _isSelected => {
    setShowCommand(_isSelected);
  };

  const toggleGroupItems = {
    stderr: {
      id: 'stderr-toggle',
      text: __('STDERR'),
      onClick: handleSTDERRClick,
      isSelected: showOutputType.stderr,
    },
    stdout: {
      id: 'stdout-toggle',
      text: __('STDOUT'),
      onClick: handleSTDOUTClick,
      isSelected: showOutputType.stdout,
    },
    debug: {
      id: 'debug-toggle',
      text: __('DEBUG'),
      onClick: handleDEBUGClick,
      isSelected: showOutputType.debug,
    },
    previewTemplate: {
      id: 'preview-template-toggle',
      text: __('Preview Template'),
      onClick: handlePreviewTemplateClick,
      isSelected: showTemplatePreview,
    },
    command: {
      id: 'command-toggle',
      text: __('Command'),
      onClick: handleCommandClick,
      isSelected: showCommand,
    },
  };

  return (
    <Flex>
      <FlexItem>
        <ToggleGroup>
          {Object.values(toggleGroupItems).map(
            ({ id, text, onClick, isSelected }) => (
              <ToggleGroupItem
                key={id}
                text={text}
                buttonId={id}
                isSelected={isSelected}
                onChange={(_event, val) => onClick(val)}
              />
            )
          )}
        </ToggleGroup>
      </FlexItem>
      {isInTableView ? null : (
        <TemplateActionButtons
          taskID={taskID}
          jobID={jobID}
          hostID={hostID}
          taskCancellable={taskCancellable}
          permissions={permissions}
        />
      )}
      <FlexItem>{copyToClipboard}</FlexItem>
      {isInTableView && (
        <FlexItem>
          <Button
            title={__('Open in new tab')}
            variant="link"
            isInline
            ouiaId="template-invocation-new-tab-button"
            component="a"
            href={newTabUrl}
            target="_blank"
          >
            <OutlinedWindowRestoreIcon />
          </Button>
        </FlexItem>
      )}
    </Flex>
  );
};

OutputToggleGroup.propTypes = {
  showOutputType: PropTypes.shape({
    stderr: PropTypes.bool,
    stdout: PropTypes.bool,
    debug: PropTypes.bool,
  }).isRequired,
  setShowOutputType: PropTypes.func.isRequired,
  setShowTemplatePreview: PropTypes.func.isRequired,
  showTemplatePreview: PropTypes.bool.isRequired,
  showCommand: PropTypes.bool.isRequired,
  setShowCommand: PropTypes.func.isRequired,
  newTabUrl: PropTypes.string,
  copyToClipboard: PropTypes.node.isRequired,
  isInTableView: PropTypes.bool,
  ...TemplateActionButtons.propTypes,
};

OutputToggleGroup.defaultProps = {
  newTabUrl: null,
  isInTableView: false,
  ...TemplateActionButtons.defaultProps,
};
