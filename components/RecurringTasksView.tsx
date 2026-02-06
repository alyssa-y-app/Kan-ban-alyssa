'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { RefreshCw, Plus, X, Clock } from 'lucide-react';

interface RecurringTask {
  id: string;
  name: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  riskLevel: 'low' | 'medium' | 'high';
  scheduledTime?: string;
  timezone: string;
  createdAt: number;
}

export function RecurringTasksView() {
  const [tasks, setTasks] = useState<RecurringTask[]>([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({
    name: '',
    description: '',
    frequency: 'daily' as const,
    riskLevel: 'low' as const,
    scheduledTime: '',
    timezone: 'America/Chicago',
  });

  const handleAddTask = () => {
    if (!newTask.name.trim()) return;
    const task: RecurringTask = {
      id: Date.now().toString(),
      ...newTask,
      createdAt: Date.now(),
    };
    setTasks(prev => [...prev, task]);
    setNewTask({
      name: '',
      description: '',
      frequency: 'daily',
      riskLevel: 'low',
      scheduledTime: '',
      timezone: 'America/Chicago',
    });
    setShowAddTask(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h2 className="text-lg font-bold">System Tasks</h2>
            <p className="text-sm text-muted-foreground">Automated & recurring operations</p>
          </div>
          <Button
            size="icon"
            onClick={() => setShowAddTask(true)}
            className="bg-primary hover:bg-primary/90 rounded-full h-12 w-12"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Tasks List */}
      <div className="flex-1 overflow-y-auto px-4">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <RefreshCw className="w-16 h-16 text-muted-foreground mb-3" />
            <p className="text-lg font-medium text-muted-foreground mb-1">No recurring tasks</p>
            <p className="text-sm text-muted-foreground">Define automated operations for Alyssa</p>
          </div>
        ) : (
          <div className="space-y-3 pb-4">
            {tasks.map(task => (
              <div
                key={task.id}
                className="bg-card rounded-xl p-4 shadow-sm border border-border"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold">{task.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    task.riskLevel === 'high' ? 'bg-red-500/20 text-red-400' :
                    task.riskLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {task.riskLevel}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="capitalize">{task.frequency}</span>
                  {task.scheduledTime && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {task.scheduledTime}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-card rounded-3xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">New Recurring Task</h3>
                <button
                  onClick={() => setShowAddTask(false)}
                  className="p-1 hover:bg-accent rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Name</label>
                  <input
                    type="text"
                    value={newTask.name}
                    onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                    placeholder="e.g. Daily ETA Check"
                    className="w-full px-4 py-3 bg-background rounded-xl focus:outline-none focus:ring-2 focus:ring-primary border border-primary"
                  />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Description</label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    placeholder="What does this task do?"
                    className="w-full px-4 py-3 bg-background rounded-xl focus:outline-none focus:ring-2 focus:ring-primary resize-none h-24"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Frequency</label>
                    <select
                      value={newTask.frequency}
                      onChange={(e) => setNewTask({ ...newTask, frequency: e.target.value as any })}
                      className="w-full px-4 py-3 bg-background rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Risk Level</label>
                    <select
                      value={newTask.riskLevel}
                      onChange={(e) => setNewTask({ ...newTask, riskLevel: e.target.value as any })}
                      className="w-full px-4 py-3 bg-background rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Scheduled Time</label>
                    <input
                      type="time"
                      value={newTask.scheduledTime}
                      onChange={(e) => setNewTask({ ...newTask, scheduledTime: e.target.value })}
                      className="w-full px-4 py-3 bg-background rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Timezone</label>
                    <select
                      value={newTask.timezone}
                      onChange={(e) => setNewTask({ ...newTask, timezone: e.target.value })}
                      className="w-full px-4 py-3 bg-background rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="America/Chicago">America/Chicago</option>
                      <option value="America/New_York">America/New_York</option>
                      <option value="America/Los_Angeles">America/Los_Angeles</option>
                      <option value="UTC">UTC</option>
                    </select>
                  </div>
                </div>
              </div>

              <Button 
                className="w-full bg-primary hover:bg-primary/90 h-12 mt-6" 
                onClick={handleAddTask}
              >
                Create Task
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
