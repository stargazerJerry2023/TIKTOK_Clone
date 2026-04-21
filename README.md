## Workshop 1 — `lib/getVideos.ts`
Each section below is **one change**: short explanation, then a **code block** with only that change.
---
### Section A — Build the URL from `query`, `pages`, and `per_page`
**Text:**  
The starter hardcodes `nature`, page `1`, and `per_page` in the URL, so your function arguments are never used. Replace the fixed URL with a template string that uses your parameters. `encodeURIComponent` keeps queries with spaces or special characters safe.
**Code (replace your `fetch` URL):**
```ts
const res = await fetch(
  `https://api.pexels.com/v1/videos/search?query=${encodeURIComponent(query ?? "")}&page=${pages}&per_page=${per_page}`,
  { headers: { Authorization: API_KEY } },
);
Section B — Check HTTP status before parsing JSON
Text:
fetch resolves even when the server returns 401, 404, or 500. Parse JSON only after you confirm success with res.ok, and throw a clear error otherwise.

Code (add after await fetch, before res.json()):

if (!res.ok) {
  throw new Error("Failed to fetch videos");
}
Section C — Parse the body in a separate step
Text:
Avoid await (await fetch(...)).json() as a single expression. Store the Response, validate it, then call .json() on a variable you name (e.g. data).

Code:

const data = await res.json();
Section D — Fix width in the mapper
Text:
The starter sometimes sets width from video.id, which is incorrect. Use the real width from the API.

Code (inside your .map callback object):

width: video.width,
Section E — Add tags to match VideoRes
Text:
Your VideoRes type includes tags. The API may or may not include it; default to an empty array so the field is always present.

Code (inside your .map callback object):

tags: video.tags || [],
Section F — Return VideoResponse instead of a bare array
Text:
Callers (like page.tsx → VideoFeed) need pagination fields plus the list. Return page, per_page, and videos from the parsed JSON.

Code (replace return videos):

return {
  page: data.page,
  per_page: data.per_page,
  videos,
};
Section G — Type the function and use a named export
Text:
Annotate the return type as Promise<VideoResponse> so TypeScript catches mistakes. Export getVideosByQuery by name so imports match import { getVideosByQuery } from "@/lib/getVideos". Remove export default if you switch to this style.

Code (function signature + export):

export const getVideosByQuery = async (
  query: string,
  pages: number,
  per_page: number = 5,
): Promise<VideoResponse> => {
  // function body...
};
