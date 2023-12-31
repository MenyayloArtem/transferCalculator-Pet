import { Avatar, Box, Button, Dialog, DialogTitle, Fab, FormControl, InputLabel, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, MenuItem, Select, Slider, TextField, Typography } from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Canvas from "../../entity/Canvas"
import Orbit from "../../entity/Orbit"
import Simulation from "../../entity/Simulation"
import AddIcon from '@mui/icons-material/Add';
import OrbitDialog from "./components/OrbitDialog"
import TransferBodiesSelect from "./components/TransferBodiesSelect"

const Ap = 10000000
const Pe = 10000000
const peArg = 20
const ascNodeLong = 330

let defaultOrbit = new Orbit({
    Ap, Pe,peArg, ascNodeLong
}, 0)

let emplyOrbit = new Orbit({
  Ap : 20000, Pe : 20000, peArg : 0, ascNodeLong
}, 0)


function OrbitConstructor () {

    const [orbits, setOrbits] = useState<Orbit[]>([defaultOrbit])

    const [names, setNames] = useState<string[]>(["Земля"])

    const [openedDialog, setOpenedDialog] = useState<number|null>(null)

    const [simulationSpeed, setSimulationSpeed] = useState<number>(100)
    const [dT, setDT] = useState<number>(Simulation.maxDt * (simulationSpeed / 100))
    const t0 = useRef<any>(0)

    const displayRef = useRef<Canvas>()
    const simulationRef = useRef<Simulation>()

    const transferClock = useRef<number>(0)
    const transferRef = useRef<Orbit|null>()

    const [orbit1Index, setOrbit1] = useState<number>(0)
    const [orbit2Index, setOrbit2] = useState<number|null>(null)

    const [debug, setDebug] = useState<string>("")

    const handleSpeedChange = useCallback((e : any, value : any) => {
      setSimulationSpeed(value)
    }, [])

    const addOrbit = useCallback((orbit : Orbit, name : string) => {
      setOrbits(orbits => [...orbits, orbit])
      setNames(n => [...n, name])
    }, [])

    const editOrbits = useCallback((newOrbit : Orbit, i : number, name : string) => {
      setOrbits(orbits.map((orbit, a) => {
        if (i == a) return newOrbit
        return orbit
      }))

      setNames((names) => names.map((n,a) => {
        if (i == a) return name
        return n
      }))
    }, [orbits])

    useEffect(() => {
      setDT(Simulation.maxDt * (simulationSpeed / 100))
    }, [simulationSpeed])

    useEffect(() => {

      if (!displayRef.current) {
        let display = new Canvas("canv",0,0,0.000005)
        displayRef.current = display
      }

      let simulation = new Simulation(displayRef.current, orbits)
      simulationRef.current = simulation
        
      let display = displayRef.current
        
        simulation.time = t0.current
        simulation.dT = dT
        
        
        let interval = simulation.run((t) => {
          if (orbit1Index == null || orbit2Index == null) {
              return
          }


          let orbit1 = orbits[orbit1Index!]
          let orbit2 = orbits[orbit2Index!]

          t0.current = t

          function inRange (num1 : number,num2 : number, range = 10) {
              return Math.abs(num1 - num2) <= range
          }

          let Qn = Orbit.cutPI(orbit1.Q + Orbit.toRad(orbit1.ascNodeLong + orbit1.peArg - orbit2.peArg - orbit2.ascNodeLong + 180))

          let R = orbit2.Q2R(Qn)

          let [nx, ny] = orbit2.calcCoordsAt(Qn, R)

          let transfer : Orbit
          let angleBetween = Orbit.angleBetween(orbit2, orbit1)

          let highTransfer = orbit1.a < orbit2.a

          let Ap = highTransfer ? R - Orbit.bodyR : orbit1.R - Orbit.bodyR
          let Pe = highTransfer ? orbit1.R - Orbit.bodyR : R - Orbit.bodyR
          let initialTime = highTransfer ? 0 : Orbit.calcT(Ap,Pe) / 2
          let peArg = highTransfer ? Orbit.toAng(orbit1.Q) + orbit1.peArg : Orbit.toAng(orbit1.Q) + orbit1.peArg + 180
          let ascNodeLong = highTransfer ? orbit1.ascNodeLong : orbit2.ascNodeLong
          

          transfer = new Orbit({
            Ap : Ap,
            Pe : Pe,
            peArg : peArg,
            ascNodeLong : ascNodeLong
          }, initialTime)

          

          

          let K = orbit2.M2Q(Math.PI - Math.sqrt(Math.pow(transfer.a,3) / Math.pow(orbit2.a, 3)) * Math.PI)
          let time1 = transfer.timeToQ(highTransfer ? Math.PI : 0)
          let time2 = orbit2.timeToQ(Qn)

          time1 -= Math.floor(time1 / orbit2.T) * orbit2.T

          let color = "red"
          if (inRange(time1,time2, 100)) {
            if (!transferRef.current) {
              transferRef.current = transfer
              if (highTransfer) {
                transferClock.current = 0
              } else {
                transferClock.current = transfer.T / 2
              }
            }
            color = "yellow"
          }

           if (transferRef.current) {
            // if (highTransfer) {
            //   transferClock.current = 0
            // }
              transferClock.current += dT

              simulation.drawOrbit(transferRef.current, transferClock.current, "yellow")

              let maxT = highTransfer ? transferRef.current.T / 2 : transferRef.current.T * 0.99

              if (transferClock.current >= maxT) {
                transferRef.current = null
                transferClock.current = 0
              }
            }

            setDebug(`${transfer.T / 2} ${orbit2.T} ${time1} ${time2}`)
          display.drawArc(nx, ny, 3, color)
        })

        return () => clearInterval(interval)
    }, [orbits, dT, orbit1Index, orbit2Index])



    return <Box sx={{display : "flex", flexDirection : "column", height : "80%", width : "100%"}}>
        <canvas
        id='canv'
        width={"400px"}
        height={"400px"}
        style={{
            background : "black"
        }}
        ></canvas>

        <Box sx={{display : "flex", flexDirection : "column", margin : "10px", position : "relative"}}>

        {
          orbits.map((orbit, i) => {
            return <OrbitDialog 
            bodyName={names[i]}
            orbit={orbit}
            open={openedDialog == i}
            onSave={(o,n) => editOrbits(o,i,n)}
            onClose={() => setOpenedDialog(null)}
            />
          })
        }

        <OrbitDialog 
        bodyName=''
        orbit={emplyOrbit}
        open={openedDialog == -1}
        onSave={addOrbit}
        onClose={() => setOpenedDialog(null)}
        />

        {
          orbits.map((_,i) => {
            return <Button onClick={() => setOpenedDialog(i)}>{names[i]}</Button>
          })
        }

      <Fab size="small" color="secondary" aria-label="add"
      sx={{position : "absolute", right : 0, bottom : 0}}
      onClick={() => setOpenedDialog(-1)}
      >
        <AddIcon />
      </Fab>
        
        <TransferBodiesSelect 
        names={names}
        body1={{
          index : orbit1Index,
          onChange : setOrbit1
        }}

        body2={{
          index : orbit2Index as any,
          onChange : setOrbit2
        }}
        />
      

        <Box sx={{width : 200}}>
          <Typography>
            Скорость симуляции
          </Typography>
          <Slider
          aria-label='Speed'
          value={simulationSpeed}
          onChange={handleSpeedChange}
          ></Slider>
          {/* {debug} */}
        </Box>
        </Box>
    </Box>
}

export default OrbitConstructor