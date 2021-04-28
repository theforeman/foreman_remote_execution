export const selectAPIStatus = () => 'RESOLVED';
export const selectAPIResponse = (state, key) => state[key] || {};
export const selectAPIErrorMessage = state => state.error;
