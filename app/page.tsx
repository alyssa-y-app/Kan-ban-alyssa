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
  priority?: 'high' | 'medium' | 'low';
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

  const priorityColors = {
    high: 'bg-red-500',
    medium: 'bg-yellow-500',
    low: 'bg-green-500',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="group relative rounded-xl bg-zinc-900 border border-zinc-800 p-4 shadow-lg hover:shadow-xl hover:border-zinc-700 transition-all cursor-grab active:cursor-grabbing"
    >
      {task.priority && (
        <div className={`absolute top-3 right-3 w-2 h-2 rounded-full ${priorityColors[task.priority]}`} />
      )}
      <div className="font-medium text-white mb-2">{task.content}</div>
      <div className="flex items-center gap-3 mt-3">
        {task.business && (
          <span className="px-2.5 py-1 bg-zinc-800 text-zinc-300 text-xs rounded-full">
            {task.business}
          </span>
        )}
        {task.eta && (
          <span className="text-xs text-zinc-500">
            ⏱ {task.eta}
          </span>
        )}
      </div>
    </div>
  );
}

function Column({ 
  id, 
  title, 
  tasks,
  color 
}: { 
  id: string; 
  title: string; 
  tasks: Task[];
  color: string;
}) {
  return (
    <section className="w-[340px] shrink-0">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-1 h-8 rounded-full ${color}`} />
          <h2 className="text-lg font-bold text-white">{title}</h2>
        </div>
        <span className="rounded-full bg-zinc-800 px-3 py-1.5 text-sm font-semibold text-zinc-300">
          {tasks.length}
        </span>
      </div>
      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3 rounded-2xl bg-zinc-950/50 border border-zinc-800/50 p-4 min-h-[500px] backdrop-blur">
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
      { id: '1', content: 'Gmail Integration Setup', business: 'All', priority: 'high' },
      { id: '2', content: 'Review Notion Database', business: 'MyTruckManager', priority: 'medium' },
    ],
    'In Progress': [
      { id: '3', content: 'Kanban Board Development', business: 'Internal', eta: 'Today', priority: 'high' },
    ],
    'Leads': [
      { id: '4', content: 'Follow up: Fleet Manager', business: 'Ytruck', priority: 'medium' },
      { id: '5', content: 'Demo Request: 615data', business: '615data', priority: 'high' },
    ],
    'Done': [
      { id: '6', content: 'Telegram Bot Connected', business: 'All' },
    ],
  });

  const [activeId, setActiveId] = useState<string | null>(null);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskContent, setNewTaskContent] = useState('');
  const [selectedColumn, setSelectedColumn] = useState('Backlog');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const saved = localStorage.getItem('kanban-data');
    if (saved) {
      setData(JSON.parse(saved));
    }
  }, []);

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

  const handleAddTask = () => {
    if (!newTaskContent.trim()) return;
    
    const newTask: Task = {
      id: Date.now().toString(),
      content: newTaskContent,
      priority: 'medium',
    };

    setData((prev) => ({
      ...prev,
      [selectedColumn]: [...prev[selectedColumn], newTask],
    }));

    setNewTaskContent('');
    setShowAddTask(false);
  };

  const activeTask = activeId
    ? Object.values(data).flat().find((task) => task.id === activeId)
    : null;

  const columnColors = {
    'Backlog': 'bg-blue-500',
    'In Progress': 'bg-yellow-500',
    'Leads': 'bg-purple-500',
    'Done': 'bg-green-500',
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="border-b border-zinc-800 bg-zinc-950">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Alyssa Command Center
              </h1>
              <div className="flex gap-3">
                <span className="px-3 py-1 bg-zinc-900 text-zinc-400 text-sm rounded-full border border-zinc-800">
                  MyTruckManager
                </span>
                <span className="px-3 py-1 bg-zinc-900 text-zinc-400 text-sm rounded-full border border-zinc-800">
                  615data
                </span>
                <span className="px-3 py-1 bg-zinc-900 text-zinc-400 text-sm rounded-full border border-zinc-800">
                  Ytruck.app
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowAddTask(!showAddTask)}
              className="px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition"
            >
              + Add Task
            </button>
          </div>
        </div>
      </div>

      {showAddTask && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-[500px]">
            <h3 className="text-xl font-bold text-white mb-4">Create New Task</h3>
            <input
              type="text"
              value={newTaskContent}
              onChange={(e) => setNewTaskContent(e.target.value)}
              placeholder="Task description..."
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-700 mb-4"
            />
            <select
              value={selectedColumn}
              onChange={(e) => setSelectedColumn(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:outline-none focus:border-zinc-700 mb-4"
            >
              {Object.keys(data).map((col) => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>
            <div className="flex gap-3">
              <button
                onClick={handleAddTask}
                className="flex-1 px-4 py-3 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition"
              >
                Create
              </button>
              <button
                onClick={() => setShowAddTask(false)}
                className="flex-1 px-4 py-3 bg-zinc-800 text-white font-semibold rounded-xl hover:bg-zinc-700 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-6 py-8">
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
                  color={columnColors[columnId as keyof typeof columnColors]}
                />
              ))}
            </div>
          </div>

          <DragOverlay>
            {activeTask ? (
              <div className="rounded-xl bg-zinc-900 border border-zinc-700 p-4 shadow-2xl rotate-6">
                <div className="font-medium text-white">{activeTask.content}</div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
