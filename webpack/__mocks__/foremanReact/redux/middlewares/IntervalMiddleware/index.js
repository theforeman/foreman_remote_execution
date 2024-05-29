export const stopInterval = key => ({
  type: 'STOP_INTERVAL',
  key,
});

export const withInterval = key => ({
  type: 'WITH_INTERVAL',
  key,
});
