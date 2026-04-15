"use server";

import VideoFeed from "@/component/Video";
import GetVideos from "@/lib/getVideos"
export default async function Home() {
  // TODO: Fetch initial videos from Pexels and pass them to <VideoFeed />
  // Suggested starter:
  // const data = await getVideosByQuery("space", 1, 5);
  // return <VideoFeed videoRes={data} />;
   const data =await  GetVideos("","",0,0)
  console.log(data[0].url)
 
  return (
    <main className="h-screen w-screen grid place-items-center">
      <p className="text-lg">Workshop TODO: Implement app/page.tsx</p>
      <VideoFeed url={data[0].url} />
    </main>
  );
}
