import { app, BrowserWindow, ipcMain } from "electron"
import path from "path"
import fs from "fs"
import Rocket from "./entity/Rocket"


let savesExists =  fs.existsSync("./saves")

if (!savesExists) {
    fs.mkdir("saves",{recursive : true}, () => {
        writeSaves([])
    })
}

let w : BrowserWindow|null = null

const createWindow = () => {
    w = new BrowserWindow({
        width : 400,
        height : 700,
        webPreferences : {
            preload : path.join(__dirname, "preload.js")
        }
    })

    w.loadFile("./dist/index.html")
}

const readSaves = () : Rocket[] => {
    let data = fs.readFileSync("./saves/rockets.json", "utf-8")
    return JSON.parse(data)
}

const writeSaves = (rockets : Rocket[]) => {
    fs.writeFileSync("./saves/rockets.json", JSON.stringify(rockets, null, 2))
}

app.whenReady()
.then(() => {

    createWindow()

    ipcMain.handle('saveRocket', (event : any, arg : string) => {
        console.log(arg, "h"); // Выведет 'Hello from Renderer'
      });

      ipcMain.handle("loadRockets", (event, i) => {
        return readSaves()
      })

    ipcMain.on('saveRocket', (event : any, rockets : Rocket[]) => {
       
        writeSaves(rockets)
        w!.webContents.send("saved", rockets)
    });

    

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})


app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit()
    }
})