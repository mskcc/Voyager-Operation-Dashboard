import { useEffect, useState } from "react";
import "./Runs.css";
import LinearIndeterminate from "../../components/loaders/LinearIndeterminate";
import { MaterialReactTable } from "material-react-table";
import { beagle_get } from "../../components/common/Beagle";
import {
  RUN_NUM_MONTHS,
  RUN_INFO,
  EXTRA_JOB_INFO,
  LARGE_PAGE_SIZE,
  BEAGLE_STATUS_NUM,
  RUN_DATE_FIELDS,
  BEAGLE_STATUS_SORT_RANK,
} from "../../components/common/config";

function Runs() {
  let initial_start = new Date();
  initial_start.setMonth(initial_start.getMonth() - RUN_NUM_MONTHS);
  const [runsData, setRunsData] = useState([]);
  const [runStartDate, setRunStartDate] = useState(initial_start);
  const [formatedRunsData, setformatedRunsData] = useState([]);
  const [jobRows, setJobRows] = useState([]);
  const [loading, setLoading] = useState(true);

  function getRunKeys() {
    const run_keys = RUN_INFO.map((single_col) => {
      return single_col.field;
    });
    run_keys.sort();
    return run_keys;
  }

  function sortStatus(rowA, rowB, columnId) {
    const { [columnId]: statusA } = rowA.original;
    const { [columnId]: statusB } = rowB.original;

    return BEAGLE_STATUS_SORT_RANK[statusA] - BEAGLE_STATUS_SORT_RANK[statusB];
  }

  function getColumns(col_type) {
    const column = RUN_INFO.filter(
      (single_col) => single_col.type === col_type
    ).map((single_col) => {
      const { type, ...rest } = single_col;
      return rest;
    });
    if (col_type === "job") {
      return [...column, ...EXTRA_JOB_INFO];
    }
    return column;
  }

  function filterAndFormatData(field_list, single_filtered_row) {
    return field_list.reduce((row_dict, current_field) => {
      if (current_field in single_filtered_row) {
        let { [current_field]: current_value } = single_filtered_row;
        if (RUN_DATE_FIELDS.includes(current_field) && current_value) {
          current_value = new Date(current_value).toLocaleString();
        }
        if (current_field === "status") {
          current_value = BEAGLE_STATUS_NUM[current_value];
        }
        if (typeof current_value === "object") {
          current_value = JSON.stringify(current_value);
        }
        row_dict[current_field] = current_value;
      }
      return row_dict;
    }, {});
  }

  function setAccessorKey(columns) {
    return columns.map((single_col) => {
      const { field, ...rest } = single_col;
      return { accessorKey: field, ...rest };
    });
  }

  function setSort(columns) {
    return columns.map((single_col) => {
      const { accessorKey } = single_col;
      if (accessorKey === "status" || accessorKey === "job_status") {
        return {
          sortingFn: (rowA, rowB, columnId) => sortStatus(rowA, rowB, columnId),
          ...single_col,
        };
      } else if (RUN_DATE_FIELDS.includes(accessorKey)) {
        return { sortingFn: "datetime", ...single_col };
      } else {
        return single_col;
      }
    });
  }

  function getHiddenFields(columns) {
    let visibility = {};
    const filtered_columns = columns.map((single_col) => {
      const { hide, accessorKey, ...rest } = single_col;
      visibility[accessorKey] = !hide;
      return { accessorKey, ...rest };
    });
    return { columns: filtered_columns, visibility: visibility };
  }

  function getRunData(job_id) {
    const run_cols = getColumns("run");
    const run_field_list = run_cols.map((single_col) => single_col.field);
    const run_data = formatedRunsData
      .filter((single_run) => single_run.job_group_notifier__id === job_id)
      .map((single_job_run) => {
        return filterAndFormatData(run_field_list, single_job_run);
      });
    return run_data;
  }

  useEffect(() => {
    function fetchRunData() {
      const start_iso_time = runStartDate.toISOString();
      const run_keys = getRunKeys();
      const values_run = run_keys.join(",");
      beagle_get(
        "/v0/run/api?page_size=" +
          LARGE_PAGE_SIZE +
          "&created_date_gt=" +
          start_iso_time +
          "&values_run=" +
          values_run
      )
        .then((r) => r.data)
        .then((data) => {
          setRunsData(data.results);
        });
    }
    fetchRunData();
  }, [runStartDate]);
  useEffect(() => {
    function handleRunsChange() {
      const run_keys = getRunKeys();
      const rows = runsData.map((run) => {
        const single_row_list = run_keys
          .map((single_key, index) => {
            return { [single_key]: run[index] };
          })
          .reduce((row_dict, current_obj) => {
            return { ...row_dict, ...current_obj };
          }, {});
        return single_row_list;
      });
      setformatedRunsData(rows);
      const run_info = rows.reduce((info_dict, current_row) => {
        const { status, job_group_notifier__id } = current_row;
        const { [job_group_notifier__id]: run_status_dict = {} } = info_dict;
        const run_status = BEAGLE_STATUS_NUM[status];
        const { [run_status]: job_status_count = 0 } = run_status_dict;
        run_status_dict[run_status] = job_status_count + 1;
        info_dict[job_group_notifier__id] = run_status_dict;
        return info_dict;
      }, {});
      const job_set = new Set();
      const job_cols = getColumns("job");
      const job_field_list = job_cols.map((single_col) => single_col.field);
      const rows_filtered = rows
        .filter((single_row) => {
          const { job_group_notifier__id } = single_row;
          if (job_set.has(job_group_notifier__id)) {
            return false;
          } else {
            job_set.add(job_group_notifier__id);
            return true;
          }
        })
        .map((single_filtered_row) => {
          const { job_group_notifier__id } = single_filtered_row;
          const single_job_row = filterAndFormatData(
            job_field_list,
            single_filtered_row
          );
          const total = Object.values(run_info[job_group_notifier__id]).reduce(
            (count, num_runs) => count + num_runs,
            0
          );
          const completed = run_info[job_group_notifier__id]["Completed"] || 0;
          const running = run_info[job_group_notifier__id]["Running"] || 0;
          const failed = run_info[job_group_notifier__id]["Failed"] || 0;
          let status = "UNKWN";
          if (running === 0) {
            if (failed !== 0 && completed !== 0) {
              status = "Mixed";
            } else {
              status = "Completed";
            }
          } else if (failed !== 0) {
            status = "Failed";
          } else {
            status = "Running";
          }
          const summary_job_info = {
            total: total,
            completed: completed,
            running: running,
            failed: failed,
            job_status: status,
          };
          return {
            ...single_job_row,
            ...summary_job_info,
            id: job_group_notifier__id,
          };
        });
      return rows_filtered;
    }
    const rows = handleRunsChange();
    setLoading(false);
    setJobRows(rows);
  }, [runsData]);

  // Add job files data to the object from the pipeline table

  const { columns: jobColumns, visibility: jobVisibility } = getHiddenFields(
    setAccessorKey(getColumns("job"))
  );
  const { columns: runColumns, visibility: runVisibility } = getHiddenFields(
    setAccessorKey(getColumns("run"))
  );
  const jobColumnsSort = setSort(jobColumns);
  const runColumnsSort = setSort(runColumns);
  return (
    <>
      <MaterialReactTable
        columns={jobColumnsSort}
        data={jobRows}
        state={{
          isLoading: loading,
        }}
        initialState={{
          columnVisibility: jobVisibility,
          sorting: [
            { id: "job_status", desc: false },
            { id: "job_group_notifier__created_date", desc: true },
          ],
        }}
        renderDetailPanel={({ row }) => (
          <MaterialReactTable
            columns={runColumnsSort}
            data={getRunData(row.original.id)}
            muiTablePaperProps={{
              elevation: 0,
            }}
            initialState={{
              columnVisibility: runVisibility,
              sorting: [
                { id: "status", desc: false },
                { id: "created_date", desc: true },
              ],
            }}
          />
        )}
      />
    </>
  );
}

export default Runs;
