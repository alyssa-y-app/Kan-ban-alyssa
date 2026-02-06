'use client';

import { Task } from '@/lib/types';

interface KanbanBoardProps {
  tasksByStatus: {
    backlog: Task[];
    in_progress: Task[];
    done: Task[];
  };
  onCardClick: (task: Task) => void;
}

export function KanbanBoard({ tasksByStatus, onCardClick }: KanbanBoardProps) {
  const columns = [
    { key: 'backlog' as const, label: 'Backlog', color: 'bg-muted' },
    { key: 'in_progress' as const, label: 'In Progress', color: 'bg-primary' },
    { key: 'done' as const, label: 'Done', color: 'bg-green-500' },
  ];

  return (
    <div className="flex gap-3 overflow-x-auto px-4 pb-4 h-full hide-scrollbar">
      {columns.map(({ key, label, color }) => {
        const tasks = tasksByStatus[key];
        return (
          <div key={key} className="flex-shrink-0 w-72">
            <div className="mb-3 flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${color}`} />
              <h3 className="font-semibold text-sm">{label}</h3>
              <span className="ml-auto text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {tasks.length}
              </span>
            </div>
            <div className="space-y-2">
              {tasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => onCardClick(task)}
                  className="w-full bg-card rounded-xl p-3 text-left hover:bg-accent transition shadow-sm"
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
          </div>
        );
      })}
    </div>
  );
}
