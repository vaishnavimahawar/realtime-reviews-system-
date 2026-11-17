# Live Reviews

A real-time review management full-stack application with live WebSocket updates.

# Getting Started

```bash
# after cloning the repo

cd backend
npm i
npm start

# new terminal

cd frontend
npm i
npm start
```

- Backend server: `http://localhost:5000` (WebSocket on `ws://localhost:5000`)
- Frontend application: `http://localhost:5173`
- Unit tests: `cd backend && npm test`

# Problem Statement

**Live Reviews** allows users to add/edit/remove review and view all reviews with live feeding.

## Must Haves

### Backend
- Use any DB and NodeJS framework of your choice
- Create REST APIs to perform CRUD operations of notes
- Store each review with id, title, content and date-time
- Implement web-socket, which should broadcast whenever any review is getting added/edited/deleted

### Frontend
- We are only looking for decent UI, which can just work.
- Please start with plain HTML first, do not worry about CSS. Complete rest of the functionalities and then if time permits, continue improving UI.
- Please do not use any css framework like bootstrap, tailwind, etc.
- You can use either React, Vue, Angular or vanilla HTML/CSS/JavaScript.
- Inline styles not allowed.

#### Reviews List View (Default View, route = `/`)
- A button to create new review - clicking on which user will be redirected to `/new` route
- Basic Table layout with all reviews
    - Table should have 6 columns: #, Title, Content, Date-time, Edit, Delete
        - `#` - Static count number starting with 1
        - Edit - a edit button, clicking on which user will be redirected to `/:id` route
        - Delete - a delete button, clicking on which review will be deleted
    - Show each review in separate row
    - Latest review should be displayed first
    - This should be a live list view with implementation of web-socket, so whenever any review is added/edited/deleted, it should immediately update the table without user needing to refresh the page

#### New Review (route = `/new`)
- 1 input for title
- 1 textarea for content
- Save button - saves the review, and redirects user back to list view, i.e. route `/`
- Reset button - resets the review content and title
- Cancel button - redirects user back to list view, i.e. route `/`

#### Edit Review (route = `/:id`)
- Re-use the same component from New Review
- Pre-fill the title and content from the existing review
- Delete button - deletes the review, and redirects user back to list view, i.e. route `/`

## Nice to have
- Highlight different live events in different colors
    - When new review is added, highlight it with green color in table for 3 seconds
    - When any review is edited, highlight it with blue color in table for 3 seconds
    - When new review is deleted, highlight it with red color in table for 3 seconds and then it should disappear
- Once user deletes the note, either from list or from note itself, show a snackbar/toastr with success message and an undo button
    - Snackbar/toastr should be visible for 5 seconds
    - User can undo the deletion by clicking on undo button
- Unit testing
- Sorting functionality based on title and date-time in both, ascending and descending order
- Search functionality

# Completed

All **Must Haves** and all **Nice to Have** bonus tasks have been completed:

### Backend
- [x] Node.js backend using Express framework
- [x] Persistent JSON-based DB with atomic file operations (minimal dependencies)
- [x] REST APIs for full CRUD operations (`GET /api/reviews`, `GET /api/reviews/:id`, `POST /api/reviews`, `PUT /api/reviews/:id`, `DELETE /api/reviews/:id`)
- [x] Each review stored with `id`, `title`, `content`, and `date-time` (`created_at`, `updated_at`)
- [x] WebSocket server using `ws` broadcasting `created`, `updated`, and `deleted` events in real time

### Frontend
- [x] React single-page application with React Router v6
- [x] Clean, modern, accessible design with zero CSS frameworks (no Bootstrap, no Tailwind) and zero inline styles
- [x] **Reviews List View** (route = `/`)
  - [x] Button to create new review navigating to `/new`
  - [x] Table layout with 6 columns: `#`, `Title`, `Content`, `Date-time`, `Edit`, `Delete`
  - [x] Static 1-based index numbering
  - [x] Edit button redirecting to `/:id`
  - [x] Delete button with instant deletion and undo trigger
  - [x] Latest reviews displayed first
  - [x] Live WebSocket integration automatically syncing additions, edits, and deletions across all connected clients without reload
- [x] **New Review View** (route = `/new`)
  - [x] Title input and Content textarea
  - [x] Save button (persists and redirects to `/`)
  - [x] Reset button (clears inputs)
  - [x] Cancel button (redirects to `/`)
- [x] **Edit Review View** (route = `/:id`)
  - [x] Reuses the same `ReviewForm` component
  - [x] Automatically pre-fills title and content from API
  - [x] Delete button with confirmation/deletion and redirection to `/`

### Nice to Have (Bonus Features)
- [x] **Live Event Color Highlighting:**
  - [x] Green highlight for 3 seconds when new review is added
  - [x] Blue highlight for 3 seconds when review is edited
  - [x] Red highlight for 3 seconds when review is deleted, fading and disappearing afterwards
- [x] **Snackbar / Toastr with Undo:**
  - [x] 5-second auto-dismissing toast notification upon deletion
  - [x] Undo button restores the exact deleted review (preserving id & original creation date)
- [x] **Unit Testing:**
  - [x] 7 automated unit tests covering all database CRUD operations and undo recovery (`npm test`) using Node's native test runner
- [x] **Sorting Functionality:**
  - [x] Interactive column sorting by Title and Date-time in both ascending (↑) and descending (↓) order
- [x] **Search Functionality:**
  - [x] Real-time live search filter filtering across review title and content
