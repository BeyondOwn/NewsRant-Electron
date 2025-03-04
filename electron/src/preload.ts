import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
  ipcRenderer: {
    send: (channel: string, data: any) => ipcRenderer.send(channel, data),
    on: (channel: string, listener: (event: any, ...args: any[]) => void) => ipcRenderer.on(channel, listener),
    minimizeWindow: () => ipcRenderer.send('minimize-window'),
    closeWindow: () => ipcRenderer.send('close-window'),
    maximizeWindow: () => ipcRenderer.send('maximize-window'),
    getWindowState: () =>ipcRenderer.invoke('get-window-state'),
    checkUpdates:()=>ipcRenderer.invoke('check-updates'),
    onUpdateStatus: (callback: (data: any) => void) => {
      ipcRenderer.on('update-status', (_event, data) => callback(data));
    },
    startUpdate: () => ipcRenderer.invoke('start-update')
  },
});
