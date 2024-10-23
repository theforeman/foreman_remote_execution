export const HOST_DETAILS_JOBS = 'HOST_DETAILS_JOBS';
export const FINISHED_TAB = 0;
export const RUNNING_TAB = 1;
export const SCHEDULED_TAB = 2;

export const JOB_SUCCESS_STATUS = 0;
export const JOB_ERROR_STATUS = 1;
export const JOB_PLANNED_STATUS = 2;
export const JOB_RUNNING_STATUS = 3;
export const JOB_CANCELLED_STATUS = 4;
export const JOB_AWAITING_STATUS = 5;

export const JOB_BASE_URL = '/job_invocations?search=targeted_host_id+%3D+';
export const JOB_API_URL =
  '/job_invocations/preview_job_invocations_per_host?host_id=';
export const JOBS_IN_CARD = 3;
export const RECENT_JOBS_KEY = { key: 'RECENT_JOBS_KEY' };
