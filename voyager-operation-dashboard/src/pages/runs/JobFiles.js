import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function JobFiles({files}) {
    
    return(
        <> 
        { typeof(files) !== 'object' ? "There are no files for this selected job." : 
        Object.keys(files).map((sample, index) => {
            return(
            <Accordion key={index}>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                >
                <Typography>{sample}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <pre style={{ fontSize: 12 }}>
                        {JSON.stringify(files[sample], null, 4)}
                    </pre>
                </AccordionDetails>
            </Accordion>
            )
        })}
        </>
    )
}

export default JobFiles