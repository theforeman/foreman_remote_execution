import Immutable from 'seamless-immutable';
import { TARGETING_HOSTS_SUCCESS, TARGETING_HOSTS_FAILURE } from '../../consts';

const initialState = Immutable({
  loading: true,
  error: false,
  refresh: true,
  hosts: [],
});

export default (state = initialState, action) => {
  switch (action.type) {
    case TARGETING_HOSTS_SUCCESS:
      return state.merge({
        loading: false,
        hosts: action.response.hosts,
        refresh: action.response.autoRefresh === 'true',
      });
    case TARGETING_HOSTS_FAILURE:
      return state.merge({
        loading: false,
        error: true,
      });
    default:
      return state;
  }
};
