export const foremanUrl = path => `foreman${path}`;

export const visit = jest.fn(url => {
  global.window.location.href = url;
});
