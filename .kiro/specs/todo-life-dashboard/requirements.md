# Requirements Document

## Introduction

The To-Do List Life Dashboard is a frontend-only, single-page web application built with pure HTML, CSS, and Vanilla JavaScript. It serves as a personal productivity dashboard providing users with a greeting section, a focus timer, a to-do list, and a quick-links manager — all persisted via the browser's LocalStorage API. The UI uses a clean, modern, minimalistic design with a purple-based color scheme (#8b5cf6).

## Glossary

- **Dashboard**: The single-page web application comprising all four feature sections.
- **Greeting_Section**: The UI component displaying the real-time clock, current date, and personalized greeting.
- **Focus_Timer**: The UI component managing a 25-minute countdown timer.
- **Todo_List**: The UI component managing user-defined task items.
- **Quick_Links**: The UI component managing user-defined shortcut hyperlinks.
- **Theme_Toggle**: The control that switches between light and dark visual themes.
- **LocalStorage**: The browser's Web Storage API used for all data persistence.
- **Task**: A single to-do item with text content and a completion state.
- **Link**: A named hyperlink with a display label and a URL.
- **Name_Editor**: The inline editable element within the Greeting_Section that holds the user's display name.

---

## Requirements

### Requirement 1: Greeting Section

**User Story:** As a user, I want to see a personalized greeting with the current time and date, so that I have immediate context about my day when I open the dashboard.

#### Acceptance Criteria

1. THE Greeting_Section SHALL display the current time in HH:MM:SS format, updated every second.
2. THE Greeting_Section SHALL display the current full date (e.g., "Monday, June 2, 2025").
3. WHEN the local hour is between 5 and 11 (inclusive), THE Greeting_Section SHALL display "Good Morning".
4. WHEN the local hour is between 12 and 17 (inclusive), THE Greeting_Section SHALL display "Good Afternoon".
5. WHEN the local hour is between 18 and 23 (inclusive) or between 0 and 4 (inclusive), THE Greeting_Section SHALL display "Good Evening".
6. THE Greeting_Section SHALL display the user's name within the greeting message.
7. WHEN no stored name exists in LocalStorage, THE Greeting_Section SHALL display the placeholder text "Click to edit name".
8. WHEN the user clicks the Name_Editor, THE Greeting_Section SHALL allow the user to type a new name inline.
9. WHEN the user finishes editing the name (by pressing Enter or clicking outside the Name_Editor), THE Greeting_Section SHALL save the entered name to LocalStorage.
10. WHEN the Dashboard loads, THE Greeting_Section SHALL retrieve and display the stored name from LocalStorage.

---

### Requirement 2: Focus Timer

**User Story:** As a user, I want a 25-minute countdown timer with basic controls, so that I can use the Pomodoro technique to manage my focus sessions.

#### Acceptance Criteria

1. THE Focus_Timer SHALL initialize with a countdown value of 25 minutes and 0 seconds (25:00).
2. WHEN the user activates the Start control, THE Focus_Timer SHALL begin counting down one second per second.
3. WHEN the user activates the Stop control, THE Focus_Timer SHALL pause the countdown at its current value.
4. WHEN the user activates the Reset control, THE Focus_Timer SHALL return the countdown to 25:00 and stop any active countdown.
5. WHILE the Focus_Timer is counting down, THE Focus_Timer SHALL display the remaining time in MM:SS format.
6. WHEN the countdown reaches 00:00, THE Focus_Timer SHALL stop counting and display a browser alert notifying the user that the session is complete.
7. WHEN the countdown reaches 00:00, THE Focus_Timer SHALL reset the display to 25:00 after the alert is dismissed.

---

### Requirement 3: To-Do List

**User Story:** As a user, I want to add, edit, delete, and complete tasks, so that I can track my personal to-dos and their status.

#### Acceptance Criteria

1. THE Todo_List SHALL provide a text input field and an Add button for creating new tasks.
2. WHEN the user submits a non-empty task text, THE Todo_List SHALL add the task as a new item in the list.
3. IF the submitted task text matches an existing task text (case-insensitive), THEN THE Todo_List SHALL display a browser alert informing the user of the duplicate and SHALL NOT add the task.
4. WHEN the user clicks the task text of a task item, THE Todo_List SHALL toggle a line-through style on that task text to indicate completion.
5. WHEN the user activates the Edit control on a task item, THE Todo_List SHALL allow the user to modify the task text inline.
6. WHEN the user activates the Delete control on a task item, THE Todo_List SHALL remove the task item from the list.
7. WHEN any task is added, toggled, edited, or deleted, THE Todo_List SHALL save the current task list to LocalStorage.
8. WHEN the Dashboard loads, THE Todo_List SHALL retrieve and render all tasks from LocalStorage, preserving their completion state.
9. IF the task text input is empty when the user activates the Add button, THEN THE Todo_List SHALL NOT add the task.

