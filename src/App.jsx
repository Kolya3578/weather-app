import React from "react";

const App = () => {
  return (
    <div className='relative flex justify-center items-center px-4 min-h-screen bg-weather-gradient'>
      <div className='max-w-5xl w-full shadow-2xl p-8 bg-weather-gradient backdrop-blur-sm rounded-2xl space-y-6 border-white/20'>
        <div className='flex flex-col md:flex-row justify-between items-center gap-4 relative'>
           <h1 className='font-bold text-4xl text-white tracking-wide'>
            Weather Now
            </h1>
            
          </div>
      </div>
    </div>
  );
}

export default App;