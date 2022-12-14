import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';

function JobFiles({files}) {
    
    return(
        <> 
        { typeof(files) !== 'object' ? "There are no files for this selected job." : 
        Object.keys(files).map((sample, index) => {
            return(
            <Accordion key={index}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>{sample}</Typography>
                </AccordionSummary>

                <AccordionDetails>
                    <ul style={{listStyleType: 'none'}}>
                        <li>Assay: {files[sample]["assay"]}</li>
                        <li>Lab Head Name: {files[sample]["labHeadName"]}</li>
                        <li>Lab Head Email: {files[sample]["labHeadEmail"]}</li>
                        <li>Paired with: {files[sample]["paired_with"].join(", ")}</li>
                        <li>igoRequestId: {files[sample]["igoRequestId"]}</li>
                        <li>Tumor or Normal: {files[sample]["tumorOrNormal"]}</li>
                        <li>File Path: {files[sample]["path"]}</li>
                    </ul>
                </AccordionDetails>
            </Accordion>
            )
        })}
        </>
    )
}

export default JobFiles