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
import { 
  Plus, 
  Clock, 
  CheckCircle2, 
  Truck, 
  Database, 
  Users,
  X,
  Grid3x3,
  LayoutGrid,
  AlertCircle,
  Zap
} from 'lucide-react';

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

function SortableCard({ task, onDelete }: { task: Task; onDelete: (id: string) => void }) {
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

  const priorityConfig = {
    high: { color: 'bg-ytruck-red', icon: AlertCircle },
    medium: { color: 'bg-ytruck-orange', icon: Clock },
    low: { color: 'bg-green-500', icon: CheckCircle2 },
  };

  const businessIcons = {
    'MyTruckManager': Truck,
    '615data': Database,
    'Ytruck': Zap,
  };

  const config = task.priority ? priorityConfig[task.priority] : null;
  const BusinessIcon = task.business ? businessIcons[task.business as keyof typeof businessIcons] : null;
  const PriorityIcon = config?.icon;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="group relative rounded-xl bg-ytruck-gray border border-ytruck-gray-light p-4 shadow-lg hover:shadow-xl hover:border-ytruck-coral/50 transition-all cursor-grab active:cursor-grabbing"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <p className="font-medium text-white leading-snug">{task.content}</p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-ytruck-red/20 rounded-lg"
        >
          <X className="w-4 h-4 text-ytruck-red" />
        </button>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {task.business && BusinessIcon && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-ytruck-dark rounded-lg">
            <BusinessIcon className="w-3.5 h-3.5 text-ytruck-coral" />
            <span className="text-xs font-medium text-gray-300">{task.business}</span>
          </div>
        )}
        {task.eta && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-ytruck-orange/20 rounded-lg">
            <Clock className="w-3.5 h-3.5 text-ytruck-orange" />
            <span className="text-xs font-medium text-ytruck-orange">{task.eta}</span>
          </div>
        )}
        {config && PriorityIcon && (
          <div className="flex items-center gap-1 px-2.5 py-1 bg-ytruck-dark rounded-lg">
            <PriorityIcon className="w-3.5 h-3.5 text-white" />
            <div className={`w-2 h-2 rounded-full ${config.color}`} />
          </div>
        )}
      </div>
    </div>
  );
}

function Column({ 
  id, 
  title, 
  tasks,
  icon: Icon,
  color,
  onDeleteTask
}: { 
  id: string; 
  title: string; 
  tasks: Task[];
  icon: any;
  color: string;
  onDeleteTask: (id: string) => void;
}) {
  return (
    <section className="w-full lg:w-[340px] shrink-0">
      <div className="mb-4">
        <div className="inline-flex items-center gap-3 px-4 py-2.5 bg-ytruck-gray rounded-xl border border-ytruck-gray-light">
          <div className={`p-1.5 rounded-lg ${color}`}>
            <Icon className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-base font-bold text-white">{title}</h2>
          <span className="ml-auto px-2.5 py-0.5 bg-ytruck-dark rounded-full text-sm font-bold text-ytruck-coral">
            {tasks.length}
          </span>
        </div>
      </div>
      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3 rounded-xl bg-ytruck-darker/50 border border-ytruck-gray p-4 min-h-[300px] lg:min-h-[500px]">
          {tasks.map((task) => (
            <SortableCard key={task.id} task={task} onDelete={onDeleteTask} />
          ))}
        </div>
      </SortableContext>
    </section>
  );
}

