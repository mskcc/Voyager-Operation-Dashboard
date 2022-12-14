import * as React from 'react'
import Box from '@mui/material/Box'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Paper from '@mui/material/Paper'

function ErrorRate({ startDates, finishedDates }) {
    const [binDate, setBinDate] = React.useState('Error Rate')
    const [errorRate, setErrorRate] = React.useState(0)

    function arrToObj(arr) {
        const obj = {}
        arr.map((e) => (obj[e[0]] = e[1]))

        return obj
    }

    function compareRuns(startDates, finishedDates, bin) {
        const startObj = arrToObj(startDates)
        let diffArr = []

        for (let i in finishedDates) {
            if (startObj[finishedDates[i][1]] !== null) {
                if (
                    bin === '1 month' ||
                    bin === '3 months' ||
                    bin === '6 months'
                ) {
                    diffArr = [
                        ...diffArr,
                        dateDiff(
                            startObj[finishedDates[i][1]],
                            finishedDates[i][0],
                            'month'
                        ),
                    ]
                } else if (
                    bin === '3 days' ||
                    bin === '1 day' ||
                    bin === '1 week'
                ) {
                    diffArr = [
                        ...diffArr,
                        dateDiff(
                            startObj[finishedDates[i][1]],
                            finishedDates[i][0],
                            'day'
                        ),
                    ]
                } else {
                    diffArr = 'Date could not be computed.'
                }
            }
        }

        return (
            (binDates(diffArr, bin) /
                (startDates.length + binDates(diffArr, bin))) *
            100
        ).toFixed(2)
    }

    function binDates(diffArr, bin) {
        if (bin === '1 month') {
            return diffArr.filter((diff) => diff <= 1).length
        } else if (bin === '3 months') {
            return diffArr.filter((diff) => diff <= 3).length
        } else if (bin === '6 months') {
            return diffArr.filter((diff) => diff <= 6).length
        } else if (bin === '1 week') {
            return diffArr.filter((diff) => diff <= 7).length
        } else if (bin === '3 days') {
            return diffArr.filter((diff) => diff <= 3).length
        } else if (bin === '1 day') {
            return diffArr.filter((diff) => diff <= 1).length
        } else {
            return 'Date could not be computed.'
        }
    }

    // Take the difference between start and finish dates
    function dateDiff(start, finish, bin) {
        let d1 = new Date(finish)
        let d2 = new Date(start)
        // return Math.abs(d1-d2);  // difference in milliseconds

        function getQuarter(date = new Date()) {
            return Math.floor(date.getMonth() / 3 + 1)
        }

        if (bin === 'month') {
            return Math.abs(d1.getMonth() - d2.getMonth())
        } else if (bin === 'quarter') {
            return Math.abs(getQuarter(d1) - getQuarter(d2))
        } else if (bin === 'day') {
            return Math.abs(d1.getDay() - d2.getDay())
        } else {
            return 'Date cannot be computed.'
        }
    }

    function handleChange(e) {
        setBinDate(e.target.value)
        if (e.target.value === 'Error Rate') {
            setErrorRate(0)
        } else {
            setErrorRate(compareRuns(startDates, finishedDates, e.target.value))
        }
    }

    return (
        <Paper elevation={4}>
            <div className="error-rate">
                <Box sx={{ minWidth: 120, padding: '10px' }}>
                    <FormControl fullWidth>
                        <InputLabel id="simple-select-label">
                            Error Rate Over Time
                        </InputLabel>
                        <Select
                            labelId="simple-select-label"
                            id="simple-select"
                            value={binDate}
                            label="Error Rate Over Time"
                            onChange={handleChange}
                        >
                            <MenuItem value={'Error Rate'}>Error Rate</MenuItem>
                            <MenuItem value={'1 month'}>1 Month</MenuItem>
                            <MenuItem value={'3 months'}>3 Months</MenuItem>
                            <MenuItem value={'6 months'}>6 Months</MenuItem>
                            <MenuItem value={'1 week'}>1 Week</MenuItem>
                            <MenuItem value={'3 days'}>3 Days</MenuItem>
                            <MenuItem value={'1 day'}>1 Day</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                {binDate === 'Error Rate' ? (
                    <h1>Select a Time Range</h1>
                ) : (
                    <h1 className="error-rate-text">{errorRate}%</h1>
                )}
            </div>
        </Paper>
    )
}

export default ErrorRate
