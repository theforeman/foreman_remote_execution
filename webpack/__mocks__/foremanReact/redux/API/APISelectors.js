export const selectAPI = state => state;
export const selectAPIByKey = (state, key) => selectAPI(state)[key] || {};

export const selectAPIStatus = (state, key) =>
  selectAPIByKey(state, key).status;

export const selectAPIPayload = (state, key) =>
  selectAPIByKey(state, key).payload || {};

export const selectAPIResponse = (state, key) =>
  selectAPIByKey(state, key).response || {};

export const selectAPIError = (state, key) =>
  selectAPIStatus(state, key) === 'ERROR'
    ? selectAPIResponse(state, key)
    : null;

export const selectAPIErrorMessage = (state, key) => {
  const error = selectAPIError(state, key);
  return error && error.message;
};
