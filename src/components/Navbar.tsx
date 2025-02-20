'use client'
import { useAuth } from '@/lib/context';
import {
  CircleUserRound,
  LogIn,
  LogOut,
  MenuIcon,
  Minimize2,
  Minus,
  Moon,
  Square,
  UserCog,
  X
} from "lucide-react";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FC, useEffect, useRef, useState } from 'react';
import { Separator } from './ui/separator';


type NavbarProps = object


const handleMinimize = () => {
  if (window.electron) {
    window.electron.ipcRenderer.minimizeWindow();
  }
};



const handleClose = () => {
  if (window.electron) {
    window.electron.ipcRenderer.closeWindow();
  }
};



const  Navbar: FC<NavbarProps> = ({}) => {
  const router = useRouter();
  const {user,logout} = useAuth();
  //drop menu
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [imageError, setImageError] = useState(false);
  const [isMaximized,setIsMaximized] = useState(false);

   const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const handleClickOutside = (event:MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  const checkWindowState = async () => {
    if (window.electron) {
      try {
        const state = await window.electron.ipcRenderer.getWindowState(); 
  
        if (state) {
          setIsMaximized(state.isMaximized);
        } else {
          console.log("No focused window");
        }
      } catch (error) {
        console.error("Error checking window state:", error);
      }
    }
  };
  

  const handleMaximize = () => {
    if (window.electron) {
      window.electron.ipcRenderer.maximizeWindow();
      checkWindowState();
    }
  };
  

  useEffect(() => {
    checkWindowState();
    window.addEventListener("resize", checkWindowState);

    return () => {
      window.removeEventListener("resize", checkWindowState);
    };
  }, []);

    // Add and clean up event listener for clicks outside
    useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

     // Close the menu when an item is clicked
    

      if (!user){

      }
      // console.log(user?.picture);

  return <div className="z-10 titlebar-drag-region flex flex-row justify-between items-center sticky w-full top-0 left-0 bg-gradient-to-r px-4 py-2 border-b-2 bg-background max-h-[80px]">
    
    <MenuIcon size={32} className='titlebar-no-drag hover:cursor-pointer' onClick={()=>{window.location.href="/"}}></MenuIcon>
    <img onClick={()=>{window.location.href="/"}} className='titlebar-no-drag justify-self-center text-secondary-foreground hover:cursor-pointer' src='sr-logo-full-colored-light.svg' alt='logo' width={240} height={80}></img>
      <div className='text-right flex items-center'>
      {user? (
          <div className="titlebar-no-drag relative inline-block text-left" ref={menuRef}>
          {user?.picture && !imageError ? (
            <Image 
              onClick={toggleMenu} 
              className="cursor-pointer rounded-full" 
              alt="user profile pic" 
              width={32} 
              height={32} 
              src={user.picture}
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <CircleUserRound 
              onClick={toggleMenu} 
              width={32} 
              height={32} 
              className="titlebar-no-drag cursor-pointer"
            />
          )}
           
          {isOpen && (
            <div className="absolute  right-0 mt-[0.7rem] border-0 min-w-[256px] bg-secondary rounded-sm  leading-4">
              <div className='flex flex-row place-items-center gap-2  px-2 py-2 min-h-[56px]'>
               
              {user?.picture && !imageError ? (
                <Image 
                  className="rounded-full" 
                  alt="user profile pic" 
                  width={40} 
                  height={40} 
                  src={user.picture}
                  onError={() => setImageError(true)}
                  loading="lazy"
                />
              ) : (
                <CircleUserRound 
                  width={40} 
                  height={24} 
                />
              )}
             
                  <span className='font-serif font-bold break-words break-all'>{user?.name}</span>
                 
                  </div>
                  <Separator className='bg-secondary-foreground'/>
              <ul className='flex flex-col '>
                <li
                  onClick={()=>{setIsOpen(false);router.push('/profile')}}
                  className="flex items-center px-4 py-2 hover:bg-secondary-hover cursor-pointer rounded-none min-h-[56px] "
                >
                  <div className='flex items-center gap-2  '> 
                  <UserCog width={24} height={24}/>
                  
                  <span className=''>View Profile</span>
                  </div>
                  
                </li>
                <li
                  // onClick={handleItemClick}
                  className="flex items-center px-4 py-2 hover:bg-secondary-hover cursor-pointer rounded-none min-h-[56px]"
                >
                  <div className='flex items-center gap-2'>
                  <Moon width={24} height={24}/>
                  <span className='mr-8'>Dark Mode</span>
                  </div>
                </li>
                <li
                  onClick={()=>{setIsOpen(false);logout();}}
                  className="flex px-4 py-2 hover:bg-secondary-hover cursor-pointer rounded-none items-center min-h-[56px]"
                >
                  <div className='flex items-center gap-2'>
                    <LogOut width={24} height={24}/>
                    <button onClick={logout}>Logout</button>
                  </div>
                  
                </li>
              </ul>
            </div>
          )}
        </div>
      ) 
      : 
      (
        <div className='relative inline-block text-left '>
                <div className='flex items-center  '>
                  <div className='flex gap-2 items-center p-2'>
                  <div className='flex items-center gap-2 justify-center '>
                  <Moon width={24} height={24}/>
                  <span className=''>Dark Mode</span>
                  
                  </div>
                  
                  </div>
                  <div onClick={()=>router.push('/login')} className='flex items-center gap-2 ml-4 hover:bg-neutralHover cursor-pointer p-2'>
                    <LogIn width={24} height={24}/>
                    <button >Login</button>
                  </div>
                  
                </div>
                
                  
        </div>
      )}
      <div className='titlebar-no-drag ml-2 flex flex-row gap-1'>
        <Minus className='cursor-pointer hover:bg-secondary' onClick={handleMinimize}></Minus>
        {isMaximized ? (
          <Minimize2  className='cursor-pointer hover:bg-secondary' onClick={handleMaximize}></Minimize2>
        ):
        (
          <Square  className='cursor-pointer hover:bg-secondary' onClick={handleMaximize}></Square>
        )}
        
        <X className='cursor-pointer hover:bg-secondary' onClick={handleClose}></X>
        </div>
    
      
  </div>
  </div>
}

export default Navbar