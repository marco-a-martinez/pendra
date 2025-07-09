export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          color: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          color?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          color?: string
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          project_id: string | null
          title: string
          description: string | null
          due_date: string | null
          scheduled_time: string | null
          estimated_duration: number | null
          priority: 'low' | 'medium' | 'high'
          status: 'inbox' | 'today' | 'upcoming' | 'completed'
          tags: string[]
          color: string | null
          repeat_rule: Json | null
          completed_at: string | null
          created_at: string
          updated_at: string
          order_index: number
        }
        Insert: {
          id?: string
          user_id: string
          project_id?: string | null
          title: string
          description?: string | null
          due_date?: string | null
          scheduled_time?: string | null
          estimated_duration?: number | null
          priority?: 'low' | 'medium' | 'high'
          status?: 'inbox' | 'today' | 'upcoming' | 'completed'
          tags?: string[]
          color?: string | null
          repeat_rule?: Json | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
          order_index?: number
        }
        Update: {
          id?: string
          user_id?: string
          project_id?: string | null
          title?: string
          description?: string | null
          due_date?: string | null
          scheduled_time?: string | null
          estimated_duration?: number | null
          priority?: 'low' | 'medium' | 'high'
          status?: 'inbox' | 'today' | 'upcoming' | 'completed'
          tags?: string[]
          color?: string | null
          repeat_rule?: Json | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
          order_index?: number
        }
      }
      subtasks: {
        Row: {
          id: string
          task_id: string
          title: string
          completed: boolean
          created_at: string
          updated_at: string
          order_index: number
        }
        Insert: {
          id?: string
          task_id: string
          title: string
          completed?: boolean
          created_at?: string
          updated_at?: string
          order_index?: number
        }
        Update: {
          id?: string
          task_id?: string
          title?: string
          completed?: boolean
          created_at?: string
          updated_at?: string
          order_index?: number
        }
      }
      attachments: {
        Row: {
          id: string
          task_id: string
          name: string
          url: string
          type: 'file' | 'link'
          size: number | null
          created_at: string
        }
        Insert: {
          id?: string
          task_id: string
          name: string
          url: string
          type: 'file' | 'link'
          size?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          task_id?: string
          name?: string
          url?: string
          type?: 'file' | 'link'
          size?: number | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
