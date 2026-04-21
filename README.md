---

# Workshop: `lib/getVideos.ts` — what you will add and change

This section describes **only** what you will **add** or **change** in the starter. It does not paste the starter file or a full solution.

Work in **`lib/getVideos.ts`**.

---

## Add: server-only module marker

**Add** at the very top of the file:

```ts
"use server";
```

**Why:** Keeps this logic on the server so the Pexels key is not exposed to the browser.

---

## Add: types and environment key

**Add** (or **expand** imports if you only import part of this today):

- import **`VideoResponse`** and **`VideoRes`** from `@/types/backend/types`
- a **`const API_KEY = process.env.API_KEY`**

**Why:** You need both types for the return value and the mapped items; the key must come from env.

---

## Change: function name and export style

**Change** the default export / name so the rest of the app can import a **named** function, for example **`getVideosByQuery`**.

**Add** an explicit return type: **`Promise<VideoResponse>`**.

**Why:** `app/page.tsx` will use `import { getVideosByQuery } from "@/lib/getVideos"` and expect a full response object, not only an array.

---

## Change: function parameters that match the real API call

**Change** the parameter list so the request is driven by:

- **`query`** (string)
- **`pages`** (number)
- **`per_page`** (number, with a sensible default such as `5`)

**Remove or stop relying on** any parameter that is not used anywhere in the function, so the signature matches behavior.

**Why:** The same function should support page `1` on the server and later pages for “load more.”

---

## Add: guard clause for the API key

**Add** a check that throws if **`API_KEY`** is missing or empty.

**Why:** Fail fast with a clear error instead of a vague failed request.

---

## Change: build the request URL from variables

**Change** the `fetch` URL so **`query`**, **`pages`**, and **`per_page`** are interpolated into the string (not hardcoded).

**Add** **`encodeURIComponent(query)`** (or equivalent) for the query segment.

**Why:** Search text and pagination must actually affect the response.

---

## Add: HTTP success check before JSON

**Add** after `await fetch(...)`:

- if **`!res.ok`**, throw an error
- only then **`await res.json()`**

**Why:** `fetch` does not throw on 4xx/5xx; you must check **`res.ok`**.

---

## Change: map raw items to **`VideoRes`**

**Change** the mapper so each video includes at least:

- correct **`width`** from the API’s width field (not from **`id`**)
- **`tags`** as **`video.tags || []`** so it matches the type

**Why:** The UI and TypeScript expect a stable, correct shape.

---

## Add: return pagination plus videos

**Change** the return value from “only an array” to an object with:

- **`page`** from the parsed response
- **`per_page`** from the parsed response
- **`videos`** as your mapped array

**Why:** Callers need **`VideoResponse`** (`page`, `per_page`, `videos`) for the feed and for future page fetches.

---

## After this file: how it will be used (no code from other files here)

**Next (outside this README’s code):** `app/page.tsx` will call **`getVideosByQuery`** for the first page and pass the result into the video feed component. That wiring is a separate workshop section.
