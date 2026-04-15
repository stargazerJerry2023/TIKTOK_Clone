"use client";
import { VideoResponse } from "@/types/backend/types";
import { useCallback, useEffect, useRef, useState } from "react";


export default function VideoFeed({url}: {url: string}) {
    const videoRef= useRef<HTMLVideoElement>(null)
  const [isPaused, setPaused]= useState<{
    type: boolean,
    id: number
  } | null>(null);


  const togglePlay = (e: React.MouseEvent<HTMLDivElement>)=> {
    e.stopPropagation()
    if (videoRef.current){
      if (videoRef.current.paused){
        setPaused({type: false, id: Date.now()})
      }
  }
  }


  return (
    <>
      <div className= "h-full w-full overflow-hidden relative flex justify-center items-center">
        <video ref={videoRef}  src={url}  className= "z-0 absolute inset-0 h-full object-cover rounded-2xl"/>
      <div className="absolute inset-0 z-10 w-full h-full flex justify-center items-center" onClick={
        togglePlay
      }>
           {isPaused && (
          <img
            key={isPaused.id}
            src={isPaused.type ? "/pause.png" : "/play.png"}
            className="w-[60px] h-[60px] animate-float-up pointer-events-none"
            alt={isPaused.type ? "Pause" : "Play"}
          />
        )}
      </div>
      
    </div>
        </>
  );
}

