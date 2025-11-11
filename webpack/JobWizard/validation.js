import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  selectTemplateInputs,
  selectAdvancedTemplateInputs,
} from './JobWizardSelectors';
import { isPositiveNumber, isValidDate } from './steps/form/FormHelpers';
import './JobWizard.scss';

export const useValidation = ({ advancedValues, templateValues }) => {
  const [valid, setValid] = useState({});
  const templateInputs = useSelector(selectTemplateInputs);
  const advancedTemplateInputs = useSelector(selectAdvancedTemplateInputs);
  useEffect(() => {
    setValid({
      hostsAndInputs: true,
      advanced: true,
      schedule: true,
    });
    const inputValidation = (inputs, values, setInvalid) => {
      inputs.forEach(({ name, required, value_type: valueType }) => {
        const value = values[name];
        if (required && !value) {
          setInvalid();
        }
        if (value && valueType === 'date') {
          if (!isValidDate(value) && !isValidDate(new Date(value))) {
            setInvalid();
          }
        }
      });
    };
    inputValidation(templateInputs, templateValues, () =>
      setValid(currValid => ({ ...currValid, hostsAndInputs: false }))
    );

    inputValidation(advancedTemplateInputs, advancedValues.templateValues, () =>
      setValid(currValid => ({ ...currValid, advanced: false }))
    );
    [
      advancedValues.timeoutToKill,
      advancedValues.timeToPickup,
      advancedValues.concurrencyLevel,
    ].forEach(value => {
      if (value && !isPositiveNumber(value)) {
        setValid(currValid => ({ ...currValid, advanced: false }));
      }
    });
  }, [advancedValues, templateValues, templateInputs, advancedTemplateInputs]);
  return [valid, setValid];
};
