'use client';

import { useState, useEffect } from 'react';
import { Plus, ChevronDown, ChevronRight } from 'lucide-react';

interface Task {
  id: string;
  content: string;
  business: string;
  status: 'backlog' | 'in-progress' | 'done';
  eta?: string;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', content: 'Gmail Integration Setup', business: 'MyTruckManager', status: 'in-progress', eta: 'Today' },
    { id: '2', content: 'Review Notion Database', business: '615Data', status: 'backlog' },
    { id: '3', content: 'Follow up: Fleet Manager', business: 'YTruck', status: 'in-progress' },
    { id: '4', content: 'Demo Request from Texas', business: '615Data', status: 'backlog' },
    { id: '5', content: 'Telegram Bot Connected', business: 'MyTruckManager', status: 'done' },
  ]);

  const [selectedBusiness, setSelectedBusiness] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState({
    backlog: true,
    'in-progress': true,
    done: false,
  });
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({ content: '', business: 'MyTruckManager' });
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('command-tasks');
    if (saved) {
      setTasks(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('command-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const businesses = ['MyTruckManager', '615Data', 'YTruck'];

  const filteredTasks = selectedBusiness
    ? tasks.filter((t) => t.business === selectedBusiness)
    : tasks;

  const tasksByStatus = {
    backlog: filteredTasks.filter((t) => t.status === 'backlog'),
    'in-progress': filteredTasks.filter((t) => t.status === 'in-progress'),
    done: filteredTasks.filter((t) => t.status === 'done'),
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const addTask = () => {
    if (!newTask.content.trim()) return;
    const task: Task = {
      id: Date.now().toString(),
      content: newTask.content,
      business: newTask.business,
      status: 'backlog',
    };
    setTasks((prev) => [...prev, task]);
    setNewTask({ content: '', business: 'MyTruckManager' });
    setShowAddTask(false);
  };

  const updateTaskStatus = (taskId: string, status: Task['status']) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status } : t)));
    setSelectedTask(null);
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    setSelectedTask(null);
  };

  const statusConfig = {
    backlog: { label: 'Backlog', color: 'bg-text-secondary', textColor: 'text-text-secondary' },
    'in-progress': { label: 'In Progress', color: 'bg-accent-primary', textColor: 'text-accent-primary' },
    done: { label: 'Done', color: 'bg-accent-success', textColor: 'text-accent-success' },
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-bg-surface/95 backdrop-blur border-b border-white/[0.06]">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">Alyssa Command Center</h1>
              <p className="text-sm text-text-secondary">AI Operations Overview</p>
            </div>
            <button
              onClick={() => setShowAddTask(true)}
              className="p-2.5 bg-accent-primary rounded-xl hover:bg-accent-primary/90 transition min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Business Filter */}
        <div className="px-4 pb-3 overflow-x-auto hide-scrollbar">
          <div className="flex gap-2 min-w-max">
            <button
              onClick={() => setSelectedBusiness(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${
                selectedBusiness === null
                  ? 'bg-accent-primary text-white'
                  : 'bg-bg-elevated text-text-secondary hover:text-text-primary'
              }`}
            >
              All
            </button>
            {businesses.map((business) => (
              <button
                key={business}
                onClick={() => setSelectedBusiness(business)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${
                  selectedBusiness === business
                    ? 'bg-accent-primary text-white'
                    : 'bg-bg-elevated text-text-secondary hover:text-text-primary'
                }`}
              >
                {business}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 space-y-6 pb-24">
        {(['backlog', 'in-progress', 'done'] as const).map((status) => {
          const config = statusConfig[status];
          const sectionTasks = tasksByStatus[status];
          const isExpanded = expandedSections[status];

          return (
            <section key={status}>
              <button
                onClick={() => toggleSection(status)}
                className="w-full flex items-center justify-between mb-3 min-h-[44px]"
              >
                <div className="flex items-center gap-2">
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-text-secondary" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-text-secondary" />
                  )}
                  <h2 className="text-lg font-semibold">{config.label}</h2>
                  <span className="px-2.5 py-0.5 bg-bg-elevated rounded-full text-sm font-medium text-text-secondary">
                    {sectionTasks.length}
                  </span>
                </div>
              </button>

              {isExpanded && (
                <div className="space-y-2">
                  {sectionTasks.length === 0 ? (
                    <div className="p-6 text-center text-text-secondary text-sm">
                      No tasks
                    </div>
                  ) : (
                    sectionTasks.map((task) => (
                      <button
                        key={task.id}
                        onClick={() => setSelectedTask(task)}
                        className="w-full bg-bg-surface rounded-2xl p-4 text-left shadow-lg hover:bg-bg-elevated transition relative overflow-hidden min-h-[60px]"
                      >
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${config.color}`} />
                        <div className="pl-3">
                          <div className="font-semibold mb-2">{task.content}</div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2.5 py-1 bg-bg-elevated rounded-lg text-xs font-medium text-text-secondary">
                              {task.business}
                            </span>
                            {task.eta && (
                              <span className="px-2.5 py-1 bg-accent-warning/10 rounded-lg text-xs font-medium text-accent-warning">
                                {task.eta}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </section>
          );
        })}
      </main>

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-bg-surface rounded-3xl w-full max-w-md shadow-2xl">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">New Task</h3>
              <textarea
                value={newTask.content}
                onChange={(e) => setNewTask({ ...newTask, content: e.target.value })}
                placeholder="What needs to be done?"
                className="w-full px-4 py-3 bg-bg-elevated rounded-xl text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary mb-4 resize-none h-24"
              />
              <select
                value={newTask.business}
                onChange={(e) => setNewTask({ ...newTask, business: e.target.value })}
                className="w-full px-4 py-3 bg-bg-elevated rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary mb-4"
              >
                {businesses.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
              <div className="flex gap-3">
                <button
                  onClick={addTask}
                  className="flex-1 px-4 py-3 bg-accent-primary text-white font-semibold rounded-xl hover:bg-accent-primary/90 transition min-h-[48px]"
                >
                  Create
                </button>
                <button
                  onClick={() => setShowAddTask(false)}
                  className="flex-1 px-4 py-3 bg-bg-elevated text-text-primary font-semibold rounded-xl hover:bg-bg-elevated/80 transition min-h-[48px]"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-bg-surface rounded-3xl w-full max-w-md shadow-2xl">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{selectedTask.content}</h3>
              <div className="flex items-center gap-2 mb-6">
                <span className="px-3 py-1.5 bg-bg-elevated rounded-lg text-sm font-medium text-text-secondary">
                  {selectedTask.business}
                </span>
                <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${statusConfig[selectedTask.status].textColor} ${statusConfig[selectedTask.status].color}/10`}>
                  {statusConfig[selectedTask.status].label}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-sm text-text-secondary mb-2">Move to:</p>
                {(['backlog', 'in-progress', 'done'] as const)
                  .filter((s) => s !== selectedTask.status)
                  .map((status) => (
                    <button
                      key={status}
                      onClick={() => updateTaskStatus(selectedTask.id, status)}
                      className="w-full px-4 py-3 bg-bg-elevated text-text-primary font-medium rounded-xl hover:bg-bg-elevated/80 transition text-left min-h-[48px]"
                    >
                      {statusConfig[status].label}
                    </button>
                  ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => deleteTask(selectedTask.id)}
                  className="flex-1 px-4 py-3 bg-red-500/10 text-red-400 font-semibold rounded-xl hover:bg-red-500/20 transition min-h-[48px]"
                >
                  Delete
                </button>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="flex-1 px-4 py-3 bg-bg-elevated text-text-primary font-semibold rounded-xl hover:bg-bg-elevated/80 transition min-h-[48px]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
