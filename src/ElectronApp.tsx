import React, { useCallback, useEffect, useState } from 'react';
import Stage from './components/Stage';
import Rocket, { IRocket } from './entity/Rocket';
import { IStage } from './entity/StageClass';
import "../public/style.css"
import Helpers from './Helpers';
import usePagination from "./hooks/usePagination"
import { Box, Button, FormControlLabel, FormGroup, Grid, InputAdornment, Switch, TextField, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import Calculator from "./widgets/Calculator/Calculator"
import OrbitConstructor from "./widgets/OrbitConstructor/OrbitConstructor"

enum Pages {
  Calculator = "calculator",
  Constructor = "construntor"
}

function ElectronApp () {

    const [page, setPage] = useState<Pages>(Pages.Calculator)

    function checkPage (givenPage : Pages) {
      return page == givenPage ? "outlined" : "contained"
    }

    return (
        <Grid container spacing={0.5} columns={1}>
            {/* Test */}
            {page == Pages.Calculator && <Calculator />}
            {page == Pages.Constructor && <OrbitConstructor />}
            {/* <OrbitConstructor /> */}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop : "10px" }}>
            <Button variant={checkPage(Pages.Calculator)}
            onClick={() => setPage(Pages.Calculator)}
            >
                Calculator
            </Button>
            <Button variant={checkPage(Pages.Constructor)}
            onClick={() => setPage(Pages.Constructor)}
            >
                Orbit
            </Button>
          </Box>
        </Grid>
      );
}

export default ElectronApp