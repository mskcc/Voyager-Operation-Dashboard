import { useEffect, useState } from "react"

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

    console.log(runsData.count)


    return (
        <div>
            <h1>Count:  {runsData.count}</h1>
        </div>
    )
}

export default Runs