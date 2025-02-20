import { is } from "@electron-toolkit/utils";
import { app, BrowserWindow, ipcMain, shell } from "electron";
import { startServer } from "next/dist/server/lib/start-server";
import { join } from "path";
import url from "url";

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    webPreferences: {
      preload: join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation:true,
    },
    frame:false,
  });

    // Intercept navigation within the app
  mainWindow.webContents.on('will-navigate', (event, navigationUrl) => {
    console.log('Navigating to:', navigationUrl);

    // Check if the navigation URL is external
    if (isExternalLink(navigationUrl)) {
      event.preventDefault();  // Prevent navigation inside the app
      shell.openExternal(navigationUrl); // Open external URLs in the default browser
    }
  });



  mainWindow.on("ready-to-show", () => mainWindow.show());

  const loadURL = async () => {
    if (is.dev) {
      mainWindow.loadURL("http://localhost:3000");
    } else {
      try {
        const port = await startNextJSServer();
        // console.log("Next.js server started on port:", port);
        mainWindow.loadURL(`http://localhost:3000`);
      } catch (error) {
        console.error("Error starting Next.js server:", error);
      }
    }
  };

  loadURL();
  return mainWindow;
};

const startNextJSServer = async () => {
  try {
    // const nextJSPort = await getPort({ portRange: [30_011, 50_000] });
    const webDir = join(app.getAppPath(), "app");

    await startServer({
      dir: webDir,
      isDev: false,
      hostname: "localhost",
      port: 3000,
      customServer: true,
      allowRetry: false,
      keepAliveTimeout: 5000,
      minimalMode: true,
    });

    return;
  } catch (error) {
    console.error("Error starting Next.js server:", error);
    throw error;
  }
};

ipcMain.handle('get-window-state', () => {
  const focusedWindow = BrowserWindow.getFocusedWindow();
  if (focusedWindow) {
    return {
      isMaximized: focusedWindow.isMaximized(),
      isMinimized: focusedWindow.isMinimized(),
      isFullScreen: focusedWindow.isFullScreen(),
    };
  }
  return null;
});

ipcMain.on('minimize-window', () => {
  const win = BrowserWindow.getFocusedWindow();
  if (win) win.minimize();
});

ipcMain.on('maximize-window', () => {
  const win = BrowserWindow.getFocusedWindow();
  if (win) 
  {
    if (win.isMaximized()){
      win.unmaximize();
    }
    else {
      win.maximize();
    }
  }
    
});

ipcMain.on('close-window', () => {
  const win = BrowserWindow.getFocusedWindow();
  if (win) win.close();
});

app.whenReady().then(() => {
  createWindow();

  ipcMain.on("ping", () => console.log("pong"));
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});


function isExternalLink(navigationUrl) {
  // Parse the URL
  const parsedUrl = url.parse(navigationUrl);

  // Check if the URL has a protocol (i.e., it is a complete URL, not relative)
  if (parsedUrl.protocol && parsedUrl.hostname) {
    // If the domain is not localhost or your app's URL, it’s external
    return parsedUrl.hostname !== 'localhost' && parsedUrl.hostname !== '127.0.0.1';
  }

  // If it’s a relative URL, it should stay inside the app
  return false;
}