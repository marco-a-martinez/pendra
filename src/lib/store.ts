import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, Project, ViewType, CalendarViewType, User } from '@/types';

interface AppStore {
  // User state
  user: User | null;
  setUser: (user: User | null) => void;
  
  // UI state
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  
  calendarView: CalendarViewType;
  setCalendarView: (view: CalendarViewType) => void;
  
  darkMode: boolean;
  toggleDarkMode: () => void;
  
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Data state
  tasks: Task[];
  setTasks: (tasks: Task[] | ((prev: Task[]) => Task[])) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  
  projects: Project[];
  setProjects: (projects: Project[] | ((prev: Project[]) => Project[])) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  
  // Loading states
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  
  // Modal states
  taskModalOpen: boolean;
  setTaskModalOpen: (open: boolean) => void;
  editingTask: Task | null;
  setEditingTask: (task: Task | null) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      // User state
      user: null,
      setUser: (user) => set({ user }),
      
      // UI state
      currentView: 'today',
      setCurrentView: (view) => set({ currentView: view }),
      
      selectedDate: new Date(),
      setSelectedDate: (date) => set({ selectedDate: date }),
      
      calendarView: 'week',
      setCalendarView: (view) => set({ calendarView: view }),
      
      darkMode: false,
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      
      sidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      // Data state
      tasks: [],
      setTasks: (tasks) => set((state) => ({ 
        tasks: typeof tasks === 'function' ? tasks(state.tasks) : tasks 
      })),
      addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
      updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map(task => 
          task.id === id ? { ...task, ...updates, updated_at: new Date().toISOString() } : task
        )
      })),
      deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter(task => task.id !== id)
      })),
      
      projects: [],
      setProjects: (projects) => set((state) => ({ 
        projects: typeof projects === 'function' ? projects(state.projects) : projects 
      })),
      addProject: (project) => set((state) => ({ projects: [...state.projects, project] })),
      updateProject: (id, updates) => set((state) => ({
        projects: state.projects.map(project => 
          project.id === id ? { ...project, ...updates, updated_at: new Date().toISOString() } : project
        )
      })),
      deleteProject: (id) => set((state) => ({
        projects: state.projects.filter(project => project.id !== id)
      })),
      
      // Loading states
      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading }),
      
      // Modal states
      taskModalOpen: false,
      setTaskModalOpen: (open) => set({ taskModalOpen: open }),
      editingTask: null,
      setEditingTask: (task) => set({ editingTask: task }),
    }),
    {
      name: 'pendra-storage',
      partialize: (state) => ({
        darkMode: state.darkMode,
        sidebarCollapsed: state.sidebarCollapsed,
        calendarView: state.calendarView,
        currentView: state.currentView,
      }),
    }
  )
);
