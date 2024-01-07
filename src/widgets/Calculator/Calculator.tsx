import { Box, Button, FormControlLabel, FormGroup, InputAdornment, Switch, TextField, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import Stage from "../../components/Stage"
import usePagination from "../../hooks/usePagination"
import { IStage } from '../../entity/StageClass';
import Rocket, { IRocket } from '../../entity/Rocket';
import Helpers from '../../Helpers';
import EditableTextField from "../../components/EditableTextField"

interface Props {

}

let emptyStage = {
    dryMass : "",
    wetMass: "",
    payloadMass : "",
    Isp : ""
}

function Calculator (props : Props) {

    
    const [rockets, setRockets] = useState<IRocket[]>([])
    const [currentRocket, setCurrentRocket] = useState<IRocket|null>(null)
    
    const [title, setTitle] = useState<string>("")
    const [stage1, setStage1] = useState<IStage|null>(null)
    const [stage2, setStage2] = useState<IStage|null>(null)

    const [calcResult, setCalcResult] = useState<string>("")

    const [increment, decrement,index, setIndex] = usePagination(rockets, (i : number) => {
        setCurrentRocket(rockets[i])
    })

    const [boosters, setBoosters] = useState<number>(0)

    const [editName, setEditName] = useState<boolean>(false)
    const [editBoosters, setEditBoosters] = useState<boolean>(false)


    const save = useCallback(() => {
        let newRockets = rockets.map((r,i) => {
            if (i == index) {
                r = {
                    title,
                    stage1 : stage1!,
                    stage2 : stage2!,
                    boosters : +boosters,
                }
            }

            return r
        })
        setRockets(newRockets)
        Helpers.ctx.saveRocket(newRockets)
    }, [stage1, stage2, title, rockets, boosters])


    const addNewRocket = useCallback(() => {
        let matches = 0
        for (let r of rockets) {
            if (r.title.search(/^(new\srocket)/)) {
                matches++
            }
        }

        let newItem = {
                title : matches ? `new rocket ${matches}` : "new rocket",
                stage1 : emptyStage,
                stage2 : emptyStage
            } as any
            let newRockets = [...rockets, newItem]
            setCurrentRocket(newItem)
            setRockets(newRockets)
            setIndex(rockets.length)
        // setCurrentRocket(rockets[rockets.length])
    }, [rockets])

    function onStageInput (stageNumber : number, stage : IStage) {
        if (stageNumber == 1) {
            setStage1(stage)
        } else if (stageNumber == 2) {
            setStage2(stage)
        }
    }

    useEffect(() => {
        Helpers.loadRockets()
        .then((data : any[]) => {
            if (data.length) {
                setRockets(data)
            } else {
                let baseRocket = {
                    stage1 : emptyStage,
                    stage2 : emptyStage,
                    title : "new rocket"
                }
                setRockets([baseRocket] as any)
            }
            
        })
    }, [])


    useEffect(() => {
        if (!currentRocket && rockets.length) {
            setCurrentRocket(rockets[0])
        }
    }, [currentRocket, rockets])

    useEffect(() => {
        if (currentRocket) {
            setTitle(currentRocket.title)
            setBoosters(currentRocket.boosters)

            if (currentRocket.boosters) {
                setEditBoosters(true)
            } else {
                setEditBoosters(false)
            }
        }
    }, [currentRocket])

    useEffect(() => {
        if (stage1 && stage2) {
            if (currentRocket) {
                let rocket = new Rocket(stage1,stage2, "", boosters)
                setCalcResult(Helpers.writeResult(rocket))
            }
        }
    }, [stage1, stage2, boosters])

    return <Box sx={{ display: 'flex', flexDirection : "column" ,  alignItems : "space-between", justifyContent: 'center', width : "100%", height : "80%" }}>
        <Box sx={{display : "flex"}}>
            <Box sx={{display : "flex"}}>
        <EditableTextField 
        value={title}
        onInput={(e) => setTitle(e)}
        />
    </Box>
    
        <Box sx={{display : "flex", justifyContent : "flex-end"}}>
            <FormGroup>
        <FormControlLabel control={<Switch sx={{display : "flex", justifyContent : "flex-end"}} 
        onChange={(e) => setEditBoosters(e.target.checked)}
        checked={editBoosters}
        />} label={editBoosters ? 
        
        <Box sx={{display : "flex", justifyContent : "flex-end"}}>
            <TextField 
            type="number" 
            size='small'
            margin="none"
            sx={{width : "50%"}}
            inputProps={{ step: 1 }}
            onKeyDown={(e) => {
                if (e.keyCode === 38 || e.keyCode === 40) {
                e.preventDefault();
                }
            }}
            value={boosters} 
            onChange={(e : any) => setBoosters(+e.target.value)}
            />
        </Box>
         : "Boosters"}/>
    </FormGroup>
        </Box>
        </Box>
    
    


{currentRocket && <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: "8px" }}>
<Stage
stageNumber={2}
onInput={onStageInput}
value={currentRocket!.stage2}
/>
<Stage
stageNumber={1}
onInput={onStageInput}
value={currentRocket.stage1}
/>
</Box>}
<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }} margin={1}>
<Typography variant="subtitle1" gutterBottom>
  Results:
</Typography>
<Typography variant="body2" gutterBottom>
  {calcResult.split("\n").map(r => {
    return <div>{r}</div>
  })}
</Typography>
</Box>
<Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%'}}>
<Button variant="contained" onClick={() => save()}>Save</Button>
<Box sx={{ display: 'flex', justifyContent: 'space-between', gap : "4px" }}>
  <Button variant="contained" onClick={() => decrement()}>Previous</Button>
  <Button variant="contained" onClick={() => increment()}>Next</Button>
  <Button variant="contained" onClick={() => addNewRocket()}>New</Button>
</Box>
</Box>
</Box>

}

export default Calculator