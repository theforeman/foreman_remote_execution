/* eslint-disable camelcase */
export const generateDefaultDescription = ({
  description_format,
  advancedInputs,
  inputs,
  name,
}) => {
  if (description_format) return description_format;
  const allInputs = [...advancedInputs, ...inputs];
  if (!allInputs.length) return name;
  const inputsString = allInputs
    .map(({ name: inputname }) => `${inputname}="%{${inputname}}"`)
    .join(' ');
  return `${name} with inputs ${inputsString}`;
};
