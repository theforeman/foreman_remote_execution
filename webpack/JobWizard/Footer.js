import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Button,
  WizardFooter,
  WizardContextConsumer,
  Tooltip,
  Spinner,
} from '@patternfly/react-core';
import { translate as __ } from 'foremanReact/common/I18n';
import { WIZARD_TITLES } from './JobWizardConstants';
import { selectIsSubmitting } from './JobWizardSelectors';

export const Footer = ({ canSubmit, onSave }) => {
  const isSubmitting = useSelector(selectIsSubmitting);
  return (
    <WizardFooter>
      <WizardContextConsumer>
        {({ activeStep, onNext, onBack, onClose, goToStepByName }) => {
          const isValid =
            activeStep && activeStep.enableNext !== undefined
              ? activeStep.enableNext
              : true;

          return (
            <>
              <Button
                variant="primary"
                type="submit"
                onClick={onNext}
                isDisabled={!isValid || isSubmitting}
              >
                {activeStep.name === WIZARD_TITLES.review
                  ? __('Submit')
                  : __('Next')}
              </Button>
              <Button
                variant="secondary"
                onClick={onBack}
                isDisabled={
                  activeStep.name === WIZARD_TITLES.categoryAndTemplate
                }
              >
                {__('Back')}
              </Button>
              <Tooltip
                content={
                  <div>
                    {canSubmit
                      ? __('Start job')
                      : __('Fill all required fields in all the steps')}
                  </div>
                }
              >
                <Button
                  variant="tertiary"
                  onClick={onSave}
                  isAriaDisabled={!canSubmit}
                  isDisabled={isSubmitting}
                >
                  {__('Run on selected hosts')}
                </Button>
              </Tooltip>
              <Tooltip
                content={
                  <div>
                    {canSubmit
                      ? __('Skip to review step')
                      : __(
                          'Fill all required fields in all the steps to start the job'
                        )}
                  </div>
                }
              >
                <Button
                  variant="tertiary"
                  onClick={() => goToStepByName(WIZARD_TITLES.review)}
                  isAriaDisabled={!canSubmit}
                  isDisabled={isSubmitting}
                >
                  {__('Skip to review')}
                </Button>
              </Tooltip>
              <Button variant="link" onClick={onClose}>
                {__('Cancel')}
              </Button>
              {isSubmitting && (
                <div>
                  <Spinner size="lg" />
                </div>
              )}
            </>
          );
        }}
      </WizardContextConsumer>
    </WizardFooter>
  );
};

Footer.propTypes = {
  canSubmit: PropTypes.bool.isRequired,
  onSave: PropTypes.func.isRequired,
};
