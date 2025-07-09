'use client';

import { useAppStore } from '@/lib/store';
import { CheckCircle2, Clock, Target, TrendingUp } from 'lucide-react';
import { formatDate } from '@/lib/dateUtils';
import { isToday, isThisWeek } from 'date-fns';

export function DashboardView() {
  const { tasks, projects } = useAppStore();

  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const todayTasks = tasks.filter(task => 
    task.status === 'today' || 
    (task.due_date && isToday(new Date(task.due_date)))
  ).length;
  const thisWeekTasks = tasks.filter(task => 
    task.due_date && isThisWeek(new Date(task.due_date))
  ).length;
  
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Recent activity
  const recentCompletedTasks = tasks
    .filter(task => task.status === 'completed' && task.completed_at)
    .sort((a, b) => new Date(b.completed_at!).getTime() - new Date(a.completed_at!).getTime())
    .slice(0, 5);

  const stats = [
    {
      label: 'Total Tasks',
      value: totalTasks,
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20'
    },
    {
      label: 'Completed',
      value: completedTasks,
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20'
    },
    {
      label: 'Due Today',
      value: todayTasks,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20'
    },
    {
      label: 'This Week',
      value: thisWeekTasks,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion Rate */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Overall Progress
        </h3>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Completion Rate
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {completionRate}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className="bg-green-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {completedTasks}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              of {totalTasks}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h3>
          {recentCompletedTasks.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No completed tasks yet
            </p>
          ) : (
            <div className="space-y-3">
              {recentCompletedTasks.map(task => (
                <div key={task.id} className="flex items-center space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {task.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Completed {formatDate(task.completed_at!)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Projects Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Projects Overview
          </h3>
          {projects.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No projects created yet
            </p>
          ) : (
            <div className="space-y-3">
              {projects.slice(0, 5).map(project => {
                const projectTasks = tasks.filter(t => t.project_id === project.id);
                const completedProjectTasks = projectTasks.filter(t => t.status === 'completed');
                const progress = projectTasks.length > 0 
                  ? Math.round((completedProjectTasks.length / projectTasks.length) * 100) 
                  : 0;
                
                return (
                  <div key={project.id} className="flex items-center space-x-3">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: project.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {project.name}
                        </p>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {progress}%
                        </span>
                      </div>
                      <div className="mt-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full transition-all duration-300"
                          style={{
                            backgroundColor: project.color,
                            width: `${progress}%`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
