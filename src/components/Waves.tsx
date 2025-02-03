import React from 'react';

function Waves() {
  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        {/* Core dot */}
        <div className="w-3 h-3 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50 z-10 relative animate-pulse"></div>
        
        {/* Wave rings */}
        {[1, 2, 3].map((index) => (
          <div
            key={index}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-4 border-blue-500/30 rounded-full animate-[wave_3s_ease-in-out_infinite]"
            style={{
              width: `${index * 25}px`,
              height: `${index * 25}px`,
              animationDelay: `${index * 0.3}s`,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default Waves;