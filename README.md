
# Workshop: Fetching Videos from an API

## What are we building?

In this step, we are creating a **server-side function** that fetches videos from the **Pexels API**.

We move from a **first implementation** toward a **fully wired** version:

- the API call runs on the server
- the response is validated and parsed
- `query`, `page`, and `per_page` drive the request
- we return a typed **`VideoResponse`** the rest of the app can use

---

## File setup

We are working in:

**`lib/getVideos.ts`**

This file is responsible for:

- connecting to the Pexels API
- retrieving video data
- mapping raw JSON into our **`VideoRes`** shape
- returning **`VideoResponse`** (`page`, `per_page`, `videos`)

---

## Step 1: Enable server-side execution

We start by adding:

```ts
"use server";
```

This tells Next.js that this module runs on the **backend**, not in the browser.

Why this matters:

- protects your API key
- keeps sensitive logic off the client

---

## Step 2: Import types and API key

```ts
import { VideoResponse, VideoRes } from "@/types/backend/types";

const API_KEY = process.env.API_KEY;
```

What's happening:

- **`VideoResponse`** → return type for the whole function (`page`, `per_page`, `videos`)
- **`VideoRes`** → type for each item in the `videos` array after we map the API
- **`API_KEY`** → read from environment variables (never hardcoded in client bundles)

---

## Step 3: Create the fetch function

```ts
export const getVideosByQuery = async (
  query: string,
  pages: number,
  per_page: number = 5,
): Promise<VideoResponse> => {
```

Parameters:

- **`query`** → search term sent to Pexels (e.g. `"nature"`)
- **`pages`** → which page of results to fetch (`1` for first load, `2`, `3`, … for "load more")
- **`per_page`** → how many videos per page (default **5**)

Return type:

- **`Promise<VideoResponse>`** → callers know they get pagination fields plus `videos[]`

---

## Step 4: Validate API key

```ts
  if (!API_KEY || API_KEY === "") {
    throw new Error("Missing API KEY");
  }
```

What's happening:

- if there is no key, we **stop immediately** with a clear error

Why this matters:

- avoids confusing failed requests
- makes misconfiguration obvious during development

---

## Step 5: Call Pexels with a dynamic URL

```ts
  const res = await fetch(
    `https://api.pexels.com/v1/videos/search?query=${encodeURIComponent(query)}&page=${pages}&per_page=${per_page}`,
    { headers: { Authorization: API_KEY } },
  );
```

What's happening:

- **`query`**, **`pages`**, and **`per_page`** are actually used in the URL
- **`encodeURIComponent(query)`** keeps spaces and special characters safe

Why this matters:

- same function works for the **first page** (server) and **later pages** (client infinite scroll)

---

## Step 6: Check HTTP status before parsing

```ts
  if (!res.ok) {
    throw new Error("Failed to fetch videos");
  }

  const data = await res.json();
```

What's happening:

- **`fetch` does not throw** on 404/401/500 — we check **`res.ok`** ourselves
- only then do we parse JSON into **`data`**

Why this matters:

- separates "request finished" from "request succeeded"
- teaches real-world `fetch` patterns

---

## Step 7: Map API results to `VideoRes`

```ts
  const videos: VideoRes[] = data.videos.map((video: any) => ({
    id: video.id,
    width: video.width,
    height: video.height,
    url: video.video_files[0].link,
    duration: video.duration ? video.duration : 0,
    size: video.size,
    tags: video.tags || [],
    user: {
      id: video.user?.id,
      name: video.user?.name,
      url: video.user?.url,
    },
  }));
```

What's happening:

- we **normalize** Pexels' nested shape into our app's **`VideoRes`** type
- **`width`** must come from **`video.width`** (not `video.id`)
- **`tags`** defaults to **`[]`** if missing

Why this matters:

- UI code does not depend on raw Pexels field names everywhere
- TypeScript stays aligned with **`types/backend/types.ts`**

---

## Step 8: Return a `VideoResponse`

```ts
  return {
    page: data.page,
    per_page: data.per_page,
    videos,
  };
};
```

What's happening:

- we return **pagination metadata** from the API plus our mapped **`videos`** array

Why this matters:

- **`app/page.tsx`** can pass **`videoRes`** into **`VideoFeed`**
- the client can request the next page with the same function using **`pages + 1`**

---

## Step 9: Import from `page.tsx` (how this file is used)

Elsewhere you will write:

```ts
import { getVideosByQuery } from "@/lib/getVideos";
```

What's happening:

- **`getVideosByQuery`** is a **named export**, so imports use curly braces

Why this matters:

- clear, searchable name across the codebase
- matches typical Next.js / TypeScript patterns
