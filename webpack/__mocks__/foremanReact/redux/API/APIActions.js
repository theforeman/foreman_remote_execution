import { API_OPERATIONS } from 'foremanReact/redux/API/APIConstants';

const { GET, POST, PUT, DELETE, PATCH } = API_OPERATIONS;

const apiAction = (type, payload) => ({ type, payload });

export const get = payload => apiAction(GET, payload);

export const post = payload => apiAction(POST, payload);

export const put = payload => apiAction(PUT, payload);

export const patch = payload => apiAction(PATCH, payload);

export const APIActions = {
  get,
  post,
  put,
  patch,
  delete: payload => apiAction(DELETE, payload),
};
