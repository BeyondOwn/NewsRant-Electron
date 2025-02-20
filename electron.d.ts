// electron-window.d.ts
declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        send: (channel: string, ...args: any[]) => void;
        minimizeWindow: () =>void;
        closeWindow: () =>void;
        maximizeWindow: ()=>void;
        getWindowState: ()=>{isMaximized:boolean,isMinimized:boolean,isFullScreen:boolean} | null;
      };
    };
  }
}

export { };

