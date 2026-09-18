import React from 'react'
import { motion } from "motion/react"
function Auth(){
    return(
        <div className='min-h-screen overflow-hidden bg-white text-black px-8'>
          <motion.header 
          initial={{opacity: 0 ,y:-15}}
          animate={{opacity:1 , y:0}}
          transition={{duration:1.5}}
          className="max-w-7xl mx-auto mt-8
                              rounded-2xl
                              bg-black/80 backdrop-blur-xl
                              border border-white/10
                              px-8 py-6
                              shadow-[0_20px_45px_rgba(0,0,0,0.6]">
         <h1 className='text 2-xl font-bold
         bg-linear-to-r from-white via-gray-300 to-white
         bg-clip-text text-transparent'>
            Exam-Notes-AI
            </h1>
            <p className='text-sm text-gray-300 mt-1'>
                AI powered exam-oriented notes & revision</p>
          </motion.header>

          <main className='max-w-7xl mx-auto py-10 grid grid-cols-1 lg:grid-cols-2 gap-20
          items-center'>
          {/* LEFT CONTENT */}

           <motion.div
          initial={{opacity: 0 ,x:-60}}
          animate={{opacity:1 , x:0}}
          transition={{duration:1.5}}>
          
              <h1 className='text-5xl lg:text-6xl font-extrabold leading-tight
              bg-gradient-to-br from-black/90 via-black/60 to-black/90
              bg-clip-text text-transparent'>
                 Unlock Smart <br/> AI Notes
              </h1>

           </motion.div>
    
          {/*RIGHT CONTENT*/}

            <div>

               

            </div>
                

       
          </main>

        </div>
    )
}

export default Auth  