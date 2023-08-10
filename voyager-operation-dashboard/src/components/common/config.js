export const BEAGLE_URL = process.env.REACT_APP_BEAGLE_URL;
export const RUN_NUM_MONTHS = 2;
export const LARGE_PAGE_SIZE = 10000;
export const RUN_DATE_FIELDS = [
  "created_date",
  "finished_date",
  "job_group_notifier__created_date",
];
export const RUN_INFO = [
  {
    field: "app__name",
    header: "Pipeline",
    type: "run",
    hide: false,
  },
  {
    field: "app__version",
    header: "Pipeline Version",
    type: "run",
    hide: true,
  },
  {
    field: "created_date",
    header: "Started",
    type: "run",
    hide: false,
  },
  {
    field: "finished_date",
    header: "Finished",
    type: "run",
    hide: false,
  },
  {
    field: "job_group_notifier__request_id",
    header: "Request Id",
    type: "job",
    hide: false,
  },
  {
    field: "job_group_notifier__PI",
    header: "PI",
    type: "job",
    hide: false,
  },
  {
    field: "job_group_notifier__assay",
    header: "Assay",
    type: "job",
    hide: false,
  },
  {
    field: "job_group_notifier__created_date",
    header: "Started",
    type: "job",
    hide: false,
  },
  {
    field: "job_group_notifier__id",
    header: "Id",
    type: "job",
    hide: true,
  },
  {
    field: "job_group_notifier__investigator",
    header: "Investigator",
    type: "job",
    hide: true,
  },
  { field: "name", header: "Name", type: "run", hide: true },
  {
    field: "status",
    header: "Status",
    type: "run",
    hide: false,
  },
  { field: "tags", header: "Tags", type: "run", hide: false },
  {
    field: "message",
    header: "Message",
    type: "run",
    hide: false,
  },
  {
    field: "restart_attempts",
    header: "Restart",
    type: "run",
    hide: false,
  },
  {
    field: "resume_attempts",
    header: "Resume",
    type: "run",
    hide: false,
  },
];
export const EXTRA_JOB_INFO = [
  {
    field: "job_status",
    header: "Status",
    hide: false,
  },
  {
    field: "total",
    header: "Total",
    hide: false,
  },
  {
    field: "completed",
    header: "Completed",
    hide: false,
  },
  {
    field: "running",
    header: "Running",
    hide: false,
  },
  {
    field: "failed",
    header: "Failed",
    hide: false,
  },
];

export const BEAGLE_STATUS_NUM = {
  0: "Creating",
  1: "Ready",
  2: "Running",
  3: "Failed",
  4: "Completed",
  5: "Terminated",
};

export const BEAGLE_STATUS_SORT_RANK = {
  Creating: 0,
  Ready: 1,
  Running: 2,
  Failed: 3,
  Mixed: 3.5,
  Completed: 5,
  Terminated: 4,
};

export const BEAGLE_ACCESS_SESSION = "Beagle_access";
export const BEAGLE_REFRESH_SESSION = "Beagle_refresh";
export const BEAGLE_USERNAME_SESSION = "Beagle_username";
