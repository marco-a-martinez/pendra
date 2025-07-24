# Supabase Database Setup for Pendra

## Quick Setup Steps:

### 1. Go to your Supabase Dashboard
- Visit: https://supabase.com/dashboard
- Navigate to your project: `mwiqrrqaxntpvjdkadhfd`

### 2. Run the SQL Schema
- Go to the **SQL Editor** in your Supabase dashboard
- Copy and paste the contents of `supabase-schema.sql` 
- Click **Run** to create the tables

### 3. Verify Tables Created
You should see two new tables:
- `sections` - stores todo sections
- `todos` - stores individual todos with checklists

### 4. Test the App
- The app will now save todos to Supabase instead of localStorage
- Todos will persist across browser sessions and devices
- All existing features (checklists, editing, etc.) will work the same

## What Changed:
- ✅ **localStorage** → **Supabase Database**
- ✅ **Local storage** → **Cloud persistence**
- ✅ **Single device** → **Multi-device sync**
- ✅ **Temporary** → **Permanent storage**

## Database Schema:

### Sections Table:
- `id` (TEXT) - Primary key
- `name` (TEXT) - Section name
- `color` (TEXT) - Optional color
- `order_index` (INTEGER) - Display order
- `collapsed` (BOOLEAN) - Collapsed state

### Todos Table:
- `id` (TEXT) - Primary key
- `text` (TEXT) - Todo text
- `completed` (BOOLEAN) - Completion status
- `order_index` (INTEGER) - Display order
- `due_date` (TIMESTAMP) - Optional due date
- `section_id` (TEXT) - Foreign key to sections
- `checklist` (JSONB) - Checklist items
- `checklist_expanded` (BOOLEAN) - Checklist expanded state

That's it! Your todos will now persist forever! 🎉
