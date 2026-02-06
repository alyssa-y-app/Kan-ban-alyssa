'use client';

import { Task, TaskStatus } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface KanbanBoardProps {
  tasksByStatus: Record<TaskStatus, Task[]>;
  onCardClick: (task: Task) => void;
}

export function KanbanBoard({ tasksByStatus, onCardClick }: KanbanBoardProps) {
  const [activeStatus, setActiveStatus] = useState<TaskStatus>('active');

  const columns: { key: TaskStatus; label: string; color: string; dotColor: string }[] = [
    { key: 'backlog', label: 'Backlog', color: 'text-muted-foreground', dotColor: 'bg-gray-500' },
    { key: 'active', label: 'Active', color: 'text-foreground', dotColor: 'bg-blue-500' },
    { key: 'waiting', label: 'Waiting', color: 'text-foreground', dotColor: 'bg-yellow-500' },
    { key: 'approval', label: 'Approval', color: 'text-foreground', dotColor: 'bg-purple-500' },
    { key: 'done', label: 'Done', color: 'text-foreground', dotColor: 'bg-green-500' },
  ];

  const activeColumn = columns.find(c => c.key === activeStatus)!;
  const tasks = tasksByStatus[activeStatus] || [];

  return (
    <div className="flex flex-col h-full">
      {/* Status Filter Tabs */}
      <div className="px-4 mb-4">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar bg-card rounded-xl p-1">
          {columns.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveStatus(key)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap',
                activeStatus === key
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Single Column View */}
      <div className="flex-1 overflow-y-auto px-4">
        <div className="mb-3 flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${activeColumn.dotColor}`} />
          <h3 className="font-semibold text-sm">{activeColumn.label}</h3>
          <span className="ml-auto text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>

        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No tasks</p>
          </div>
        ) : (
          <div className="space-y-2 pb-4">
            {tasks.map((task) => (
              <button
                key={task.id}
                onClick={() => onCardClick(task)}
                className="w-full bg-card rounded-xl p-4 text-left hover:bg-accent transition shadow-sm border border-border"
              >
                <div className="font-medium text-sm mb-2">{task.title}</div>
                {task.business && (
                  <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-lg inline-block">
                    {task.business}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
