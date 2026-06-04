# Design Document

## Overview

The To-Do List Life Dashboard is a single-page, frontend-only web application. It consists of three files: `index.html`, `css/style.css`, and `js/script.js`. No build tools, frameworks, or backend services are required. All state is held in the browser's LocalStorage.

---

## Architecture

### File Structure

```
/
├── index.html
├── css/
│   └── style.css
└── js/
    └── script.js
```

### Technology Choices

| Concern | Choice | Rationale |
|---|---|---|
| Markup | HTML5 | Required by constraints |
| Styling | CSS3 (Grid + Custom Properties) | Required by constraints; CSS variables enable the theme system |
| Behavior | Vanilla ES6+ JavaScript | Required by constraints |
| Persistence | `window.localStorage` | Required by constraints |
| No frameworks | Pure DOM APIs | Required by constraints |

---

## HTML Structure (`index.html`)

```
<body data-theme="light">
  <header>
    <button id="theme-toggle">🌙 Dark Mode</button>
  </header>

  <main class="dashboard-grid">

    <!-- Card 1: Greeting -->
    <section class="card" id="greeting-card">
      <div id="clock">HH:MM:SS</div>
      <div id="date-display">Full Date</div>
      <h2 id="greeting-text">Good Morning, <span id="user-name" contenteditable="false">Click to edit name</span></h2>
    </section>

    <!-- Card 2: Focus Timer -->
    <section class="card" id="timer-card">
      <h2>Focus Timer</h2>
      <div id="timer-display">25:00</div>
      <div class="timer-controls">
        <button id="timer-start">Start</button>
        <button id="timer-stop">Stop</button>
        <button id="timer-reset">Reset</button>
      </div>
    </section>

    <!-- Card 3: To-Do List -->
    <section class="card" id="todo-card">
      <h2>To-Do List</h2>
      <div class="todo-input-row">
        <input type="text" id="todo-input" placeholder="Add a new task..." />
        <button id="todo-add">Add</button>
      </div>
      <ul id="todo-list"></ul>
    </section>

    <!-- Card 4: Quick Links -->
    <section class="card" id="links-card">
      <h2>Quick Links</h2>
      <div class="link-input-row">
        <input type="text" id="link-name-input" placeholder="Link name" />
        <input type="url" id="link-url-input" placeholder="https://..." />
        <button id="link-add">Add Link</button>
      </div>
      <div id="links-container"></div>
    </section>

  </main>

  <!-- Custom context menu (Quick Links right-click delete) -->
  <div id="context-menu" class="hidden">
    <button id="context-delete">Delete Link</button>
  </div>

  <script src="js/script.js"></script>
</body>
```

---

## CSS Design (`css/style.css`)

### Theme System

CSS Custom Properties (variables) on `[data-theme]` attribute selectors drive the entire theme. JavaScript toggles the `data-theme` attribute on `<body>`.

```css
:root {
  --accent:       #8b5cf6;
  --accent-hover: #7c3aed;
}

[data-theme="light"] {
  --bg:         #f5f3ff;
  --card-bg:    #ffffff;
  --text:       #1e1b2e;
  --subtext:    #6b7280;
  --border:     #e5e7eb;
  --input-bg:   #f9fafb;
}

[data-theme="dark"] {
  --bg:         #0f0e1a;
  --card-bg:    #1e1b2e;
  --text:       #f3f4f6;
  --subtext:    #9ca3af;
  --border:     #374151;
  --input-bg:   #2d2b3d;
}
```

### Responsive Grid Layout

```css
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 1.5rem;
}

@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
```

The `auto-fit` + `minmax` pattern naturally collapses to a single column on narrow viewports, satisfying Requirement 8 without a separate media query for the multi-column case.

### Key Component Styles

- **Cards**: `background: var(--card-bg)`, `border-radius: 12px`, `box-shadow`.
- **Accent buttons**: `background: var(--accent)`, white text, hover darkens to `var(--accent-hover)`.
- **Timer display**: Large monospace font (~4rem), centered.
- **Task item**: Flex row — task text (flex-grow), Edit button, Delete button.
- **Completed task**: `text-decoration: line-through; color: var(--subtext)`.
- **Link buttons**: `display: inline-flex`, pill shape, accent background, open in new tab.
- **Context menu**: `position: fixed`, `z-index: 9999`, appears at cursor coordinates.

---

## JavaScript Design (`js/script.js`)

### Module Organization (within a single IIFE or top-level functions)

