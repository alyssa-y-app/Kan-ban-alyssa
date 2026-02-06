'use client';

import { useState } from 'react';
import { BusinessType } from '@/lib/types';
import { Button } from '../ui/button';
import { Plus, X } from 'lucide-react';

interface CreateTaskSheetProps {
  defaultBusiness: string;
  onAdd: (data: { title: string; business: string; notes?: string }) => void;
}

export function CreateTaskSheet({ defaultBusiness, onAdd }: CreateTaskSheetProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [business, setBusiness] = useState(defaultBusiness);
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (!title.trim()) return;
    onAdd({ title, business, notes: notes || undefined });
    setTitle('');
    setNotes('');
    setOpen(false);
  };

  return (
    <>
      <Button size="icon" variant="ghost" onClick={() => setOpen(true)}>
        <Plus className="w-5 h-5" />
      </Button>

      {open && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-card rounded-3xl w-full max-w-md shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">New Task</h3>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1 hover:bg-accent rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Task title"
                className="w-full px-4 py-3 bg-background rounded-xl focus:outline-none focus:ring-2 focus:ring-primary mb-3"
              />

              <select
                value={business}
                onChange={(e) => setBusiness(e.target.value)}
                className="w-full px-4 py-3 bg-background rounded-xl focus:outline-none focus:ring-2 focus:ring-primary mb-3"
              >
                <option value="MyTruckManager">MyTruckManager</option>
                <option value="615Data">615Data</option>
                <option value="YTruck">YTruck</option>
                <option value="General">General</option>
              </select>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notes (optional)"
                className="w-full px-4 py-3 bg-background rounded-xl focus:outline-none focus:ring-2 focus:ring-primary mb-4 resize-none h-20"
              />

              <div className="flex gap-3">
                <Button className="flex-1" onClick={handleSubmit}>
                  Create
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
