export const HOST_DETAILS_JOBS = 'HOST_DETAILS_JOBS';
export const FINISHED_TAB = 0;
export const RUNNING_TAB = 1;
export const SCHEDULED_TAB = 2;

export const JOB_SUCCESS_STATUS = 0;
export const JOB_ERROR_STATUS = 1;

export const JOB_BASE_URL = '/job_invocations?search=host+%3D+';
export const JOB_API_URL =
  '/api/job_invocations?order=start_at+DESC&search=targeted_host_id%3D';
export const JOBS_IN_CARD = 3;
export const RECENT_JOBS_KEY = { key: 'RECENT_JOBS_KEY' };
