export const selectRexState = state =>
  state.foremanRemoteExecutionReducers.TargetingHosts;
export const selectLoadingState = state => selectRexState(state).loading;
export const selectErrorState = state => selectRexState(state).error;
export const selectHostsState = state => selectRexState(state).hosts;
export const selectRefreshState = state => selectRexState(state).refresh;
