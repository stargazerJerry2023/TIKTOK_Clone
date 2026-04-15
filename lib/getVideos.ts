"use server";

import { VideoResponse, VideoRes } from "@/types/backend/types";

const API_KEY = process.env.API_KEY;


const GetVideos=async(type:string, query:string|null, pages:number, per_page:number =5)=> {
if (!API_KEY || API_KEY==""){
  throw new Error("missing API key")
}
const res = await(await fetch("https://api.pexels.com/v1/videos/search?query=nature&page=1&per_page=1",{headers: {Authorization: API_KEY}})).json()
const videos: VideoRes[] = res.videos.map((video: any)=> {
  return {id: video.id,
  width: video.id, 
  height: video.height, 
  url: video.video_files[0].link, 
  duration: video.duration?video.duration:0,
  size: video.size, 
  user:{
    id: video.user?.id,
    name: video.user?.name, 
    url: video.user?.url
  }
}
})
return videos
}
export default GetVideos

