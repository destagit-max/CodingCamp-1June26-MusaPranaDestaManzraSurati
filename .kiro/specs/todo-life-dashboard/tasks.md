# Implementation Tasks

## Task List

- [ ] 1. Project scaffold — create the three files with base HTML boilerplate
  - Create `index.html` with DOCTYPE, meta viewport, charset, title, link to `css/style.css`, and script tag pointing to `js/script.js`
  - Create `css/style.css` as an empty file
  - Create `js/script.js` as an empty file
  - Verify the HTML opens in a browser without console errors

- [ ] 2. CSS foundation — design tokens, reset, and base layout
  - Define CSS custom properties for both `[data-theme="light"]` and `[data-theme="dark"]` including `--bg`, `--card-bg`, `--text`, `--subtext`, `--border`, `--input-bg`, `--accent` (#8b5cf6), and `--accent-hover` (#7c3aed)
  - Add a minimal CSS reset (box-sizing, margin/padding zero, font inheritance)
  - Style `body` to use `var(--bg)`, `var(--text)`, and a sans-serif font stack
  - Implement `.dashboard-grid` with `display: grid`, `grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))`, and gap/padding
  - Add `@media (max-width: 768px)` breakpoint forcing single-column layout
  - Style `.card` with `var(--card-bg)`, border-radius, box-shadow, and padding

- [ ] 3. HTML structure — all four cards and header
  - Add `<header>` with the `#theme-toggle` button
  - Add `<main class="dashboard-grid">` containing all four `.card` sections: `#greeting-card`, `#timer-card`, `#todo-card`, `#links-card`
  - Inside `#greeting-card`: `#clock`, `#date-display`, `#greeting-text` with child `#user-name` span
  - Inside `#timer-card`: `#timer-display` div and three buttons (`#timer-start`, `#timer-stop`, `#timer-reset`)
  - Inside `#todo-card`: `#todo-input` text input, `#todo-add` button, and `#todo-list` ul
  - Inside `#links-card`: `#link-name-input`, `#link-url-input`, `#link-add` button, and `#links-container` div
  - Add `#context-menu` div (hidden by default) with `#context-delete` button

- [ ] 4. CSS component styles — cards, buttons, inputs, timer, tasks, links
  - Style the header: flex row, space-between, background using card color, border-bottom
  - Style `#theme-toggle`: pill shape, accent color, prominent placement
  - Style the timer display (`#timer-display`): large monospace font (~4rem), centered
  - Style `.timer-controls`: flex row, centered, gap between buttons
  - Style the todo input row and link input row as flex rows
  - Style `<input>` and `<button>` elements using CSS variables for background, border, and text
  - Style `.todo-item` as a flex row with task text (flex-grow:1), edit button, and delete button
  - Style `.done` class: `text-decoration: line-through; color: var(--subtext)`
  - Style link anchor buttons: pill shape, accent background, white text, `display: inline-flex`
  - Style `#context-menu`: `position: fixed`, white/dark background, border, z-index 9999
  - Add `.hidden` utility class: `display: none`
  - Add hover and focus states for all interactive elements

- [ ] 5. JavaScript — constants, state, and localStorage utility
  - Define the `KEYS` constant object with `TODOS`, `LINKS`, `NAME`, `THEME` keys
  - Implement `loadFromStorage(key, fallback)` with try/catch that returns parsed JSON or fallback
  - Implement `saveToStorage(key, value)` that calls `JSON.stringify` and `localStorage.setItem`
  - Define the mutable state variables: `todos` array, `links` array, `timerState` object (`{ totalSeconds: 1500, intervalId: null }`)

- [ ] 6. Greeting module — clock, date, greeting text
  - Implement `startClock()` that calls `setInterval` every 1000ms
  - Each tick: get `new Date()`, format time as HH:MM:SS with zero-padding, update `#clock` textContent
  - Each tick: format full date (e.g., "Monday, June 2, 2025") using `toLocaleDateString` with options, update `#date-display` textContent
  - Implement `updateGreeting()` that derives "Good Morning/Afternoon/Evening" from `new Date().getHours()` and updates `#greeting-text` prefix

- [ ] 7. Name editor module — contenteditable inline editing with LocalStorage
  - On `DOMContentLoaded`, load stored name from `KEYS.NAME`; if present set `#user-name` textContent to stored name, else set to "Click to edit name"
  - Add `click` listener on `#user-name`: set `contentEditable = "true"`, call `focus()`, select all text with `document.execCommand("selectAll")` or a Range
  - Add `blur` listener on `#user-name`: read `textContent.trim()`, save to LocalStorage, set `contentEditable = "false"`; if empty, restore placeholder
  - Add `keydown` listener on `#user-name`: if `Enter` key, call `event.preventDefault()` then `blur()` on the element

- [ ] 8. Focus Timer module — countdown, controls, alert on completion
  - Implement `renderTimer()` that writes `timerState.totalSeconds` to `#timer-display` in MM:SS format (zero-padded)
  - Implement `startTimer()`: if `intervalId` is not null return early; set `intervalId` via `setInterval` (1000ms); each tick decrement `totalSeconds` then call `renderTimer()`; if `totalSeconds <= 0` call `stopTimer()`, `alert("Focus session complete! Great work.")`, then `resetTimer()`
  - Implement `stopTimer()`: `clearInterval(timerState.intervalId)`, set `timerState.intervalId = null`
  - Implement `resetTimer()`: call `stopTimer()`, set `timerState.totalSeconds = 1500`, call `renderTimer()`
  - Wire `#timer-start`, `#timer-stop`, `#timer-reset` button click events to `startTimer`, `stopTimer`, `resetTimer`

- [ ] 9. To-Do List module — CRUD, duplicate check, toggle, LocalStorage
  - Implement `renderTodos()`: clear `#todo-list`, for each task in `todos` create an `<li>` with task text `<span>` (applies `.done` class if `task.done`), an Edit `<button>`, and a Delete `<button>`; append to `#todo-list`; all text is set via `textContent` (not innerHTML)
  - Implement `saveTodos()`: call `saveToStorage(KEYS.TODOS, todos)`
  - Implement `loadTodos()`: set `todos = loadFromStorage(KEYS.TODOS, [])`; call `renderTodos()`
  - Implement `addTodo()`: read and trim `#todo-input` value; if empty return; normalize to lowercase and check `todos.some(t => t.text.toLowerCase() === normalized)`; if duplicate call `alert()` and refocus input then return; push `{ id: Date.now(), text, done: false }` to `todos`; call `saveTodos()`, `renderTodos()`; clear input
  - Implement `toggleTodo(id)`: find task by id, toggle `done` boolean; call `saveTodos()`, `renderTodos()`
  - Implement `deleteTodo(id)`: filter out task by id; call `saveTodos()`, `renderTodos()`
  - Implement `editTodo(id)`: prompt user for new text using `window.prompt()` pre-filled with current text; if result is non-null and non-empty, update task text; call `saveTodos()`, `renderTodos()`
  - Wire `#todo-add` click and `#todo-input` Enter keydown to `addTodo()`
  - Inside `renderTodos()`, wire each Edit button to `editTodo(task.id)`, each Delete button to `deleteTodo(task.id)`, each task text span to `toggleTodo(task.id)`

- [ ] 10. Quick Links module — add, render, delete, context menu, default links
  - Define `DEFAULT_LINKS`: `[{ id: 1, name: "Google", url: "https://www.google.com" }, { id: 2, name: "GitHub", url: "https://www.github.com" }]`
  - Implement `loadLinks()`: set `links = loadFromStorage(KEYS.LINKS, null)`; if null (first visit), set `links = DEFAULT_LINKS` and call `saveLinks()`; call `renderLinks()`
  - Implement `saveLinks()`: call `saveToStorage(KEYS.LINKS, links)`
  - Implement `renderLinks()`: clear `#links-container`; for each link create an `<a>` element with `href`, `target="_blank"`, `rel="noopener noreferrer"`, textContent set to link name; wrap in a `<div>` with a Delete `<button>`; set link name and URL via attribute/textContent only (not innerHTML); append to `#links-container`
  - Implement `addLink()`: read and trim `#link-name-input` and `#link-url-input`; if either is empty return; push `{ id: Date.now(), name, url }` to `links`; call `saveLinks()`, `renderLinks()`; clear inputs
  - Implement `deleteLink(id)`: filter out link by id; call `saveLinks()`, `renderLinks()`
  - Implement `initContextMenu()`: add `contextmenu` listener on `#links-container` (event delegation); `preventDefault()`; store the target link id; position `#context-menu` at `(e.clientX, e.clientY)`; remove `.hidden`
  - Add `click` listener on `document` to hide `#context-menu` (add `.hidden`)
  - Add `click` listener on `#context-delete` to call `deleteLink(storedContextId)` and hide menu
  - Wire `#link-add` click to `addLink()`

- [ ] 11. Theme module — toggle, persist, load on startup
  - Implement `loadTheme()`: get stored value from `KEYS.THEME` defaulting to `"light"`; set `document.body.dataset.theme` to that value; call `updateToggleLabel()`
  - Implement `toggleTheme()`: read current `document.body.dataset.theme`; set to opposite; call `saveToStorage(KEYS.THEME, newTheme)`; call `updateToggleLabel()`
  - Implement `updateToggleLabel()`: if dark, set button text to "☀️ Light Mode"; if light, set button text to "🌙 Dark Mode"
  - Wire `#theme-toggle` click to `toggleTheme()`

- [ ] 12. Initialization — wire everything together on DOMContentLoaded
  - Wrap all module initialization in a single `DOMContentLoaded` listener (or call `init()` at end of script after DOM is parsed)
  - Call `loadTheme()`, `startClock()`, `initNameEditor()`, `renderTimer()`, `loadTodos()`, `loadLinks()`, `initContextMenu()`
  - Verify no console errors on fresh load
  - Verify no console errors after clearing LocalStorage and reloading (first-visit defaults)

- [ ] 13. Polish and cross-browser checks
  - Verify light/dark transition feels smooth (add `transition: background-color 0.3s, color 0.3s` on body and cards)
  - Verify all buttons have visible `:focus` outlines for keyboard accessibility
  - Verify the timer display stays fixed-width (use `min-width` or monospace font) so digits don't cause layout shift
  - Verify the context menu closes when the user clicks anywhere outside it
  - Verify the greeting name placeholder is restored if the user saves an empty name
  - Verify the app functions correctly after multiple add/delete/reload cycles
