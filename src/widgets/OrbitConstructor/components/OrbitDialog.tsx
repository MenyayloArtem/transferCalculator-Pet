import { Box, Button, Dialog, DialogTitle, List, ListItem, ListItemButton, ListItemText, TextField } from '@mui/material';
import React, { useCallback, useState } from 'react';
import Orbit from "../../../entity/Orbit"
import EditableTextField from '../../../components/EditableTextField';

interface Props {
    open : boolean,
    orbit : Orbit,
    bodyName : string
    onSave : (orbit : Orbit, name : string) => void,
    onClose : () => void
}

function OrbitDialog (props : Props) {
    const {orbit, onSave, open, onClose} = props
    // const [open, setOpen] = useState<boolean>(true)

    const [name, setName] = useState<string>(props.bodyName)
    const [Ap, setAp] = useState<number>(orbit.Ap)
    const [Pe, setPe] = useState<number>(orbit.Pe)
    const [ascNodeLong, setAscNodeLong] = useState<number>(orbit.ascNodeLong)
    const [peArg, setPeArg] = useState<number>(orbit.peArg)

    function onInput (setter : Function) {
        return (e : any) => {
            setter(+e.target.value)
        }
    }

    const save = useCallback(() => {
        const newOrbit = new Orbit({Ap, Pe,peArg, ascNodeLong}, 0)
        onSave(newOrbit, name)
        onClose()
    }, [Ap, Pe,peArg, name, ascNodeLong])

    return <Dialog onClose={() => onClose()} open={open}>
    <DialogTitle>
      <EditableTextField 
        value={name}
        onInput={(e) => setName(e)}
        autofocus={true}
        />
    </DialogTitle>
    <List sx={{ pt: 0, margin : "0 6px" }}>

        <ListItem disableGutters key={1}>

            <Box sx={{display : "flex", flexDirection : "column"}}>
                
                <TextField
                margin='dense'
                label="Апоцентр"
                size='small'
                placeholder='Апоцентр'
                defaultValue={orbit.Ap}
                onInput={onInput(setAp)}
                ></TextField>
                
                <TextField
                margin='dense'
                label="Перицентр"
                size='small'
                placeholder='Перицентр'
                defaultValue={orbit.Pe}
                onInput={onInput(setPe)}
                ></TextField>

                <TextField
                margin='dense'
                label="Аргумент перицентра"
                size='small'
                placeholder='Аргумент перицентра'
                defaultValue={orbit.peArg}
                onInput={onInput(setPeArg)}
                ></TextField>

                <TextField
                margin='dense'
                label="Долгота восходящего узла"
                size='small'
                placeholder='Долгота восходящего узла'
                defaultValue={orbit.ascNodeLong}
                onInput={onInput(setAscNodeLong)}
                ></TextField>
            </Box>
        </ListItem>
      <ListItem disableGutters>
        <Button
          variant='contained'
          onClick={() => save()}
        >
          <ListItemText primary="Save" />
        </Button>
      </ListItem>
    </List>
  </Dialog>
}

export default OrbitDialog