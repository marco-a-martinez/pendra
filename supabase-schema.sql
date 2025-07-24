-- Create sections table
CREATE TABLE IF NOT EXISTS sections (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  color TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  collapsed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create todos table
CREATE TABLE IF NOT EXISTS todos (
  id TEXT PRIMARY KEY,
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  order_index INTEGER NOT NULL DEFAULT 0,
  due_date TIMESTAMP WITH TIME ZONE,
  section_id TEXT NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  checklist JSONB,
  checklist_expanded BOOLEAN DEFAULT FALSE,
  note TEXT,
  note_expanded BOOLEAN DEFAULT FALSE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_todos_section_id ON todos(section_id);
CREATE INDEX IF NOT EXISTS idx_todos_order ON todos(order_index);
CREATE INDEX IF NOT EXISTS idx_todos_due_date ON todos(due_date);
CREATE INDEX IF NOT EXISTS idx_sections_order ON sections(order_index);

-- Enable Row Level Security (RLS)
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (since this is a simple todo app)
-- In production, you'd want more restrictive policies based on user authentication
CREATE POLICY "Allow all operations on sections" ON sections
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on todos" ON todos
  FOR ALL USING (true) WITH CHECK (true);

-- Insert default section
INSERT INTO sections (id, name, order_index, collapsed)
VALUES ('default', 'Tasks', 0, false)
ON CONFLICT (id) DO NOTHING;
