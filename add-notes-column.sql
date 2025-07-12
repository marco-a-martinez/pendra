-- Add notes column to tasks table
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS notes TEXT;

-- Update the updated_at timestamp for existing rows
UPDATE tasks SET updated_at = NOW() WHERE notes IS NULL;