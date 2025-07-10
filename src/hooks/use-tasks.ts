'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { useAuth } from '@/components/AuthProvider';
import { fetchTasks, fetchProjects } from '@/lib/supabase-tasks';
import { supabase } from '@/lib/supabase';

export function useTasks() {
  const { user } = useAuth();
  const { setTasks, setProjects, setIsLoading } = useAppStore();

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      setIsLoading(true);
      try {
        // Fetch tasks
        const { data: tasksData, error: tasksError } = await fetchTasks(user.id);
        if (tasksError) {
          console.error('Error fetching tasks:', tasksError);
        } else if (tasksData) {
          setTasks(tasksData);
        }

        // Fetch projects
        const { data: projectsData, error: projectsError } = await fetchProjects(user.id);
        if (projectsError) {
          console.error('Error fetching projects:', projectsError);
        } else if (projectsData) {
          setProjects(projectsData);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

    // Set up real-time subscriptions
    const tasksSubscription = supabase
      .channel('tasks-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT' && payload.new) {
            setTasks((current) => [payload.new as any, ...current]);
          } else if (payload.eventType === 'UPDATE' && payload.new) {
            setTasks((current) =>
              current.map((task) =>
                task.id === payload.new.id ? (payload.new as any) : task
              )
            );
          } else if (payload.eventType === 'DELETE' && payload.old) {
            setTasks((current) =>
              current.filter((task) => task.id !== (payload.old as any).id)
            );
          }
        }
      )
      .subscribe();

    const projectsSubscription = supabase
      .channel('projects-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT' && payload.new) {
            setProjects((current) => [payload.new as any, ...current]);
          } else if (payload.eventType === 'UPDATE' && payload.new) {
            setProjects((current) =>
              current.map((project) =>
                project.id === payload.new.id ? (payload.new as any) : project
              )
            );
          } else if (payload.eventType === 'DELETE' && payload.old) {
            setProjects((current) =>
              current.filter((project) => project.id !== (payload.old as any).id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      tasksSubscription.unsubscribe();
      projectsSubscription.unsubscribe();
    };
  }, [user, setTasks, setProjects, setIsLoading]);
}
