import { get } from 'foremanReact/redux/API';
import { TARGETING_HOSTS } from '../../consts';

export const getTargetingHostsAction = apiUrl => async dispatch => {
  dispatch(
    await get({
      key: TARGETING_HOSTS,
      url: apiUrl,
    })
  );
};
