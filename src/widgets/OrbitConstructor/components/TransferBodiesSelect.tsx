import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import React from 'react';

interface TransferBody {
    index : number
    onChange : (s : any) => void
}

interface Props {
  names : string[]
  body1 : TransferBody,
  body2 : TransferBody
}

function TransferBodiesSelect (props : Props) {
  const {names, body1, body2} = props
    return <Box sx={{display : "flex", justifyContent : "space-between", width : "100%"}}>
    <FormControl variant="standard" sx={{ m: 1, width : "100px" }}>
    <InputLabel id="demo-simple-select-standard-label">Тело 1</InputLabel>
    <Select
      labelId="demo-simple-select-standard-label"
      id="demo-simple-select-standard"
      value={names[body1.index]}
      onChange={(e) => body1.onChange(e.target.value as any)}
      label="Тело 1"
      renderValue={(selected) => {
        return selected
      }}
    >
      {
        names.map((name,i) => {
          return i != body2.index ? <MenuItem value={i}>
          {name}
        </MenuItem> : <></>
        })
      }
    </Select>
  </FormControl>

  <FormControl variant="standard" sx={{ m: 1, width : "100px" }} disabled={body1.index == null}>
    <InputLabel id="demo-simple-select-standard-label">Тело 2</InputLabel>
    <Select
      labelId="demo-simple-select-standard-label"
      id="demo-simple-select-standard"
      value={body2.index != null ? names[body2.index] : ""}
      onChange={(e) => body2.onChange(e.target.value as any)}
      label="Тело 2"
      renderValue={(selected) => {
        return selected || ""
      }}
    >
      {
        names.map((name,i) => {
          return i != body1.index ? <MenuItem value={i}>
          {name}
        </MenuItem> : <></>
        })
      }
    </Select>
  </FormControl>
</Box>
}

export default TransferBodiesSelect