import React from 'react';
import { SubjectType } from '../types';

interface VisualizerProps {
  subjectId: SubjectType;
  prompt: string;
}

const Visualizer: React.FC<VisualizerProps> = ({ subjectId, prompt }) => {
  // We simulate 3D using CSS animations based on the subject type
  // In a real production app, this would use Three.js
  
  const getPlaceholderImage = () => {
    // Generate a consistent random image based on prompt length
    const id = prompt.length % 50; 
    return `https://picsum.photos/seed/${id}/600/400`;
  };

  return (
    <div className="w-full h-[400px] bg-slate-900 rounded-xl overflow-hidden relative flex flex-col items-center justify-center shadow-inner group">
      
      {/* 3D Simulation Container */}
      <div className="perspective-1000 w-64 h-64 relative preserve-3d animate-float">
        
        {subjectId === SubjectType.PHYSICS || subjectId === SubjectType.CHEMISTRY ? (
          // Atom / Molecule Simulation
          <div className="w-full h-full relative animate-[spin_10s_linear_infinite] preserve-3d">
             <div className="absolute inset-0 border-4 border-blue-400 rounded-full opacity-60 rotate-x-45"></div>
             <div className="absolute inset-0 border-4 border-red-400 rounded-full opacity-60 rotate-y-45"></div>
             <div className="absolute inset-0 border-4 border-green-400 rounded-full opacity-60 rotate-45"></div>
             <div className="absolute top-1/2 left-1/2 w-8 h-8 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.8)] -translate-x-1/2 -translate-y-1/2"></div>
             <div className="absolute top-0 left-1/2 w-3 h-3 bg-blue-300 rounded-full shadow-lg"></div>
          </div>
        ) : subjectId === SubjectType.ASTRONOMY ? (
          // Planet Simulation
          <div className="w-40 h-40 bg-gradient-to-br from-indigo-500 to-purple-800 rounded-full shadow-[inset_-20px_-20px_50px_rgba(0,0,0,0.5),0_0_30px_rgba(100,100,255,0.4)] animate-[spin_20s_linear_infinite] relative">
             <div className="absolute top-1/2 left-1/2 w-60 h-60 border-[20px] border-slate-700/30 rounded-full -translate-x-1/2 -translate-y-1/2 rotate-x-75"></div>
          </div>
        ) : subjectId === SubjectType.BIOLOGY ? (
          // Cell / Organic Simulation
          <div className="w-48 h-48 bg-emerald-200/20 backdrop-blur-sm rounded-[40%_60%_70%_30%/40%_50%_60%_50%] border-2 border-emerald-400/50 animate-[pulse_4s_ease-in-out_infinite] flex items-center justify-center relative shadow-[0_0_40px_rgba(16,185,129,0.2)]">
            <div className="w-16 h-16 bg-emerald-600 rounded-full blur-sm opacity-60"></div>
          </div>
        ) : (
          // Math / Default - Geometric
          <div className="w-32 h-32 bg-gradient-to-tr from-red-500 to-orange-500 transform rotate-45 animate-bounce shadow-xl"></div>
        )}
      </div>

      <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md p-3 rounded-lg border border-white/10">
        <p className="text-xs text-blue-300 uppercase font-bold mb-1">Interactive 3D Visualization</p>
        <p className="text-sm text-white">{prompt}</p>
      </div>
      
      {/* Fallback image layer for complexity */}
      <img 
        src={getPlaceholderImage()} 
        className="absolute inset-0 w-full h-full object-cover opacity-10 -z-10 mix-blend-overlay"
        alt="Background texture"
      />
    </div>
  );
};

export default Visualizer;