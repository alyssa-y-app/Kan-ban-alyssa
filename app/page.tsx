'use client';

import { useState, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Task {
  id: string;
  content: string;
  business?: string;
  eta?: string;
}

interface KanbanData {
  [key: string]: Task[];
}

function SortableCard({ task }: { task: Task }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm hover:shadow-md transition cursor-grab active:cursor-grabbing dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="font-medium text-sm">{task.content}</div>
      {task.business && (
        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          {task.business}
        </div>
      )}
      {task.eta && (
        <div className="mt-1 text-xs text-slate-400 dark:text-slate-500">
          ETA: {task.eta}
        </div>
      )}
    </div>
  );
}

function Column({ 
  id, 
  title, 
  tasks 
}: { 
  id: string; 
  title: string; 
  tasks: Task[];
}) {
  return (
    <section className="w-[320px] shrink-0">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-bold">{title}</h2>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
          {tasks.length}
        </span>
      </div>
      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3 rounded-2xl border-2 border-slate-200 bg-slate-50/50 p-4 min-h-[400px] dark:border-slate-800 dark:bg-slate-900/30">
          {tasks.map((task) => (
            <SortableCard key={task.id} task={task} />
          ))}
        </div>
      </SortableContext>
    </section>
  );
}

export default function Home() {
  const [data, setData] = useState<KanbanData>({
    'Backlog': [
      { id: '1', content: 'Connect Gmail integration', business: 'All businesses' },
      { id: '2', content: 'Review Notion setup', business: 'MyTruckManager' },
    ],
    'In Progress': [
      { id: '3', content: 'Build Kanban board', business: 'Internal', eta: 'Today' },
    ],
    'Leads': [
      { id: '4', content: 'Follow up with prospect', business: 'Ytruck.app' },
    ],
    'Done': [
      { id: '5', content: 'Telegram integration', business: 'All businesses' },
    ],
  });

  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('kanban-data');
    if (saved) {
      setData(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('kanban-data', JSON.stringify(data));
  }, [data]);

  const findContainer = (id: string) => {
    if (id in data) {
      return id;
    }
    return Object.keys(data).find((key) =>
      data[key].some((item) => item.id === id)
    );
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeContainer = findContainer(active.id as string);
    const overContainer = findContainer(over.id as string) || (over.id as string);

    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      return;
    }

    setData((prev) => {
      const activeItems = prev[activeContainer];
      const overItems = prev[overContainer];

      const activeIndex = activeItems.findIndex((i) => i.id === active.id);
      const overIndex = overItems.findIndex((i) => i.id === over.id);

      let newIndex: number;
      if (over.id in prev) {
        newIndex = overItems.length;
      } else {
        newIndex = overIndex >= 0 ? overIndex : overItems.length;
      }

      return {
        ...prev,
        [activeContainer]: activeItems.filter((item) => item.id !== active.id),
        [overContainer]: [
          ...overItems.slice(0, newIndex),
          activeItems[activeIndex],
          ...overItems.slice(newIndex),
        ],
      };
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeContainer = findContainer(active.id as string);
    const overContainer = findContainer(over.id as string);

    if (!activeContainer || !overContainer) {
      return;
    }

    if (activeContainer === overContainer) {
      const activeIndex = data[activeContainer].findIndex((i) => i.id === active.id);
      const overIndex = data[overContainer].findIndex((i) => i.id === over.id);

      if (activeIndex !== overIndex) {
        setData((prev) => ({
          ...prev,
          [overContainer]: arrayMove(prev[overContainer], activeIndex, overIndex),
        }));
      }
    }

    setActiveId(null);
  };

  const activeTask = activeId
    ? Object.values(data).flat().find((task) => task.id === activeId)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Alyssa's Workspace
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            MyTruckManager • 615data • Ytruck.app
          </p>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-6 min-w-max">
              {Object.keys(data).map((columnId) => (
                <Column
                  key={columnId}
                  id={columnId}
                  title={columnId}
                  tasks={data[columnId]}
                />
              ))}
            </div>
          </div>

          <DragOverlay>
            {activeTask ? (
              <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-lg rotate-3 dark:border-slate-800 dark:bg-slate-900">
                <div className="font-medium text-sm">{activeTask.content}</div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
