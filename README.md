
## Workshop 1 — `lib/getVideos.ts`: changes from the starter

This section lists **what to add or change** in `getVideos.ts` when moving from the hardcoded starter to a usable Pexels client. (You can keep this in the root `README.md` or move it to something like `docs/workshop-1-getVideos.md`.)

### 1. Use function parameters in the URL

**Starter issue:** The request URL is fixed (for example `nature`, page `1`, `per_page` `1`), so parameters like `query`, `pages`, and `per_page` are ignored.

**Change:** Build the URL from the arguments you pass in.

```ts
const res = await fetch(
  `https://api.pexels.com/v1/videos/search?query=${encodeURIComponent(query ?? "")}&page=${pages}&per_page=${per_page}`,
  { headers: { Authorization: API_KEY } },
);
```

### 2. Separate `fetch` and `json()`, and check HTTP status

**Starter issue:** `await (await fetch(...)).json()` always parses the body, even on 4xx/5xx responses.

**Change:** Await `fetch`, verify `res.ok`, then `res.json()`.

```ts
const res = await fetch(/* ... */);

if (!res.ok) {
  throw new Error("Failed to fetch videos");
}

const data = await res.json();
```

### 3. Fix the mapped fields

**Starter issue:** `width` is set from `video.id` instead of `video.width`, and `tags` is missing for the `VideoRes` type.

**Change:**

```ts
width: video.width,
tags: video.tags || [],
```

### 4. Return a `VideoResponse`, not only an array

**Starter issue:** Returning `videos` alone loses pagination metadata from Pexels.

**Change:** Return the shape your types expect:

```ts
return {
  page: data.page,
  per_page: data.per_page,
  videos,
};
```

Type the function as `Promise<VideoResponse>` (recommended).

### 5. Naming and exports

**Change:** Prefer a clear name and a **named export** so `app/page.tsx` can do:

```ts
import { getVideosByQuery } from "@/lib/getVideos";
```

Example:

```ts
export const getVideosByQuery = async (
  query: string,
  pages: number,
  per_page: number = 5,
): Promise<VideoResponse> => {
  // ...
};
```

Remove the old `export default GetVideos` (or equivalent) if you switch to a named export.

**Why for Workshop 1:** Students use real API parameters, handle HTTP errors correctly, align data with TypeScript (`VideoResponse` / `VideoRes`), and share one response shape between the page and the feed. `encodeURIComponent` avoids broken URLs when the query contains spaces.
