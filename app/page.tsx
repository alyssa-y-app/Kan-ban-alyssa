'use client';

import { useState, useEffect } from 'react';
import { Plus, ChevronDown, ChevronRight, Terminal, MessageSquare, BarChart3, Send } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  business: string;
  status: 'backlog' | 'in_progress' | 'done';
  notes?: string;
}

interface Lead {
  id: string;
  name: string;
  business: string;
  status: 'cold' | 'warm' | 'hot';
  lastContact?: string;
}

type BusinessType = 'MyTruckManager' | '615Data' | 'YTruck' | 'All';
type TabType = 'console' | 'leads' | 'analytics';

export default function Index() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Gmail Integration Setup', business: 'MyTruckManager', status: 'in_progress' },
    { id: '2', title: 'Review Notion Database', business: '615Data', status: 'backlog' },
    { id: '3', title: 'Follow up: Fleet Manager', business: 'YTruck', status: 'in_progress' },
  ]);

  const [leads, setLeads] = useState<Lead[]>([
    { id: '1', name: 'ABC Trucking', business: 'MyTruckManager', status: 'hot', lastContact: '2 days ago' },
    { id: '2', name: 'XYZ Logistics', business: '615Data', status: 'warm', lastContact: '1 week ago' },
  ]);

  const [selectedBusiness, setSelectedBusiness] = useState<BusinessType>('All');
  const [activeTab, setActiveTab] = useState<TabType>('console');
  const [expandedSections, setExpandedSections] = useState({
    backlog: true,
    in_progress: true,
    done: false,
  });
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', business: 'MyTruckManager', notes: '' });
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [commandInput, setCommandInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('alyssa-tasks');
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('alyssa-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const businesses: BusinessType[] = ['All', 'MyTruckManager', '615Data', 'YTruck'];

  const filteredTasks = selectedBusiness === 'All'
    ? tasks
    : tasks.filter((t) => t.business === selectedBusiness);

  const filteredLeads = selectedBusiness === 'All'
    ? leads
    : leads.filter((l) => l.business === selectedBusiness);

  const tasksByStatus = {
    backlog: filteredTasks.filter((t) => t.status === 'backlog'),
    in_progress: filteredTasks.filter((t) => t.status === 'in_progress'),
    done: filteredTasks.filter((t) => t.status === 'done'),
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const addTask = () => {
    if (!newTask.title.trim()) return;
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      business: newTask.business,
      status: 'backlog',
      notes: newTask.notes,
    };
    setTasks((prev) => [...prev, task]);
    setNewTask({ title: '', business: 'MyTruckManager', notes: '' });
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

  const sendCommand = () => {
    if (!commandInput.trim()) return;
    setCommandHistory((prev) => [...prev, `> ${commandInput}`]);
    setCommandInput('');
  };

  const statusConfig = {
    backlog: { label: 'Backlog', color: 'bg-gray-500', textColor: 'text-gray-400' },
    in_progress: { label: 'In Progress', color: 'bg-accent-primary', textColor: 'text-accent-primary' },
    done: { label: 'Done', color: 'bg-accent-success', textColor: 'text-accent-success' },
  };

  const leadStatusColors = {
    cold: 'bg-gray-500',
    warm: 'bg-yellow-500',
    hot: 'bg-red-500',
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-bg-surface/95 backdrop-blur border-b border-white/[0.06]">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-semibold">Alyssa Command Center</h1>
              <p className="text-sm text-text-secondary">AI Operations Dashboard</p>
            </div>
            <button
              onClick={() => setShowAddTask(true)}
              className="p-2.5 bg-accent-primary rounded-xl hover:bg-accent-primary/90 transition min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="grid grid-cols-3 gap-2 bg-bg-elevated rounded-xl p-1">
            <button
              onClick={() => setActiveTab('console')}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition ${
                activeTab === 'console'
                  ? 'bg-accent-primary text-white'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span className="hidden sm:inline">Console</span>
            </button>
            <button
              onClick={() => setActiveTab('leads')}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition ${
                activeTab === 'leads'
                  ? 'bg-accent-primary text-white'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Leads</span>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition ${
                activeTab === 'analytics'
                  ? 'bg-accent-primary text-white'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </button>
          </div>
        </div>

        {/* Business Filter */}
        <div className="px-4 pb-3 overflow-x-auto hide-scrollbar">
          <div className="flex gap-2 min-w-max">
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
      <main className="px-4 py-6 space-y-6 pb-24 max-w-3xl mx-auto">
        {/* Console Tab */}
        {activeTab === 'console' && (
          <>
            {/* Command Console */}
            <div className="bg-bg-surface rounded-2xl p-4 shadow-lg">
              <h2 className="text-sm font-semibold mb-3 text-text-secondary">Command Console</h2>
              <div className="bg-bg-elevated rounded-xl p-3 mb-3 min-h-[100px] max-h-[200px] overflow-y-auto font-mono text-sm">
                {commandHistory.length === 0 ? (
                  <p className="text-text-secondary">Send commands to Alyssa...</p>
                ) : (
                  commandHistory.map((cmd, i) => (
                    <div key={i} className="text-accent-success mb-1">
                      {cmd}
                    </div>
                  ))
                )}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={commandInput}
                  onChange={(e) => setCommandInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendCommand()}
                  placeholder="Type a command..."
                  className="flex-1 px-4 py-2.5 bg-bg-elevated rounded-xl text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                />
                <button
                  onClick={sendCommand}
                  className="px-4 py-2.5 bg-accent-primary rounded-xl hover:bg-accent-primary/90 transition"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Tasks */}
            <div className="space-y-6">
              {(['backlog', 'in_progress', 'done'] as const).map((status) => {
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
                          <div className="p-6 text-center text-text-secondary text-sm">No tasks</div>
                        ) : (
                          sectionTasks.map((task) => (
                            <button
                              key={task.id}
                              onClick={() => setSelectedTask(task)}
                              className="w-full bg-bg-surface rounded-2xl p-4 text-left shadow-lg hover:bg-bg-elevated transition relative overflow-hidden min-h-[60px]"
                            >
                              <div className={`absolute left-0 top-0 bottom-0 w-1 ${config.color}`} />
                              <div className="pl-3">
                                <div className="font-semibold mb-2">{task.title}</div>
                                <div className="flex items-center gap-2">
                                  <span className="px-2.5 py-1 bg-bg-elevated rounded-lg text-xs font-medium text-text-secondary">
                                    {task.business}
                                  </span>
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
            </div>
          </>
        )}

        {/* Leads Tab */}
        {activeTab === 'leads' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Leads Management</h2>
            {filteredLeads.map((lead) => (
              <div
                key={lead.id}
                className="bg-bg-surface rounded-2xl p-4 shadow-lg relative overflow-hidden"
              >
                <div className={`absolute top-4 right-4 w-3 h-3 rounded-full ${leadStatusColors[lead.status]}`} />
                <div className="font-semibold mb-2">{lead.name}</div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="px-2.5 py-1 bg-bg-elevated rounded-lg text-xs font-medium text-text-secondary">
                    {lead.business}
                  </span>
                  {lead.lastContact && (
                    <span className="text-text-secondary text-xs">Last: {lead.lastContact}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Analytics</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-bg-surface rounded-2xl p-4 shadow-lg">
                <div className="text-3xl font-bold text-accent-primary">{tasks.length}</div>
                <div className="text-sm text-text-secondary">Total Tasks</div>
              </div>
              <div className="bg-bg-surface rounded-2xl p-4 shadow-lg">
                <div className="text-3xl font-bold text-accent-success">{tasksByStatus.done.length}</div>
                <div className="text-sm text-text-secondary">Completed</div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-bg-surface rounded-3xl w-full max-w-md shadow-2xl">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">New Task</h3>
              <input
                type="text"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="Task title"
                className="w-full px-4 py-3 bg-bg-elevated rounded-xl text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary mb-3"
              />
              <select
                value={newTask.business}
                onChange={(e) => setNewTask({ ...newTask, business: e.target.value })}
                className="w-full px-4 py-3 bg-bg-elevated rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary mb-3"
              >
                <option value="MyTruckManager">MyTruckManager</option>
                <option value="615Data">615Data</option>
                <option value="YTruck">YTruck</option>
              </select>
              <textarea
                value={newTask.notes}
                onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
                placeholder="Notes (optional)"
                className="w-full px-4 py-3 bg-bg-elevated rounded-xl text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary mb-4 resize-none h-20"
              />
              <div className="flex gap-3">
                <button
                  onClick={addTask}
                  className="flex-1 px-4 py-3 bg-accent-primary text-white font-semibold rounded-xl hover:bg-accent-primary/90 transition"
                >
                  Create
                </button>
                <button
                  onClick={() => setShowAddTask(false)}
                  className="flex-1 px-4 py-3 bg-bg-elevated text-text-primary font-semibold rounded-xl hover:bg-bg-elevated/80 transition"
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
              <h3 className="text-xl font-semibold mb-2">{selectedTask.title}</h3>
              <div className="flex items-center gap-2 mb-6">
                <span className="px-3 py-1.5 bg-bg-elevated rounded-lg text-sm font-medium text-text-secondary">
                  {selectedTask.business}
                </span>
                <span
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                    statusConfig[selectedTask.status].textColor
                  } ${statusConfig[selectedTask.status].color}/10`}
                >
                  {statusConfig[selectedTask.status].label}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-sm text-text-secondary mb-2">Move to:</p>
                {(['backlog', 'in_progress', 'done'] as const)
                  .filter((s) => s !== selectedTask.status)
                  .map((status) => (
                    <button
                      key={status}
                      onClick={() => updateTaskStatus(selectedTask.id, status)}
                      className="w-full px-4 py-3 bg-bg-elevated text-text-primary font-medium rounded-xl hover:bg-bg-elevated/80 transition text-left"
                    >
                      {statusConfig[status].label}
                    </button>
                  ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => deleteTask(selectedTask.id)}
                  className="flex-1 px-4 py-3 bg-red-500/10 text-red-400 font-semibold rounded-xl hover:bg-red-500/20 transition"
                >
                  Delete
                </button>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="flex-1 px-4 py-3 bg-bg-elevated text-text-primary font-semibold rounded-xl hover:bg-bg-elevated/80 transition"
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
