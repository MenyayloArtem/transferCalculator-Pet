import React, { useEffect, useState } from 'react';
import { IStage} from "../entity/StageClass"
import { Box, TextField, Typography } from '@mui/material';

interface Props {
    stageNumber : number,
    onInput : (stageNumber : number,stage : IStage) => void,
    value : IStage|null,
    top? : React.ReactNode
}

function Stage (props : Props) {

    const [wetMass, setWetMass] = useState<string>("")
    const [dryMass, setDryMass] = useState<string>("")
    const [payloadMass, setPayloadMass] = useState<string>("")
    const [Isp, setIsp] = useState<string>("")
    const [thrust, setThrust] = useState<number>(0)

    const [valuesInserted, setValuesInserted] = useState<boolean>(false)
    const [mounted, setMounted] = useState<boolean>(false)

    function prevareValue (setter : Function) {
        return (e : any) => {
            let value = e.target.value
            value = value.replace(",",".")
            setter(value)
        }
    }

    useEffect(() => {
            setWetMass(String(props.value!.wetMass))
            setDryMass(String(props.value!.dryMass))
            setPayloadMass(String(props.value!.payloadMass))
            setIsp(String(props.value!.Isp))
            setThrust(String(props.value!.thrust) as any)
    }, [props.value])

    useEffect(() => {
        if (mounted) {
            props.onInput(props.stageNumber,{wetMass : +wetMass,dryMass : + dryMass,payloadMass: +payloadMass,Isp: +Isp, thrust : +thrust})
        }
        setMounted(true)
    }, [wetMass,dryMass,payloadMass,Isp, thrust])

    return <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <Typography variant="h6" gutterBottom>
      Stage {props.stageNumber}
    </Typography>

    <TextField label="Wet Mass" placeholder="Wet Mass" size='small' 
    margin='dense'
        value={wetMass}
        onInput={prevareValue(setWetMass)}
    />

    <TextField label="Dry Mass" placeholder="Dry Mass" size='small'
    margin='dense' 
        value={dryMass}
        onInput={prevareValue(setDryMass)}
    />

    <TextField label="Payload Mass" placeholder="Payload Mass" size='small' 
        margin='dense'
        type='number'
        value={payloadMass}
        onInput={prevareValue(setPayloadMass)}
    />

    <TextField label="Isp" placeholder="Isp" size='small' 
    margin='dense'
        value={Isp}
        onInput={prevareValue(setIsp)}
    />

    <TextField label="Thrust" placeholder="Thrust" size='small' 
    margin='dense'
        value={thrust}
        onInput={prevareValue(setThrust)}
    />

  </Box>
}

export default Stage