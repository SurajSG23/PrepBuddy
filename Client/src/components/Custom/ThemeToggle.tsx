import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const ThemeToggle = () => {
     
    const [isDarkMode, setIsDarkMode] = useState(false);
    
    useEffect(() => {
        if( localStorage.getItem('theme') === 'dark'){
            document.documentElement.classList.add('dark');
            setIsDarkMode(true);
        }
        
    },[])
    const toggleTheme = () => {
        if( localStorage.getItem('theme') === 'dark' || document.documentElement.classList.contains('dark')){
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            setIsDarkMode(false);
        }else{
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            setIsDarkMode(true);
        }
    }
    return (
         <button onClick={toggleTheme} className="p-1 cursor-pointer hover:bg-slate-700 rounded-full hover:scale-120 transition-all duration-300">
            
            {!isDarkMode ?  (<Sun className="h-6 w-6 text-yellow-300"/>) : (<Moon className="h-6 w-6 text-blue-700"/>)
            }
         </button>
    )
};

export default ThemeToggle;