'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { BookOpen, Plus, X } from 'lucide-react';

interface KnowledgePage {
  id: string;
  title: string;
  description: string;
  content?: string;
  createdAt: number;
}

export function KnowledgeView() {
  const [pages, setPages] = useState<KnowledgePage[]>([]);
  const [showAddPage, setShowAddPage] = useState(false);
  const [newPage, setNewPage] = useState({ title: '', description: '' });

  const handleAddPage = () => {
    if (!newPage.title.trim()) return;
    const page: KnowledgePage = {
      id: Date.now().toString(),
      title: newPage.title,
      description: newPage.description,
      createdAt: Date.now(),
    };
    setPages(prev => [...prev, page]);
    setNewPage({ title: '', description: '' });
    setShowAddPage(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h2 className="text-lg font-bold">Knowledge Base</h2>
            <p className="text-sm text-muted-foreground">Alyssa's source of truth</p>
          </div>
          <Button
            size="icon"
            onClick={() => setShowAddPage(true)}
            className="bg-primary hover:bg-primary/90 rounded-full h-12 w-12"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Pages List */}
      <div className="flex-1 overflow-y-auto px-4">
        {pages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <BookOpen className="w-16 h-16 text-muted-foreground mb-3" />
            <p className="text-lg font-medium text-muted-foreground mb-1">No knowledge pages</p>
            <p className="text-sm text-muted-foreground">Create your first page to build Alyssa's brain</p>
          </div>
        ) : (
          <div className="space-y-3 pb-4">
            {pages.map(page => (
              <div
                key={page.id}
                className="bg-card rounded-xl p-4 shadow-sm border border-border hover:bg-accent transition cursor-pointer"
              >
                <h3 className="font-semibold mb-1">{page.title}</h3>
                <p className="text-sm text-muted-foreground">{page.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Page Modal */}
      {showAddPage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-card rounded-3xl w-full max-w-md shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">New Knowledge Page</h3>
                <button
                  onClick={() => setShowAddPage(false)}
                  className="p-1 hover:bg-accent rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-3">
                <label className="text-sm text-muted-foreground mb-2 block">Title</label>
                <input
                  type="text"
                  value={newPage.title}
                  onChange={(e) => setNewPage({ ...newPage, title: e.target.value })}
                  placeholder="e.g. ETA Confirmation Procedure"
                  className="w-full px-4 py-3 bg-background rounded-xl focus:outline-none focus:ring-2 focus:ring-primary border border-primary"
                />
              </div>

              <div className="mb-4">
                <label className="text-sm text-muted-foreground mb-2 block">Description</label>
                <textarea
                  value={newPage.description}
                  onChange={(e) => setNewPage({ ...newPage, description: e.target.value })}
                  placeholder="Brief description..."
                  className="w-full px-4 py-3 bg-background rounded-xl focus:outline-none focus:ring-2 focus:ring-primary resize-none h-24"
                />
              </div>

              <Button 
                className="w-full bg-primary hover:bg-primary/90 h-12" 
                onClick={handleAddPage}
              >
                Create Page
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
