import { UpdateCheckResult } from "electron-updater";

// electron-window.d.ts
declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        send: (channel: string, ...args: any[]) => void;
        on: (channel: string, listener: IpcRendererListener) => Electron.IpcRenderer;
        minimizeWindow: () =>void;
        closeWindow: () =>void;
        maximizeWindow: ()=>void;
        getWindowState: ()=>{isMaximized:boolean,isMinimized:boolean,isFullScreen:boolean} | null;
        checkUpdates:()=>UpdateCheckResult;
        onUpdateStatus: (callback: (data: UpdateStatus) => void) => void;
        startUpdate: () => Promise<void>;
      };
    };
  }
}

export { };

