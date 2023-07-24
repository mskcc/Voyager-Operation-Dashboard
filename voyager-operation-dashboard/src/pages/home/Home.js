import { useEffect, useState } from "react";
import PieChart from "../../components/charts/PieChart";
import ScrollList from "../../components/lists/ScrollList";
import "./Home.css";
import Paper from "@mui/material/Paper";
import ErrorRate from "./ErrorRate";
import { beagle_get } from "../../components/common/Beagle";
import * as React from "react";

function Home() {
  const credentials = btoa("admin:correctHorseBatteryStaple");
  const [runStatus, setRunStatus] = useState({});
  const [genePanel, setGenePanel] = useState({});
  const [runDistCount, setRunDistCount] = useState({});
  const [startedRuns, setStartedRuns] = useState([]);

  const [startDates, setStartDates] = useState([]);
  const [finishedDates, setFinishedDates] = useState([]);

  useEffect(() => {
    beagle_get("/v0/run/api/?run_distribution=status")
      .then((r) => r.data)
      .then((data) => setRunStatus(data));

    beagle_get("/v0/fs/distribution/?metadata_distribution=genePanel")
      .then((r) => r.data)
      .then((data) => setGenePanel(data));

    beagle_get("/v0/run/api/?run_distribution=tags__sampleNameNormal")
      .then((r) => r.data)
      .then((data) => pooledRuns(data));

    // Started runs
    beagle_get(
      "/v0/run/api/?status=RUNNING&values_run=name%2Cstarted&page_size=10000"
    )
      .then((r) => r.data)
      .then((data) => setStartedRuns(runStart(data.results)));

    // Runs completed and failed dates
    beagle_get("/v0/run/api/?values_run=name%2Cstarted&page_size=10000")
      .then((r) => r.data)
      .then((data) => setStartDates(data.results));

    beagle_get(
      "/v0/run/api/?status=FAILED&values_run=name%2Cfinished_date&page_size=10000"
    )
      .then((r) => r.data)
      .then((data) => setFinishedDates(data.results));
  }, [credentials, finishedDates, startDates]);

  // Runs longer than 2 Days
  function runStart(arr) {
    const res = {};
    for (let pair of arr) {
      const [key, value] = pair;
      res[key] = value;
    }

    // Append run names with a started date > 2 days
    let diffNames = [];
    let dates = Object.values(res);
    let names = Object.keys(res);

    // Use the below line for real data
    // const today = new Date()
    // Use the below line for mock data
    //const today = new Date(
    //  "Wed Nov 09 2022 06:09:26 GMT-0500 (Eastern Standard Time)"
    //);
    const today = new Date();
    for (let i in dates) {
      let valTime = new Date(dates[i]);
      let diff = today - valTime;
      let threshDays = 86400000;
      // Convert to days
      let convDays = diff / threshDays;
      if (diff >= convDays) {
        diffNames = [...diffNames, names[i]];
      }
    }

    return diffNames;
  }

  // Count the number of pooled and unpooled runs in the run distribution
  function pooledRuns(data) {
    let pooledCount = 0;
    let unpooledCount = 0;

    for (let i in Object.keys(data)) {
      if (Object.keys(data)[i].split("_")[0] === "POOLEDNORMAL") {
        pooledCount += data[Object.keys(data)[i]];
      } else {
        unpooledCount += data[Object.keys(data)[i]];
      }
    }

    setRunDistCount({ Pooled: pooledCount, Unpooled: unpooledCount });
  }

  // Pie Charts
  // Run Status Data
  const processedRunData = [
    ["Status", "Count"],
    ["Creating", runStatus[0]],
    ["Ready", runStatus[1]],
    ["Running", runStatus[2]],
    ["Failed", runStatus[3]],
    ["Completed", runStatus[4]],
    ["Aborted", runStatus[5]],
  ];

  const runOptions = {
    title: "Runs",
    pieHole: 0.4,
    is3D: false,
  };

  // Gene Panel Data
  const processedGeneData = [
    ["Gene", "Count"],
    ["IMPACT505", genePanel["IMPACT505"]],
    ["ShallowWGS", genePanel["ShallowWGS"]],
    ["CMO-CH", genePanel["CMO-CH"]],
    ["HumanWholeGenome", genePanel["HumanWholeGenome"]],
    ["ACCESS", genePanel["ACCESS"]],
    ["WholeExome", genePanel["WholeExome"]],
  ];

  const geneOptions = {
    title: "Gene Panel",
    pieHole: 0.4,
    is3D: false,
    slices: {
      0: { color: "#01579b" },
      1: { color: "#6a1b9a" },
      2: { color: "#ad1457" },
      3: { color: "#43a047" },
      4: { color: "#d84315" },
      5: { color: "#607d8b" },
    },
  };

  // Run Distribution Data
  const processedDistData = [
    ["Pooled/Unpooled", "Count"],
    ["Pooled", runDistCount["Pooled"]],
    ["Unpooled", runDistCount["Unpooled"]],
  ];

  const runDistOptions = {
    title: "Run Distribution Pooled vs Unpooled",
    is3D: false,
  };

  return (
    <div className="home-container">
      {processedRunData.length !== 0 && (
        <Paper elevation={4}>
          <PieChart data={processedRunData} options={runOptions} />
        </Paper>
      )}
      {processedRunData.length === 0 && <Paper elevation={4}></Paper>}

      {processedGeneData.length !== 0 && (
        <Paper elevation={4}>
          <PieChart data={processedGeneData} options={geneOptions} />
        </Paper>
      )}
      {processedGeneData.length === 0 && <Paper elevation={4}></Paper>}

      {processedDistData.length !== 0 && (
        <Paper elevation={4}>
          <PieChart data={processedDistData} options={runDistOptions} />
        </Paper>
      )}
      {processedDistData.length === 0 && <Paper elevation={4}></Paper>}

      {startedRuns.length !== 0 && (
        <Paper elevation={4}>
          <div className="scroll-container">
            <h2>Runs Longer than 2 Days</h2>
            <div className="scroll-list">
              <ScrollList listItems={startedRuns} />
            </div>
          </div>
        </Paper>
      )}
      {startedRuns.length === 0 && (
        <Paper elevation={4}>
          <h2>Runs Longer than 2 Days</h2>
        </Paper>
      )}

      {startDates.length !== 0 && (
        <ErrorRate startDates={startDates} finishedDates={finishedDates} />
      )}
      {startDates.length === 0 && <Paper elevation={4}></Paper>}
    </div>
  );
}

export default Home;