```
script.js
├── Constants / LocalStorage Keys
├── State
├── Greeting Module
│   ├── startClock()
│   ├── updateGreeting()
│   └── initNameEditor()
├── Timer Module
│   ├── startTimer()
│   ├── stopTimer()
│   └── resetTimer()
├── Todo Module
│   ├── loadTodos()
│   ├── saveTodos()
│   ├── addTodo()
│   ├── renderTodos()
│   ├── toggleTodo()
│   ├── editTodo()
│   └── deleteTodo()
├── Links Module
│   ├── loadLinks()
│   ├── saveLinks()
│   ├── addLink()
│   ├── renderLinks()
│   ├── deleteLink()
│   └── initContextMenu()
├── Theme Module
│   ├── loadTheme()
│   └── toggleTheme()
└── init()   ← wires everything together on DOMContentLoaded
```

### LocalStorage Keys

```js
const KEYS = {
  TODOS:  'tdl_todos',
  LINKS:  'tdl_links',
  NAME:   'tdl_name',
  THEME:  'tdl_theme',
};
```

### Data Structures

**Task object:**
```js
{ id: Date.now(), text: "Task text", done: false }
```

**Link object:**
```js
{ id: Date.now(), name: "Google", url: "https://www.google.com" }
```

### Key Algorithms

#### Greeting Time Logic
```
hour = new Date().getHours()
if 5 <= hour <= 11  → "Good Morning"
if 12 <= hour <= 17 → "Good Afternoon"
else                → "Good Evening"
```

#### Duplicate Task Check
```
normalize = text.trim().toLowerCase()
isDuplicate = todos.some(t => t.text.toLowerCase() === normalize)
if isDuplicate → alert(), refocus input, return
```

#### Focus Timer Countdown
- State: `{ totalSeconds: 1500, intervalId: null }`
- `startTimer()`: if `intervalId` is null, set interval every 1000ms, decrement `totalSeconds`
- `stopTimer()`: `clearInterval(intervalId)`, set `intervalId = null`
- `resetTimer()`: call `stopTimer()`, set `totalSeconds = 1500`, update display
- On zero: call `stopTimer()`, `alert("Focus session complete!")`, call `resetTimer()`

#### Theme Toggle
```
current = document.body.dataset.theme  // "light" | "dark"
next = current === "light" ? "dark" : "light"
document.body.dataset.theme = next
localStorage.setItem(KEYS.THEME, next)
updateToggleLabel(next)
```

#### Name Editor
```
nameSpan.addEventListener("click", () => {
  nameSpan.contentEditable = "true"
  nameSpan.focus()
  selectAll(nameSpan)
})

nameSpan.addEventListener("blur", saveName)
nameSpan.addEventListener("keydown", e => {
  if (e.key === "Enter") { e.preventDefault(); nameSpan.blur() }
})

function saveName() {
  nameSpan.contentEditable = "false"
  const val = nameSpan.textContent.trim()
  localStorage.setItem(KEYS.NAME, val || "")
}
```

#### Context Menu (Quick Links)
- On `contextmenu` of a link wrapper: prevent default, store target link `id`, position `#context-menu` at `(e.clientX, e.clientY)`, remove `.hidden`.
- On `#context-delete` click: call `deleteLink(storedId)`, hide menu.
- On `document click` (outside menu): hide menu.

### Error Handling

All `localStorage.getItem` calls are wrapped in `try/catch`. If JSON.parse fails, fall back to `[]` (for arrays) or `""` / `"light"` (for scalars).

```js
function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
```

---

## Correctness Properties

### P1 — LocalStorage Round-Trip (Tasks)
For any array of task objects written to LocalStorage, reading and parsing back MUST produce a structurally identical array.
`JSON.parse(JSON.stringify(tasks))` deep-equals `tasks`.

### P2 — LocalStorage Round-Trip (Links)
Same as P1 for link objects.

### P3 — Duplicate Prevention Invariant
After any `addTodo()` call that succeeds, no two tasks in the task array share the same lowercased text.
`new Set(todos.map(t => t.text.toLowerCase())).size === todos.length`

### P4 — Timer Non-Negative Invariant
`totalSeconds` MUST never go below 0. The interval callback checks `if (totalSeconds <= 0)` before decrementing.

### P5 — Theme Idempotence
Applying `toggleTheme()` twice in a row MUST return `data-theme` to its original value.

### P6 — Default Links Initialization
On first load (empty LocalStorage), the links array MUST contain exactly two entries: Google and GitHub, in that order.

---

## Security Considerations

- All user-provided text is inserted via `textContent` or `element.textContent =` (not `innerHTML`) to prevent XSS injection.
- Link URLs are used in `anchor.href` attribute only. The browser handles URL validation natively.
- `contenteditable` is set to `"false"` by default and only enabled on explicit user click, limiting unintended edits.
