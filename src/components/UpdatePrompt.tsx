import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useEffect, useState } from 'react';

export default function UpdatePrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [updateStatus, setUpdateStatus] = useState('');
  const [downloadProgress, setDownloadProgress] = useState(0);

  useEffect(() => {
    // Listen for update notifications from main process
    window.electron.ipcRenderer.onUpdateStatus((data) => {
      switch (data.status) {
        case 'available':
          setShowPrompt(true);
          break;
        case 'downloading':
          setUpdateStatus('Downloading update...');
          setDownloadProgress(data.progress?.percent || 0);
          break;
        case 'downloaded':
          setUpdateStatus('Update downloaded! Restarting...');
          break;
        case 'error':
          setUpdateStatus(`Error: ${data.error}`);
          break;
      }
    });
  }, []);

  const handleUpdate = () => {
    setShowPrompt(false);
    window.electron.ipcRenderer.startUpdate();
    setUpdateStatus('Starting download...');
  };

  return (
    <>
      <AlertDialog open={showPrompt}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update Available</AlertDialogTitle>
            <AlertDialogDescription>
              A new version of the application is available. Would you like to update now?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
                setShowPrompt(false)
                setUpdateStatus('Starting download...');
                }}>
              Later
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleUpdate}>
              Update Now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {updateStatus && (
        <div className="fixed bottom-4 right-4  bg-background border-2 border-secondary-foreground shadow-lg rounded-lg p-4 max-w-md">
          <p className="text-sm font-medium">{updateStatus}</p>
          {downloadProgress > 0 && downloadProgress < 100 && (
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${downloadProgress}%` }}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
}