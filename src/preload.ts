import {contextBridge, ipcRenderer} from "electron"

contextBridge.exposeInMainWorld("main", {
    platform: () => process.platform,
    saveRocket : (data : any) => ipcRenderer.send("saveRocket",data),
    loadRockets : () => ipcRenderer.invoke("loadRockets")
})