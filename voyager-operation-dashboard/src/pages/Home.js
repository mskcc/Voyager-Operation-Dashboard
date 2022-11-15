import { useEffect, useState } from "react"
import PieChart from "../components/charts/PieChart"
import ScrollList from "../components/lists/ScrollList"
import "./Home.css"

function Home() {

    const credentials = btoa("admin:correctHorseBatteryStaple")
    const [runStatus, setRunStatus] = useState({})
    const [genePanel, setGenePanel] = useState({})
    const [runDistCount, setRunDistCount] = useState({})
    const [startedRuns, setStartedRuns] = useState([])

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

        fetch('http://localhost:8081/v0/run/api/?status=RUNNING&values_run=name%2Cstarted&page_size=10000', {
            headers: {'Authorization': `Basic ${credentials}`}
        })
        .then((r) => r.json())
        .then((data) => setStartedRuns(runStart(data.results)))

    }, [])
    
    function runStart(arr) {
            const res = {};
            for(let pair of arr){
               const [key, value] = pair;
               res[key] = value;
            };
            
            // Append run names with a started date > 2 days
            let diffNames = []
            let dates = Object.values(res)
            let names = Object.keys(res)
            
            // Use the below line for real data
            // const today = new Date()
            // Use the below line for mock data
            const today = new Date('Wed Nov 09 2022 06:09:26 GMT-0500 (Eastern Standard Time)')
            for (let i in dates) {
                let valTime = new Date(dates[i])
                let diff = today - valTime
                let threshDays = 86400000
                // Convert to days
                let convDays = diff / threshDays
                if (diff >= convDays) {
                    diffNames = [...diffNames, names[i]]
                }
            }
            
            return diffNames

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

            <div className="scroll-container">
                <h2>Runs Longer than 2 Days</h2>
                <div className='scroll-list'>
                    <ScrollList listItems={startedRuns} />
                </div>
            </div>
        </div>
    )
}

export default Home