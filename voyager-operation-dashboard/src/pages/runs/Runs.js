import { useEffect, useState } from "react"
import LinearIndeterminate from "../../components/loaders/LinearIndeterminate"
import Dashboard from "../dashboard/Dashboard"

function Runs() {

    const [runsData, setRunsData] = useState()
    const credentials = btoa("admin:correctHorseBatteryStaple")

    useEffect(() => {
        fetch('http://localhost:8081/v0/run/api/', {
            headers: {'Authorization': `Basic ${credentials}`}
        })
            .then((r) => r.json())
            .then((data) => setRunsData(data))
    }, [])


    if (runsData) {
        return (
            <div>
                <h1>Count: {runsData.count}</h1>
            </div>
        )

    } else {
        return (
            <div>  
                <LinearIndeterminate />
            </div>
        )
    }
}

export default Runs