import { useEffect, useState } from "react"
import PieChart from "../components/charts/PieChart"
function Home() {

    const credentials = btoa("admin:correctHorseBatteryStaple")
    const [runStatus, setRunStatus] = useState({})
    const [genePanel, setGenePanel] = useState({})

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

    }, [])
    
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

    return (
        <div className="home-container">
            <PieChart data={processedRunData} options={runOptions}/>
            <PieChart data={processedGeneData} options={geneOptions}/>
        </div>
    )
}

export default Home