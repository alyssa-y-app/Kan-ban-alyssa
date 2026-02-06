'use client';

import { Task, TaskStatus } from '@/lib/types';
import { Button } from '../ui/button';
import { X } from 'lucide-react';

interface TaskDetailSheetProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
}

export function TaskDetailSheet({ task, open, onOpenChange, onUpdate, onDelete }: TaskDetailSheetProps) {
  if (!task || !open) return null;

  const statuses: { key: TaskStatus; label: string }[] = [
    { key: 'backlog', label: 'Backlog' },
    { key: 'active', label: 'Active' },
    { key: 'waiting', label: 'Waiting' },
    { key: 'approval', label: 'Approval' },
    { key: 'done', label: 'Done' },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-card rounded-3xl w-full max-w-md shadow-2xl">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-xl font-semibold pr-8">{task.title}</h3>
            <button
              onClick={() => onOpenChange(false)}
              className="p-1 hover:bg-accent rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-2 mb-6">
            <span className="px-3 py-1.5 bg-muted rounded-lg text-sm font-medium">
              {task.business}
            </span>
            <span className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm font-medium">
              {statuses.find(s => s.key === task.status)?.label}
            </span>
          </div>

          {task.notes && (
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">{task.notes}</p>
            </div>
          )}

          <div className="space-y-2 mb-4">
            <p className="text-sm text-muted-foreground mb-2">Move to:</p>
            {statuses
              .filter((s) => s.key !== task.status)
              .map((status) => (
                <Button
                  key={status.key}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => {
                    onUpdate(task.id, { status: status.key });
                    onOpenChange(false);
                  }}
                >
                  {status.label}
                </Button>
              ))}
          </div>

          <div className="flex gap-3">
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => {
                onDelete(task.id);
                onOpenChange(false);
              }}
            >
              Delete
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
