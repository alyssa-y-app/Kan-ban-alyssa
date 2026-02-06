'use client';

import { Task } from '@/lib/types';
import { AlertCircle } from 'lucide-react';

interface AttentionInboxProps {
  tasks: Task[];
  onCardClick: (task: Task) => void;
}

export function AttentionInbox({ tasks, onCardClick }: AttentionInboxProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-4">
        <AlertCircle className="w-12 h-12 text-muted-foreground mb-3" />
        <p className="text-muted-foreground">No tasks need attention</p>
      </div>
    );
  }

  return (
    <div className="px-4 space-y-3">
      {tasks.map((task) => (
        <button
          key={task.id}
          onClick={() => onCardClick(task)}
          className="w-full bg-card rounded-xl p-4 text-left hover:bg-accent transition shadow-sm border-l-4 border-destructive"
        >
          <div className="font-semibold mb-2">{task.title}</div>
          {task.business && (
            <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-lg inline-block">
              {task.business}
            </div>
          )}
          {task.notes && (
            <p className="text-sm text-muted-foreground mt-2">{task.notes}</p>
          )}
        </button>
      ))}
    </div>
  );
}
