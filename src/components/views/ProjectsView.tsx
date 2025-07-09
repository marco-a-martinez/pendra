'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { TaskCard } from '@/components/TaskCard';
import { EmptyState } from '@/components/EmptyState';
import { Project } from '@/types';
import { generateId, projectColors } from '@/lib/utils';
import { FolderOpen, Plus, MoreHorizontal } from 'lucide-react';

export function ProjectsView() {
  const { projects, tasks, addProject, user } = useAppStore();
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [selectedColor, setSelectedColor] = useState(projectColors[0]);
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim() || !user) return;

    const project: Project = {
      id: generateId(),
      user_id: user.id,
      name: newProjectName.trim(),
      color: selectedColor,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    addProject(project);
    setNewProjectName('');
    setSelectedColor(projectColors[0]);
    setShowNewProject(false);
  };

  const toggleProject = (projectId: string) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId);
    } else {
      newExpanded.add(projectId);
    }
    setExpandedProjects(newExpanded);
  };

  const getProjectTasks = (projectId: string) => {
    return tasks.filter(task => task.project_id === projectId && task.status !== 'completed');
  };

  const getCompletedProjectTasks = (projectId: string) => {
    return tasks.filter(task => task.project_id === projectId && task.status === 'completed');
  };

  if (projects.length === 0) {
    return (
      <div className="space-y-6">
        <EmptyState
          icon={FolderOpen}
          title="No projects yet"
          description="Organize your tasks by creating projects. Projects help you group related tasks together."
          actionLabel="Create Project"
          onAction={() => setShowNewProject(true)}
        />
        
        {showNewProject && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="input-field"
                  placeholder="Enter project name..."
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Color
                </label>
                <div className="flex gap-2">
                  {projectColors.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border-2 ${
                        selectedColor === color ? 'border-gray-400' : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button type="submit" className="btn-primary">
                  Create Project
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewProject(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {projects.length} project{projects.length !== 1 ? 's' : ''}
        </p>
        <button
          onClick={() => setShowNewProject(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* New Project Form */}
      {showNewProject && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <form onSubmit={handleCreateProject} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Project Name
              </label>
              <input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                className="input-field"
                placeholder="Enter project name..."
                autoFocus
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Color
              </label>
              <div className="flex gap-2">
                {projectColors.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border-2 ${
                      selectedColor === color ? 'border-gray-400' : 'border-gray-200'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button type="submit" className="btn-primary">
                Create Project
              </button>
              <button
                type="button"
                onClick={() => setShowNewProject(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Projects List */}
      <div className="space-y-4">
        {projects.map(project => {
          const projectTasks = getProjectTasks(project.id);
          const completedTasks = getCompletedProjectTasks(project.id);
          const isExpanded = expandedProjects.has(project.id);
          
          return (
            <div
              key={project.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              {/* Project Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => toggleProject(project.id)}
                    className="flex items-center space-x-3 flex-1 text-left"
                  >
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: project.color }}
                    />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {project.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {projectTasks.length} active task{projectTasks.length !== 1 ? 's' : ''}
                        {completedTasks.length > 0 && (
                          <span> • {completedTasks.length} completed</span>
                        )}
                      </p>
                    </div>
                  </button>
                  
                  <div className="flex items-center space-x-2">
                    {projectTasks.length > 0 && (
                      <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-300"
                          style={{
                            backgroundColor: project.color,
                            width: `${completedTasks.length / (projectTasks.length + completedTasks.length) * 100}%`
                          }}
                        />
                      </div>
                    )}
                    
                    <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                      <MoreHorizontal className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Project Tasks */}
              {isExpanded && (
                <div className="p-4 space-y-3">
                  {projectTasks.length === 0 && completedTasks.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                      No tasks in this project yet
                    </p>
                  ) : (
                    <>
                      {projectTasks.map(task => (
                        <TaskCard key={task.id} task={task} />
                      ))}
                      
                      {completedTasks.length > 0 && (
                        <>
                          <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Completed ({completedTasks.length})
                            </h4>
                            {completedTasks.map(task => (
                              <TaskCard key={task.id} task={task} />
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
