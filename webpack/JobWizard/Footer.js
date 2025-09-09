import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Tooltip, Spinner } from '@patternfly/react-core';
import {
  WizardFooter,
  WizardContextConsumer,
} from '@patternfly/react-core/deprecated';
import { translate as __ } from 'foremanReact/common/I18n';
import { WIZARD_TITLES } from './JobWizardConstants';
import { selectIsSubmitting } from './JobWizardSelectors';

export const Footer = ({ canSubmit, onSave }) => {
  const isSubmitting = useSelector(selectIsSubmitting);
  const tooltipRunOn = useRef(null);
  const tooltipSkipTo = useRef(null);
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
                ouiaId="next-footer"
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
                ouiaId="back-footer"
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
                triggerRef={tooltipRunOn}
              >
                <Button
                  ouiaId="run-on-selected-hosts-footer"
                  variant="tertiary"
                  onClick={onSave}
                  isAriaDisabled={!canSubmit}
                  isDisabled={isSubmitting}
                  ref={tooltipRunOn}
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
                triggerRef={tooltipSkipTo}
              >
                <Button
                  ouiaId="skip-to-review-footer"
                  variant="tertiary"
                  onClick={() => goToStepByName(WIZARD_TITLES.review)}
                  isAriaDisabled={!canSubmit}
                  isDisabled={isSubmitting}
                  ref={tooltipSkipTo}
                >
                  {__('Skip to review')}
                </Button>
              </Tooltip>
              <Button ouiaId="cancel-footer" variant="link" onClick={onClose}>
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
