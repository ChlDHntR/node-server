# Study Server — Wiki

A small Express server that provides a book list and a Japanese-text analysis
endpoint. Analysis tokenizes text and looks each token up in a set of local
JSON dictionaries (Japanese→Vietnamese meanings plus a monolingual source).

## Architecture

The code follows a **route → controller → service** layering:

```
index.js                     Entry point: loads .env, starts the HTTP server
src/
  app.js                     Express app: middleware + route mounting
  routes/                    Map HTTP method + path → controller
    bookRoutes.js              GET  /api/booklist
    analyzeRoutes.js           POST /api/analyze
  controllers/               Thin HTTP glue: read request, call service, respond
    bookController.js
    analyzeController.js
  services/                  Business logic (no HTTP awareness)
    bookService.js
    analyzeService.js
    readerService.js         Dictionary lookup against local JSON files
  middleware/
    errorHandlers.js         unknownEndpoint (404) + central errorHandler (500)
  json/                      Dictionary data loaded at startup
```

**Layer responsibilities**

- **Route** — declares the URL and forwards to a controller. No logic.
- **Controller** — extracts input from `req`, calls a service, writes the
  response. Catches errors and forwards them to the error middleware via `next`.
- **Service** — pure business logic. Takes plain values, returns plain values;
  knows nothing about `req`/`res`.

## Request flow

```
Client
  │  HTTP request
  ▼
index.js ──► src/app.js
                │  cors → static(/book1) → express.json()
                ▼
             routes/*  ──►  controllers/*  ──►  services/*
                │                                   │
                │            ◄── plain JS value ────┘
                ▼
             res.json(...)  ──►  Client
                │
                └─ no match ─► unknownEndpoint (404)
                └─ throw ─────► errorHandler (500)
```

### Startup

1. `index.js` loads environment variables via `dotenv`.
2. It imports the configured app from `src/app.js` and calls `app.listen(PORT)`
   (`PORT` from env, default `3003`).
3. `readerService.js` reads and parses all dictionary JSON files **once** at
   module load, keeping them in memory for fast lookups.

## Endpoints

### `GET /api/booklist`

Returns the list of available books.

- **Route:** `routes/bookRoutes.js`
- **Controller:** `bookController.getBooks`
- **Service:** `bookService.getBookList`
- **Response:** `200 OK`

```json
["makeine4", "makeine5", "amamori1", "amamori2"]
```

### `POST /api/analyze`

Analyzes a piece of Japanese text and returns dictionary results.

- **Route:** `routes/analyzeRoutes.js`
- **Controller:** `analyzeController.analyze`
- **Service:** `analyzeService.analyzeText`

**Request body**

```json
{ "content": "分かった" }
```

**Response** — `200 OK`, shape `{ analyze, runReader }` (see
`analyzeService` below for field details).

## Services — input & output

### `bookService.getBookList()`

| | |
|---|---|
| **Input** | none |
| **Output** | `string[]` — hard-coded list of book ids |

```js
getBookList() // → ["makeine4", "makeine5", "amamori1", "amamori2"]
```

### `readerService.runReader(text)`

Looks a single word up across the local dictionaries. Synchronous.

| | |
|---|---|
| **Input** | `text: string` — one word (typically a token's `basic_form`) |
| **Output** | `{ answer, answer2, status }` |

**Output fields**

- `status: boolean` — `true` when `text` was found in the index, `false`
  otherwise. Used by callers to decide whether the result is meaningful.
- `answer: Array` — bilingual (JP→VI) results. When found, each element is:
  ```js
  {
    definition: { "0": "...", "1": "..." }, // index-keyed list of meanings
    kanaReading: "...",                      // kana reading for this entry
    kanjiWriting: "..."                      // kanji writing for this entry
  }
  ```
  When not found: `["no result found"]`.
- `answer2: object | string` — monolingual (JP) result for `text`, or the
  string `"no result found"` when absent.

```js
runReader("たい")
// → { answer: [ { definition, kanaReading, kanjiWriting }, ... ],
//     answer2: {...},
//     status: true }
```

### `analyzeService.analyzeText(text)`

Orchestrates the reader and the `kuromojin` tokenizer. Asynchronous.

| | |
|---|---|
| **Input** | `text: string` — raw Japanese text (may be a phrase/sentence) |
| **Output** | `Promise<{ analyze, runReader }>` |

**Logic**

1. Call `runReader(text)` directly.
2. **Direct hit** (`status === true`): return the whole text as a single entry
   without tokenizing.
3. **Otherwise:** tokenize `text` with `kuromojin`, and run `runReader` on each
   token's `basic_form`.
4. **Tokenize failure:** fall back to the direct (empty) result so the endpoint
   still returns a valid shape.

**Output fields**

- `analyze: Array<{ surface_form, basic_form }>` — one entry per token
  (`surface_form` = text as written, `basic_form` = dictionary form). On a
  direct hit or tokenize failure this is a single entry with the raw text.
- `runReader: Array` — the `runReader(...)` result for each corresponding
  `analyze` entry (same order, same length).

```js
await analyzeText("分かった")
// → {
//     analyze:  [ { surface_form: "分かっ", basic_form: "分かる" }, { surface_form: "た", basic_form: "た" } ],
//     runReader:[ { answer, answer2, status }, { answer, answer2, status } ]
//   }
```

## Error handling

- **Unknown route** → `unknownEndpoint` returns `404 { "error": "unknown endpoint" }`.
- **Thrown/rejected error** in a controller → passed to `next(err)` →
  `errorHandler` logs it and returns `500 { "error": "internal server error" }`.

## Configuration

| Variable | Default | Purpose |
|---|---|---|
| `PORT` | `3003` | HTTP listen port |

Static assets under `public/book1` are served at the `/book1` path.
