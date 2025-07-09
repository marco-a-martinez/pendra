# Pendra - Modern Todo App

A modern, full-featured productivity app combining the best of Things 3 and Sorted, built with Next.js, TypeScript, and Supabase.

## Features

✅ **Task Management**
- Create tasks and subtasks
- Rich text editor for task descriptions
- Due dates, scheduled times, and estimated duration
- Projects, tags, priority levels, and color coding
- Repeat rules (coming soon)

✅ **Views**
- Inbox for new tasks
- Today view for current tasks
- Upcoming view for future tasks
- Projects view for organized task management
- Dashboard with productivity insights
- Calendar view (coming soon)

✅ **UX & UI**
- Clean, modern interface inspired by Things 3 and Sorted
- Light and dark modes
- Smooth animations and transitions
- Responsive design for desktop and mobile

✅ **Authentication**
- Google OAuth via Supabase
- Secure user sessions
- Per-user task synchronization

## Tech Stack

- **Frontend**: Next.js 15 with TypeScript and App Router
- **Styling**: Tailwind CSS with custom components
- **Rich Text**: TipTap editor
- **Authentication & Database**: Supabase
- **State Management**: Zustand
- **Hosting**: Vercel
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account
- A Google OAuth app (for authentication)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/marco-a-martinez/pendra.git
   cd pendra
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Settings > API to get your URL and anon key
   - Set up Google OAuth in Authentication > Providers

4. **Configure environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Fill in your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

5. **Set up the database**
   
   Run these SQL commands in your Supabase SQL editor:
   
   ```sql
   -- Create users table
   CREATE TABLE users (
     id UUID REFERENCES auth.users(id) PRIMARY KEY,
     email TEXT NOT NULL,
     name TEXT,
     avatar_url TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   
   -- Create projects table
   CREATE TABLE projects (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES users(id) ON DELETE CASCADE,
     name TEXT NOT NULL,
     description TEXT,
     color TEXT DEFAULT '#3b82f6',
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   
   -- Create tasks table
   CREATE TABLE tasks (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES users(id) ON DELETE CASCADE,
     project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
     title TEXT NOT NULL,
     description TEXT,
     due_date TIMESTAMP WITH TIME ZONE,
     scheduled_time TIMESTAMP WITH TIME ZONE,
     estimated_duration INTEGER,
     priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
     status TEXT DEFAULT 'inbox' CHECK (status IN ('inbox', 'today', 'upcoming', 'completed')),
     tags TEXT[] DEFAULT '{}',
     color TEXT,
     repeat_rule JSONB,
     completed_at TIMESTAMP WITH TIME ZONE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     order_index BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000
   );
   
   -- Create subtasks table
   CREATE TABLE subtasks (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
     title TEXT NOT NULL,
     completed BOOLEAN DEFAULT FALSE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     order_index BIGINT DEFAULT EXTRACT(EPOCH FROM NOW()) * 1000
   );
   
   -- Create attachments table
   CREATE TABLE attachments (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
     name TEXT NOT NULL,
     url TEXT NOT NULL,
     type TEXT DEFAULT 'file' CHECK (type IN ('file', 'link')),
     size INTEGER,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   
   -- Enable Row Level Security
   ALTER TABLE users ENABLE ROW LEVEL SECURITY;
   ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
   ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
   ALTER TABLE subtasks ENABLE ROW LEVEL SECURITY;
   ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;
   
   -- Create policies
   CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
   CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
   CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);
   
   CREATE POLICY "Users can manage own projects" ON projects FOR ALL USING (auth.uid() = user_id);
   CREATE POLICY "Users can manage own tasks" ON tasks FOR ALL USING (auth.uid() = user_id);
   CREATE POLICY "Users can manage subtasks of own tasks" ON subtasks FOR ALL USING (
     EXISTS (SELECT 1 FROM tasks WHERE tasks.id = subtasks.task_id AND tasks.user_id = auth.uid())
   );
   CREATE POLICY "Users can manage attachments of own tasks" ON attachments FOR ALL USING (
     EXISTS (SELECT 1 FROM tasks WHERE tasks.id = attachments.task_id AND tasks.user_id = auth.uid())
   );
   
   -- Create function to handle user creation
   CREATE OR REPLACE FUNCTION handle_new_user()
   RETURNS TRIGGER AS $$
   BEGIN
     INSERT INTO users (id, email, name, avatar_url)
     VALUES (
       NEW.id,
       NEW.email,
       NEW.raw_user_meta_data->>'full_name',
       NEW.raw_user_meta_data->>'avatar_url'
     );
     RETURN NEW;
   END;
   $$ LANGUAGE plpgsql SECURITY DEFINER;
   
   -- Create trigger for new user creation
   CREATE TRIGGER on_auth_user_created
     AFTER INSERT ON auth.users
     FOR EACH ROW EXECUTE FUNCTION handle_new_user();
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Deployment

### Deploy to Vercel

1. **Connect your repository to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository

2. **Configure environment variables**
   
   Add the same environment variables from your `.env.local` file to Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_APP_URL` (set to your Vercel domain)

3. **Update Supabase settings**
   
   In your Supabase project:
   - Go to Authentication > Settings
   - Add your Vercel domain to "Site URL"
   - Add your Vercel domain to "Redirect URLs"

4. **Deploy**
   
   Vercel will automatically deploy your app when you push to your main branch.

## Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── auth/              # Authentication routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── views/             # Main view components
│   ├── AppLayout.tsx      # Main app layout
│   ├── AuthProvider.tsx   # Authentication provider
│   ├── Header.tsx         # App header
│   ├── Sidebar.tsx        # Navigation sidebar
│   ├── TaskCard.tsx       # Task display component
│   ├── TaskModal.tsx      # Task creation/editing modal
│   └── ...               # Other components
├── lib/                   # Utility libraries
│   ├── supabase.ts        # Supabase client
│   ├── store.ts           # Zustand state management
│   ├── utils.ts           # General utilities
│   └── dateUtils.ts       # Date formatting utilities
└── types/                 # TypeScript type definitions
    ├── index.ts           # Main types
    └── database.ts        # Database types
```

## Contributing

This is a solo project, but feedback and suggestions are welcome! Feel free to open issues or submit pull requests.

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Roadmap

- [ ] Calendar view with drag-and-drop scheduling
- [ ] Web push notifications
- [ ] Offline support with service workers
- [ ] Task templates and automation
- [ ] Collaboration features
- [ ] Mobile app (React Native)
- [ ] AI-powered task suggestions
- [ ] Import/export functionality
- [ ] Advanced reporting and analytics

---

Built with ❤️ using Next.js, TypeScript, and Supabase.
