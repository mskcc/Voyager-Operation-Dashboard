import { useEffect, useState } from "react"
import PieChart from "../components/charts/PieChart"
import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

function Home() {

    const credentials = btoa("admin:correctHorseBatteryStaple")
    const [runStatus, setRunStatus] = useState({})
    const [genePanel, setGenePanel] = useState({})
    const [runDistCount, setRunDistCount] = useState({})


    const [startDates, setStartDates] = useState([])
    const [finishedDates, setFinishedDates] = useState([])
    const [binDate, setBinDate] = useState("Select Time")
    const [errorRate, setErrorRate] = useState(0)
    

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

        // Runs completed and failed dates
        fetch('http://localhost:8081/v0/run/api/?values_run=name%2Cstarted&page_size=10000', {
            headers: {'Authorization': `Basic ${credentials}`}
        })
        .then((r) => r.json())
        .then((data) => setStartDates(data.results))

        fetch('http://localhost:8081/v0/run/api/?status=FAILED&values_run=name%2Cfinished_date&page_size=10000', {
            headers: {'Authorization': `Basic ${credentials}`}
        })
        .then((r) => r.json())
        .then((data) => setFinishedDates(data.results))

    }, [credentials, finishedDates, startDates])
    


    function arrToObj(arr) {
        const obj = {}
        arr.map((e) => (
            obj[e[0]] = e[1]
        ))

        return obj
    }

    function compareRuns(startDates, finishedDates, bin) {
        const startObj = arrToObj(startDates)
        let diffArr = []


        for (let i in finishedDates) {
            if (startObj[finishedDates[i][1]] !== null) {
                if (bin === "1 month" || bin === "3 months" || bin === "6 months") {
                    diffArr = [...diffArr, dateDiff(startObj[finishedDates[i][1]], finishedDates[i][0], "month")]
                } else if (bin === "3 days" || bin === "1 day" || bin === "1 week") {
                    diffArr = [...diffArr, dateDiff(startObj[finishedDates[i][1]], finishedDates[i][0], "day")]
                } else {
                    diffArr = "Date could not be computed."
                }
            }
        }

        return (binDates(diffArr, bin) / (startDates.length + binDates(diffArr, bin)) * 100).toFixed(2)
    }

    function binDates(diffArr, bin) {
        if (bin === "1 month") {
            return diffArr.filter(diff => diff <= 1).length
        } else if (bin === "3 months") {
            return diffArr.filter(diff => diff <= 3).length
        } else if (bin === "6 months") {
            return diffArr.filter(diff => diff <= 6).length
        } else if (bin === "1 week") {
            return diffArr.filter(diff => diff <= 7).length
        } else if (bin === "3 days") {
            return diffArr.filter(diff => diff <= 3).length
        } else if (bin === "1 day") {
            return diffArr.filter(diff => diff <= 1).length
        } else {
            return "Date could not be computed."
        }
    }
    
    
    // Take the difference between start and finish dates
    function dateDiff(start, finish, bin) {
        let d1 = new Date(finish);
        let d2 = new Date(start);  
        // return Math.abs(d1-d2);  // difference in milliseconds

        function getQuarter(date = new Date()) {
            return Math.floor(date.getMonth() / 3 + 1);
        }

        if (bin === "month") {
            return Math.abs(d1.getMonth()-d2.getMonth());
        } else if (bin === "quarter") {
            return Math.abs(getQuarter(d1)-getQuarter(d2));
        } else if (bin === "day") {
            return Math.abs(d1.getDay()-d2.getDay());
        } else {
            return "Date cannot be computed."
        }
        
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
    
    function handleChange(e) {
        setBinDate(e.target.value);
        if (e.target.value === "Select Time") {
            setErrorRate(0)
        } else {
            setErrorRate(compareRuns(startDates, finishedDates, e.target.value))
        }
      };

    return (
        <div className="home-container">
            <PieChart data={processedRunData} options={runOptions}/>
            <PieChart data={processedGeneData} options={geneOptions}/>
            <PieChart data={processedDistData} options={runDistOptions}/>
            <div className="error-rate">
            <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Error Rate</InputLabel>
                    <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={binDate}
                    label="Age"
                    onChange={handleChange}
                    >
                    <MenuItem value={"Select Time"}>Select Time</MenuItem> 
                    <MenuItem value={"1 month"}>1 Month</MenuItem>
                    <MenuItem value={"3 months"}>3 Months</MenuItem>
                    <MenuItem value={"6 months"}>6 Months</MenuItem>
                    <MenuItem value={"1 week"}>1 Week</MenuItem>
                    <MenuItem value={"3 days"}>3 Days</MenuItem>
                    <MenuItem value={"1 day"}>1 Day</MenuItem>
                    </Select>
                </FormControl>
            </Box>
                <h1 className="error-rate-text">{errorRate}%</h1>
            </div>
            
        </div>
    )
    
}

export default Home