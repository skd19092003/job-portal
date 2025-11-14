import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import { Contact2 } from 'lucide-react'


const Footer = () => {
  return (
   <div className='p-6 lg:p-8 text-center flex flex-col items-center justify-center  bg-slate-900 mt-2 '>
         <p className='flex items-center flex-row gap-x-2'>
           MADE WITH ❤️ BY 
           <Contact2 size={18} />
           <Link to="https://www.linkedin.com/in/skd03/" target='blank'>
           <Button className="p-3  hover:bg-gray-500" >SKD</Button>
            </Link> 
           
          </p>
         

         <p>
           @COPYRIGHTS 2025 RIGHTS RESERVED.
          </p>
         
      </div>
  )
}

export default Footer