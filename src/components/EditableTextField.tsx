import React, { useEffect, useState } from 'react';
import { InputAdornment, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import useClickOutside from "../hooks/useClickOutside"

interface Props {
    value : string,
    onInput : (e : string) => void,
    autofocus? : boolean
}

function EditableTextField (props : Props) {

    const {value, onInput} = props
    const [canEdit, setCanEdit] = useState<boolean>(false)
    const [inputValue, setInputValue] = useState<string>(props.value)
    const {ref, isComponentVisible} = useClickOutside(false)

    useEffect(() => {
        setInputValue(props.value)
    },[props.value])

    useEffect(() => {
        onInput(inputValue)
    }, [inputValue])

    return <TextField 
    ref={ref}
    size='small'
    variant='standard'
    autoFocus={props.autofocus}
    sx={{width : "90%"}}
    value={inputValue}
    disabled={!canEdit && !isComponentVisible}
    onClick={() => setCanEdit(true)}
    onInput={(e : any) => setInputValue(e.target.value)}
    InputProps={{
        startAdornment: (
        <InputAdornment position="start">
            <EditIcon fontSize='medium'
            
            />
        </InputAdornment>
        ),
    }}
    />
}

export default EditableTextField