---

### Requirement 4: Quick Links

**User Story:** As a user, I want to manage a set of shortcut links, so that I can quickly navigate to frequently visited websites from the dashboard.

#### Acceptance Criteria

1. THE Quick_Links SHALL display "Google" (https://www.google.com) and "GitHub" (https://www.github.com) as default links on first load when no links exist in LocalStorage.
2. THE Quick_Links SHALL provide a link name input, a URL input, and an Add Link button for creating new links.
3. WHEN the user submits a valid link name and URL, THE Quick_Links SHALL add the link as a clickable anchor element.
4. WHEN a link anchor is activated, THE Quick_Links SHALL open the associated URL in a new browser tab.
5. WHEN the user activates the Delete control on a link item, THE Quick_Links SHALL remove the link from the list.
6. WHERE the browser supports contextmenu events, THE Quick_Links SHALL display a custom context menu with a delete option when the user right-clicks a link item.
7. WHEN any link is added or deleted, THE Quick_Links SHALL save the current link list to LocalStorage.
8. WHEN the Dashboard loads, THE Quick_Links SHALL retrieve and render all links from LocalStorage.
9. IF the link name or URL input is empty when the user activates the Add Link button, THEN THE Quick_Links SHALL NOT add the link.

---

### Requirement 5: Light/Dark Mode Toggle

**User Story:** As a user, I want to switch between light and dark themes, so that I can use the dashboard comfortably in different lighting conditions.

#### Acceptance Criteria

1. THE Theme_Toggle SHALL be prominently visible in the Dashboard layout.
2. WHEN the user activates the Theme_Toggle, THE Dashboard SHALL switch between light and dark visual themes.
3. WHEN the Dashboard loads, THE Theme_Toggle SHALL retrieve the stored theme preference from LocalStorage and apply it.
4. WHEN the user activates the Theme_Toggle, THE Theme_Toggle SHALL save the new theme preference to LocalStorage.
5. WHEN no stored theme preference exists, THE Dashboard SHALL default to the light theme.

---

### Requirement 6: Duplicate Task Prevention

**User Story:** As a user, I want to be prevented from adding duplicate tasks, so that my to-do list remains clean and free of repeated entries.

#### Acceptance Criteria

1. WHEN the user attempts to add a task, THE Todo_List SHALL compare the new task text against all existing task texts using a case-insensitive comparison.
2. IF a matching task text is found, THEN THE Todo_List SHALL call `window.alert()` with a message indicating the task already exists.
3. IF a matching task text is found, THEN THE Todo_List SHALL retain focus on the task text input field after the alert is dismissed.
4. THE Todo_List SHALL treat "Buy milk", "buy milk", and "BUY MILK" as identical for duplicate-checking purposes.

---

### Requirement 7: Data Persistence

**User Story:** As a user, I want all my data to be saved automatically, so that my tasks, links, name, and preferences are preserved across browser sessions.

#### Acceptance Criteria

1. THE Dashboard SHALL use the browser LocalStorage API as the sole persistence mechanism.
2. THE Dashboard SHALL store the task list under a consistent LocalStorage key.
3. THE Dashboard SHALL store the link list under a consistent LocalStorage key.
4. THE Dashboard SHALL store the user's display name under a consistent LocalStorage key.
5. THE Dashboard SHALL store the theme preference under a consistent LocalStorage key.
6. WHEN LocalStorage data is malformed or missing, THE Dashboard SHALL gracefully fall back to default values without throwing an unhandled error.

---

### Requirement 8: Responsive Layout

**User Story:** As a user, I want the dashboard to display correctly on different screen sizes, so that I can use it on both desktop and mobile browsers.

#### Acceptance Criteria

1. THE Dashboard SHALL use CSS Grid or CSS Flexbox to arrange the four feature sections in a card-style layout.
2. WHEN the viewport width is 768px or wider, THE Dashboard SHALL display the cards in a multi-column grid.
3. WHEN the viewport width is below 768px, THE Dashboard SHALL display the cards in a single-column stack.
4. THE Dashboard SHALL apply the purple-based color scheme using #8b5cf6 as the primary accent color.