export default function Home() {
  const [data, setData] = useState<KanbanData>({
    'Backlog': [
      { id: '1', content: 'Gmail Integration Setup', business: 'MyTruckManager', priority: 'high' },
      { id: '2', content: 'Review Notion Database', business: '615data', priority: 'medium' },
    ],
    'In Progress': [
      { id: '3', content: 'Kanban Board Development', business: 'Ytruck', eta: 'Today', priority: 'high' },
    ],
    'Leads': [
      { id: '4', content: 'Follow up: Fleet Manager', business: 'Ytruck', priority: 'medium' },
      { id: '5', content: 'Demo Request from Texas', business: '615data', priority: 'high' },
    ],
    'Done': [
      { id: '6', content: 'Telegram Bot Connected', business: 'MyTruckManager' },
    ],
  });

  const [activeId, setActiveId] = useState<string | null>(null);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskContent, setNewTaskContent] = useState('');
  const [selectedColumn, setSelectedColumn] = useState('Backlog');
  const [selectedBusiness, setSelectedBusiness] = useState('MyTruckManager');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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
    if (id in data) return id;
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

    if (!activeContainer || !overContainer || activeContainer === overContainer) return;

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

    if (!activeContainer || !overContainer) return;

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
      business: selectedBusiness,
      priority: 'medium',
    };

    setData((prev) => ({
      ...prev,
      [selectedColumn]: [...prev[selectedColumn], newTask],
    }));

    setNewTaskContent('');
    setShowAddTask(false);
  };

  const handleDeleteTask = (taskId: string) => {
    setData((prev) => {
      const newData = { ...prev };
      Object.keys(newData).forEach((col) => {
        newData[col] = newData[col].filter((task) => task.id !== taskId);
      });
      return newData;
    });
  };

  const activeTask = activeId
    ? Object.values(data).flat().find((task) => task.id === activeId)
    : null;

  const columnConfig = {
    'Backlog': { icon: Grid3x3, color: 'bg-ytruck-coral' },
    'In Progress': { icon: Clock, color: 'bg-ytruck-orange' },
    'Leads': { icon: Users, color: 'bg-ytruck-red' },
    'Done': { icon: CheckCircle2, color: 'bg-green-500' },
  };

  return (
    <div className="min-h-screen bg-ytruck-darker">
      <div className="border-b border-ytruck-gray bg-ytruck-dark">
        <div className="container mx-auto px-4 lg:px-6 py-4 lg:py-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white mb-3">
                Command Center
              </h1>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-ytruck-gray text-gray-300 text-xs rounded-lg border border-ytruck-gray-light">
                  <Truck className="w-3 h-3 text-ytruck-coral" />
                  MyTruckManager
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-ytruck-gray text-gray-300 text-xs rounded-lg border border-ytruck-gray-light">
                  <Database className="w-3 h-3 text-ytruck-coral" />
                  615data
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-ytruck-gray text-gray-300 text-xs rounded-lg border border-ytruck-gray-light">
                  <Zap className="w-3 h-3 text-ytruck-coral" />
                  Ytruck.app
                </span>
              </div>
            </div>
            <div className="flex gap-2 w-full lg:w-auto">
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="flex-1 lg:flex-none px-4 py-2.5 bg-ytruck-gray text-gray-300 font-semibold rounded-xl hover:bg-ytruck-gray-light transition border border-ytruck-gray-light flex items-center justify-center gap-2"
              >
                {viewMode === 'grid' ? <LayoutGrid className="w-4 h-4" /> : <Grid3x3 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setShowAddTask(!showAddTask)}
                className="flex-1 lg:flex-none px-4 py-2.5 bg-ytruck-red hover:bg-ytruck-coral text-white font-bold rounded-xl transition shadow-lg flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Task
              </button>
            </div>
          </div>
        </div>
      </div>

      {showAddTask && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur flex items-center justify-center z-50 p-4">
          <div className="bg-ytruck-gray border border-ytruck-gray-light rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-4">Create New Task</h3>
            <textarea
              value={newTaskContent}
              onChange={(e) => setNewTaskContent(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full px-4 py-3 bg-ytruck-dark border border-ytruck-gray-light rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-ytruck-coral mb-4 resize-none h-24"
            />
            <select
              value={selectedBusiness}
              onChange={(e) => setSelectedBusiness(e.target.value)}
              className="w-full px-4 py-3 bg-ytruck-dark border border-ytruck-gray-light rounded-xl text-white focus:outline-none focus:border-ytruck-coral mb-3"
            >
              <option value="MyTruckManager">MyTruckManager</option>
              <option value="615data">615data</option>
              <option value="Ytruck">Ytruck.app</option>
            </select>
            <select
              value={selectedColumn}
              onChange={(e) => setSelectedColumn(e.target.value)}
              className="w-full px-4 py-3 bg-ytruck-dark border border-ytruck-gray-light rounded-xl text-white focus:outline-none focus:border-ytruck-coral mb-4"
            >
              {Object.keys(data).map((col) => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>
            <div className="flex gap-3">
              <button
                onClick={handleAddTask}
                className="flex-1 px-4 py-3 bg-ytruck-red hover:bg-ytruck-coral text-white font-bold rounded-xl transition"
              >
                Create
              </button>
              <button
                onClick={() => setShowAddTask(false)}
                className="flex-1 px-4 py-3 bg-ytruck-dark hover:bg-ytruck-darker text-white font-semibold rounded-xl transition border border-ytruck-gray-light"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 lg:px-6 py-6 lg:py-8">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className={`${viewMode === 'grid' ? 'lg:overflow-x-auto' : ''} pb-4`}>
            <div className={`flex ${viewMode === 'grid' ? 'flex-col lg:flex-row' : 'flex-col'} gap-6 ${viewMode === 'grid' ? 'lg:min-w-max' : ''}`}>
              {Object.keys(data).map((columnId) => (
                <Column
                  key={columnId}
                  id={columnId}
                  title={columnId}
                  tasks={data[columnId]}
                  icon={columnConfig[columnId as keyof typeof columnConfig].icon}
                  color={columnConfig[columnId as keyof typeof columnConfig].color}
                  onDeleteTask={handleDeleteTask}
                />
              ))}
            </div>
          </div>

          <DragOverlay>
            {activeTask ? (
              <div className="rounded-xl bg-ytruck-gray border border-ytruck-coral p-4 shadow-2xl rotate-6">
                <div className="font-medium text-white">{activeTask.content}</div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
