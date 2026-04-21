
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



## Workshop 1 — `app/page.tsx`: changes from the starter

This section lists **what to add or change** in `app/page.tsx` so the **server** loads the first page of results and passes a full **`VideoResponse`** into the client feed.

### 1. Import the named fetch helper

**Starter issue:** The page imports a **default** helper (for example `GetVideos`) that does not match the finished API in `lib/getVideos.ts`, so names and return types drift apart.

**Change:** Import **`getVideosByQuery`** as a **named** import from `@/lib/getVideos`.

```ts
import { getVideosByQuery } from "@/lib/getVideos";
```

Remove the old default import (for example `import GetVideos from "@/lib/getVideos"`).

### 2. Fetch the first page on the server

**Starter issue:** The starter calls the helper with placeholder arguments (for example empty strings and `0`) or otherwise does not request a real first page from Pexels.

**Change:** Inside `Home`, **`await`** a real first-page request. Match the arity of `getVideosByQuery` (two or three arguments depending on your implementation).

```ts
const data = await getVideosByQuery("nature", 1);
```

If your `getVideosByQuery` takes `per_page` as a third argument:

```ts
const data = await getVideosByQuery("nature", 1, 5);
```

### 3. Pass `VideoResponse` into `VideoFeed`, not a single URL

**Starter issue:** The page passes **`url={data[0].url}`**, which assumes an array, throws away pagination fields, and prevents the feed from rendering the full list or loading more pages later.

**Change:** Pass the whole response object the fetch layer returns:

```tsx
<VideoFeed videoRes={data} />
```

Your `VideoFeed` props should expect **`videoRes: VideoResponse`** (after you update `component/Video.tsx` accordingly).

### 4. Handle errors with `try/catch`

**Starter issue:** If `getVideosByQuery` throws (missing API key, bad HTTP response, and so on), the error is unhandled and the page can crash without a clear story for students.

**Change:** Wrap the fetch + JSX return in **`try/catch`**, log the error, and optionally return a simple fallback UI.

```tsx
export default async function Home() {
  try {
    const data = await getVideosByQuery("nature", 1);
    return (
      data && (
        <div className="h-screen w-screen flex justify-center items-center">
          <div className="flex h-[90%] w-[40%] bg-black flex justify-center items-center rounded-2xl">
            <VideoFeed videoRes={data} />
          </div>
        </div>
      )
    );
  } catch (error) {
    console.error("Error fetching videos:", error);
  }
}
```

### 5. Remove debug-only code (optional cleanup)

**Starter issue:** A stray **`console.log(data[0].url)`** (or similar) adds noise and encourages thinking in terms of a single URL instead of **`VideoResponse`**.

**Change:** Delete those logs once the feed works, or replace them with a single structured log during debugging only.

**Why for Workshop 1:** Students see the **App Router** pattern: **`async`** server page → **`await`** data → pass props to a **client** component. They also see why **`videoRes`** beats **`url`**: one object carries **`videos`** plus pagination for the feed and for “load more” in `Video.tsx`.
