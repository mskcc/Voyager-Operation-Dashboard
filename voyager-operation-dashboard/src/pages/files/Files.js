import { useState, useEffect } from "react"

function Files() {

    const [filesData, setFilesData] = useState()
    const credentials = btoa("admin:correctHorseBatteryStaple")

    useEffect(() => {
        fetch('http://localhost:8081/v0/fs/files' , {
            headers: {'Authorization': `Basic ${credentials}`}
        })
            .then((r) => r.json())
            .then((data) => setFilesData(data))
    }, [])


    return (
        <div>
            <h1>Count: {filesData.count}</h1>
        </div>
    )
}

export default Files