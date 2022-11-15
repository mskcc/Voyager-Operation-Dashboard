import { useEffect, useState, useCallback } from "react"
import PieChart from "../components/charts/PieChart"
function Home() {

    const credentials = btoa("admin:correctHorseBatteryStaple")
    const [runStatus, setRunStatus] = useState({})
    const [genePanel, setGenePanel] = useState({})
    const [runDistCount, setRunDistCount] = useState({})

    const [completedRuns, setCompletedRuns] = useState(0)
    const [failedRuns, setFailedRuns] = useState(0)
    const [startDates, setStartDates] = useState([])
    const [startCount, setStartCount] = useState(0)
    const [finishedDates, setFinishedDates] = useState([])
    const [finishedCount, setFinsihedCount] = useState(0)
    const [diffArr, setDiffArr] = useState([])

    useEffect(() => {
        fetch('http://localhost:8081/v0/run/api/?run_distribution=status', {
            headers: {'Authorization': `Basic ${credentials}`}
        })
        .then((r) => r.json())
        .then((data) => setRunStatus(data))

        fetch('http://localhost:8081/v0/fs/distribution/?metadata_distribution=genePanel', {
            headers: {'Authorization': `Basic ${credentials}`}
        })
        .then((r) => r.json())
        .then((data) => setGenePanel(data))

        fetch('http://localhost:8081/v0/run/api/?run_distribution=tags__sampleNameNormal', {
            headers: {'Authorization': `Basic ${credentials}`}
        })
        .then((r) => r.json())
        .then((data) => pooledRuns(data))

        // Status completed/failed runs
        // fetch('http://localhost:8081/v0/run/api/?status=COMPLETED&full=false', {
        //     headers: {'Authorization': `Basic ${credentials}`}
        // })
        // .then((r) => r.json())
        // .then((data) => setCompletedRuns(data.count))

        // fetch('http://localhost:8081/v0/run/api/?status=FAILED&full=false', {
        //     headers: {'Authorization': `Basic ${credentials}`}
        // })
        // .then((r) => r.json())
        // .then((data) => setFailedRuns(data.count))

        // Runs completed and failed dates
        fetch('http://localhost:8081/v0/run/api/?status=COMPLETED&values_run=name%2Cstarted&page_size=10000', {
            headers: {'Authorization': `Basic ${credentials}`}
        })
        .then((r) => r.json())
        .then((data) => setStartDates(data.results))

        fetch('http://localhost:8081/v0/run/api/?status=FAILED&values_run=name%2Cfinished_date&page_size=10000', {
            headers: {'Authorization': `Basic ${credentials}`}
        })
        .then((r) => r.json())
        .then((data) => setFinishedDates(data.results))

        dateDiff(startDates, finishedDates)
    }, [credentials, finishedDates, startDates])
    


      useCallback(
        () => {
            dateDiff(startDates, finishedDates);
        },
        [startDates, finishedDates],
      );

    // Take the difference between start and finish dates
    function dateDiff(start, finish) {
    // let diffArr = [];
    for (let i in start) {
        let diff = Date(finish[i] - start[i])
        setDiffArr(diffArr => [...diffArr, diff]);
    }
    }
    console.log(diffArr)

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

        setRunDistCount({"Pooled":pooledCount, "Unpooled":unpooledCount})
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
        is3D: true,
    };

    // Gene Panel Data
    const processedGeneData = [
        ["Gene", "Count"],
        ["IMPACT505", genePanel["IMPACT505"]],
        ["ShallowWGS", genePanel["ShallowWGS"]],
        ["CMO-CH", genePanel["CMO-CH"]],
        ["HumanWholeGenome", genePanel["HumanWholeGenome"]],
        ["ACCESS", genePanel["ACCESS"]],
        ["WholeExome", genePanel["WholeExome"]]
    ];

    const geneOptions = {
        title: "Gene Panel",
        is3D: true,
    }

    // Run Distribution Data
    const processedDistData = [
        ["Pooled/Unpooled", "Count"],
        ["Pooled", runDistCount["Pooled"]],
        ["Unpooled", runDistCount["Unpooled"]]
    ];

    const runDistOptions = {
        title: "Run Distribution Pooled vs Unpooled",
        is3D: true,
    }

    return (
        <div className="home-container">
            <PieChart data={processedRunData} options={runOptions}/>
            <PieChart data={processedGeneData} options={geneOptions}/>
            <PieChart data={processedDistData} options={runDistOptions}/>
        </div>
    )
}

export default Home