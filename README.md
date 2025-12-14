# Task Management Application

A clean and secure **Task Management Application** built using **SvelteKit**, **Supabase**, and a custom shadcn-style UI.  
This project demonstrates modern frontend practices including authentication, protected routes, CRUD operations, and client-side task utilities.

---

## Tech Stack

- **Frontend:** SvelteKit
- **UI:** shadcn-svelte (custom styled components)
- **Backend / Auth / Database:** Supabase
- **Language:** TypeScript
- **Styling:** CSS variables and reusable utility classes

---

## Features

### Authentication
- Email & password **Sign Up**
- Email & password **Login**
- **Remember Me** (session persistence handled by Supabase)
- **Password Reset** via email
- Protected routes (unauthenticated users redirected to login)
- Logout functionality

### Task Management
- Create tasks with:
  - Title
  - Description
  - Priority (Low / Medium / High)
  - Due date
  - Status (Pending / In Progress / Completed)
- Edit tasks inline
- Delete tasks
- Update task status

### Task Utilities
- **Search** tasks by title
- **Filter** tasks by:
  - Status
  - Priority
- **Sort** tasks by:
  - Created date
  - Due date
  - Priority
- Empty state shown when no tasks exist

### UI / UX
- Clean and professional layout
- Responsive design
- Fixed-width cards for consistent UI
- Minimal and accessible forms
- No unnecessary re-renders

---

## Setup Instructions

### 1. Clone the Repository
git clone https://github.com/apurvab19/task-manager.git
cd task-manager

### 2. Install Dependencies
npm install

### 3. Create a Supabase Project
Visit https://supabase.com

Create a new project
Copy the Project URL and Anon Public Key
Environment Variables
Create a .env file in the root directory:

PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key

Note: Environment variables must start with PUBLIC_ for SvelteKit to access them on the client.

### Database Schema

Run the following SQL in the Supabase SQL Editor:

create table tasks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  description text,
  priority text not null,
  due_date date not null,
  status text default 'Pending',
  created_at timestamptz default now()
);

alter table tasks enable row level security;

create policy "Users can manage their tasks"
on tasks
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

## This ensures:
Users can only access their own tasks
Secure data access using Supabase RLS

## Running the Application
npm run dev

The app will be available at:
http://localhost:5173

### Application Flow
Sign Up
User registers with email and password
Confirms email via Supabase
Redirected to login
Login
User logs in using credentials
Session persists across refresh
Redirected to /tasks
Tasks Page
Protected route
Users can create, edit, delete, filter, and sort tasks
Logout redirects to login page

### Assumptions & Design Decisions
Client-side search, filter, and sorting are used to reduce database queries.
Supabase session persistence is used instead of custom “remember me” logic.
UI classes and styling were kept consistent to support external design systems.
Focus was on building a functional MVP first.
SvelteKit’s reactivity is used for efficient state updates.

### Screenshots
<img width="1915" height="936" alt="image" src="https://github.com/user-attachments/assets/a7f76ac5-57d7-4d49-ae1c-b8b4e4f13dd6" />

<img width="1919" height="932" alt="image" src="https://github.com/user-attachments/assets/3386e272-1809-4797-b804-6b59dbbeea3a" />

<img width="1893" height="932" alt="image" src="https://github.com/user-attachments/assets/6a663fdd-366a-4954-b35e-3347e16de308" />

