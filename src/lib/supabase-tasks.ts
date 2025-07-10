import { supabase } from './supabase';
import { Task, Project } from '@/types';

// Check if Supabase is properly configured
const isSupabaseConfigured = () => {
  return process.env.NEXT_PUBLIC_SUPABASE_URL && 
         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
};

// Task operations
export const fetchTasks = async (userId: string) => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, returning empty tasks');
    return { data: [], error: null };
  }
  
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    return { data, error };
  } catch (err) {
    console.error('Error fetching tasks:', err);
    return { data: [], error: err };
  }
};

export const createTask = async (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, creating local task');
    const localTask: Task = {
      ...task,
      id: `local-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    return { data: localTask, error: null };
  }
  
  try {
    const { data, error } = await supabase
      .from('tasks')
      .insert([{
        ...task,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();
    
    return { data, error };
  } catch (err) {
    console.error('Error creating task:', err);
    return { data: null, error: err };
  }
};

export const updateTask = async (taskId: string, updates: Partial<Task>) => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, update will not persist');
    return { data: { ...updates, id: taskId, updated_at: new Date().toISOString() } as Task, error: null };
  }
  
  try {
    const { data, error } = await supabase
      .from('tasks')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', taskId)
      .select()
      .single();
    
    return { data, error };
  } catch (err) {
    console.error('Error updating task:', err);
    return { data: null, error: err };
  }
};

export const deleteTask = async (taskId: string) => {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId);
  
  return { error };
};

// Project operations
export const fetchProjects = async (userId: string) => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, returning empty projects');
    return { data: [], error: null };
  }
  
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    return { data, error };
  } catch (err) {
    console.error('Error fetching projects:', err);
    return { data: [], error: err };
  }
};

export const createProject = async (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('projects')
    .insert([{
      ...project,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }])
    .select()
    .single();
  
  return { data, error };
};

export const updateProject = async (projectId: string, updates: Partial<Project>) => {
  const { data, error } = await supabase
    .from('projects')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', projectId)
    .select()
    .single();
  
  return { data, error };
};

export const deleteProject = async (projectId: string) => {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId);
  
  return { error };
};
