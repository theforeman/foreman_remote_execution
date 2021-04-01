export const API = {
  get: jest.fn(),
};

export const get = data => ({ type: 'get-some-type', ...data });
