"use client"

import { useState, useEffect } from 'react';
import { Task, Priority } from '@/types/todo';
import { TaskForm } from './TaskForm';
import { TaskList } from './TaskList';
import { TaskFilters } from './TaskFilters';
import { Card } from '@/components/ui/card';
import { Plus, CheckSquare, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function TodoApp() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');

  // Fetch tasks from database
  const fetchTasks = async () => {
  try {
    setLoading(true);
    const response = await fetch('/api/tasks');
    
    if (!response.ok) {
      const text = await response.text();
      console.error('API Error Response:', text);
      throw new Error(`Failed to fetch tasks: ${response.status}`);
    }
    
    const data = await response.json();
    setTasks(data.map((task: any) => ({
      ...task,
      dueDate: task.dueDate ? new Date(task.dueDate) : null,
      dueTime: task.dueTime ? new Date(task.dueTime) : null,
      createdAt: new Date(task.createdAt),
      updatedAt: new Date(task.updatedAt)
    })));
  } catch (error) {
    console.error('Error fetching tasks:', error);
  } finally {
    setLoading(false);
  }
};

  // Load tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (taskData: Omit<Task, 'id' | 'isCompleted' | 'createdAt' | 'updatedAt'>) => {
  try {
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      // Log the response for debugging
      const text = await response.text();
      console.error('API Error Response:', text);
      throw new Error(`Failed to create task: ${response.status}`);
    }
    
    const newTask = await response.json();
    setTasks(prev => [
      {
        ...newTask,
        dueDate: newTask.dueDate ? new Date(newTask.dueDate) : null,
        dueTime: newTask.dueTime ? new Date(newTask.dueTime) : null,
        createdAt: new Date(newTask.createdAt),
        updatedAt: new Date(newTask.updatedAt)
      },
      ...prev
    ]);
    setShowForm(false);
  } catch (error) {
    console.error('Error creating task:', error);
  }
};

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error('Failed to update task');
      
      const updatedTask = await response.json();
      setTasks(prev => 
        prev.map(task => 
          task.id === id 
            ? {
                ...updatedTask,
                dueDate: updatedTask.dueDate ? new Date(updatedTask.dueDate) : null,
                dueTime: updatedTask.dueTime ? new Date(updatedTask.dueTime) : null,
                createdAt: new Date(updatedTask.createdAt),
                updatedAt: new Date(updatedTask.updatedAt)
              }
            : task
        )
      );
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete task');
      
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed' && !task.isCompleted) return false;
    if (filter === 'active' && task.isCompleted) return false;
    if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;
    return true;
  });

  const completedCount = tasks.filter(task => task.isCompleted).length;
  const totalCount = tasks.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <CheckSquare className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Todo Manager
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            G17 Stay organized and productive with smart task management
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span>{totalCount} total tasks</span>
            <span>{completedCount} completed</span>
            <span>{totalCount - completedCount} remaining</span>
          </div>
        </div>

        {/* Add Task Button */}
        {!showForm && (
          <div className="flex justify-center">
            <Button
              onClick={() => setShowForm(true)}
              size="lg"
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add New Task
            </Button>
          </div>
        )}

        {/* Task Form */}
        {showForm && (
          <Card className="p-6 shadow-lg">
            <TaskForm
              onSubmit={addTask}
              onCancel={() => setShowForm(false)}
            />
          </Card>
        )}

        {/* Filters */}
        <TaskFilters
          filter={filter}
          onFilterChange={setFilter}
          priorityFilter={priorityFilter}
          onPriorityFilterChange={setPriorityFilter}
        />

        {/* Task List */}
        <TaskList
          tasks={filteredTasks}
          onUpdateTask={updateTask}
          onDeleteTask={deleteTask}
        />

        {filteredTasks.length === 0 && (
          <Card className="p-12 text-center">
            <CheckSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">
              No tasks found
            </h3>
            <p className="text-muted-foreground">
              {filter === 'all' ? 'Add your first task to get started!' : `No ${filter} tasks to show.`}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
