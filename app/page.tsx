'use client';

import { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { BottomNav, TabKey } from '@/components/navigation/BottomNav';
import { KanbanBoard } from '@/components/kanban/KanbanBoard';
import { AttentionInbox } from '@/components/kanban/AttentionInbox';
import { TaskDetailSheet } from '@/components/kanban/TaskDetailSheet';
import { CreateTaskSheet } from '@/components/kanban/CreateTaskSheet';
import { PromptView } from '@/components/PromptView';
import { LeadsView } from '@/components/LeadsView';
import { KnowledgeView } from '@/components/KnowledgeView';
import { RecurringTasksView } from '@/components/RecurringTasksView';
import { Button } from '@/components/ui/button';
import { Task, TaskStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

type CommandSubView = 'prompt' | 'board' | 'attention' | 'messages';

export default function Index() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Gmail Integration Setup', business: 'MyTruckManager', status: 'active' },
    { id: '2', title: 'Review Notion Database', business: '615Data', status: 'backlog' },
    { id: '3', title: 'Follow up: Fleet Manager', business: 'YTruck', status: 'waiting', needsAttention: true },
    { id: '4', title: 'Demo Request', business: '615Data', status: 'approval', needsAttention: true },
    { id: '5', title: 'Setup completed', business: 'MyTruckManager', status: 'done' },
  ]);

  const [selectedBusiness, setSelectedBusiness] = useState('General');
  const [activeTab, setActiveTab] = useState<TabKey>('command');
  const [commandSubView, setCommandSubView] = useState<CommandSubView>('prompt');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('acc-tasks');
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load tasks');
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('acc-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const tasksByStatus: Record<TaskStatus, Task[]> = {
    backlog: tasks.filter((t) => t.status === 'backlog'),
    active: tasks.filter((t) => t.status === 'active'),
    waiting: tasks.filter((t) => t.status === 'waiting'),
    approval: tasks.filter((t) => t.status === 'approval'),
    done: tasks.filter((t) => t.status === 'done'),
  };

  const attentionTasks = tasks.filter((t) => t.needsAttention);

  const handleCardClick = (task: Task) => {
    setSelectedTask(task);
    setDetailOpen(true);
  };

  const handleUpdateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    if (selectedTask?.id === id) {
      setSelectedTask((prev) => (prev ? { ...prev, ...updates } : null));
    }
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setDetailOpen(false);
  };

  const handleAddTask = (data: { title: string; business: string; notes?: string }) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: data.title,
      business: data.business,
      status: 'backlog',
      notes: data.notes,
      createdAt: Date.now(),
    };
    setTasks((prev) => [...prev, newTask]);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b">
        <div className="flex items-center justify-between px-4 h-14">
          <h1 className="font-bold text-lg text-primary animate-pulse-glow drop-shadow-[0_0_8px_hsl(var(--primary)/0.4)]">
            A.C.C
          </h1>
          <div className="flex items-center gap-1">
            {activeTab === 'command' && (
              <CreateTaskSheet defaultBusiness={selectedBusiness} onAdd={handleAddTask} />
            )}
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Command Sub-Navigation */}
        {activeTab === 'command' && (
          <div className="flex px-4 pb-2 gap-1">
            {([
              { key: 'prompt' as const, label: 'Prompt' },
              { key: 'board' as const, label: 'Operations' },
              { key: 'attention' as const, label: 'Attention', count: attentionTasks.length },
              { key: 'messages' as const, label: 'Messages' },
            ]).map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setCommandSubView(key)}
                className={cn(
                  'flex-1 py-2 text-xs font-medium rounded-lg transition-all relative',
                  commandSubView === key
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground'
                )}
              >
                {label}
                {count !== undefined && count > 0 && (
                  <span className="absolute -top-1 -right-0 bg-destructive text-destructive-foreground text-[9px] font-bold rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center">
                    {count}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden pb-20">
        {activeTab === 'command' && (
          <>
            {commandSubView === 'prompt' && (
              <div className="h-full">
                <PromptView
                  selectedBusiness={selectedBusiness}
                  onBusinessChange={setSelectedBusiness}
                />
              </div>
            )}
            {commandSubView === 'board' && (
              <div className="h-full pt-3">
                <KanbanBoard tasksByStatus={tasksByStatus} onCardClick={handleCardClick} />
              </div>
            )}
            {commandSubView === 'attention' && (
              <div className="h-full overflow-y-auto pt-3">
                <AttentionInbox tasks={attentionTasks} onCardClick={handleCardClick} />
              </div>
            )}
            {commandSubView === 'messages' && (
              <div className="h-full">
                <LeadsView />
              </div>
            )}
          </>
        )}

        {activeTab === 'profile' && (
          <div className="h-full overflow-y-auto flex items-center justify-center px-4">
            <div className="text-center">
              <div className="text-6xl mb-4">👤</div>
              <h2 className="text-xl font-bold mb-2">Profile</h2>
              <p className="text-muted-foreground">Coming soon</p>
            </div>
          </div>
        )}

        {activeTab === 'knowledge' && (
          <div className="h-full">
            <KnowledgeView />
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="h-full">
            <RecurringTasksView />
          </div>
        )}
      </main>

      {/* Task Detail Sheet */}
      <TaskDetailSheet
        task={selectedTask}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onUpdate={handleUpdateTask}
        onDelete={handleDeleteTask}
      />

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onChange={setActiveTab} />
    </div>
  );
}
