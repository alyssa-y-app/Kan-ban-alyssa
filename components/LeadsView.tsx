'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Users, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Lead {
  id: string;
  name: string;
  business: string;
  status: 'cold' | 'warm' | 'hot';
  notes?: string;
}

export function LeadsView() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState('General');
  const [showAddLead, setShowAddLead] = useState(false);
  const [newLead, setNewLead] = useState({ name: '', business: 'General', notes: '' });

  const businesses = ['MyTruckManager', '615Data', 'YTruck.app', 'General'];

  const filteredLeads = selectedBusiness === 'General'
    ? leads
    : leads.filter(l => l.business === selectedBusiness);

  const handleAddLead = () => {
    if (!newLead.name.trim()) return;
    const lead: Lead = {
      id: Date.now().toString(),
      name: newLead.name,
      business: newLead.business,
      status: 'cold',
      notes: newLead.notes,
    };
    setLeads(prev => [...prev, lead]);
    setNewLead({ name: '', business: 'General', notes: '' });
    setShowAddLead(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            <h2 className="text-lg font-bold">Leads</h2>
          </div>
          <Button
            onClick={() => setShowAddLead(true)}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Lead
          </Button>
        </div>

        {/* Business Filter */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          {businesses.map((biz) => (
            <button
              key={biz}
              onClick={() => setSelectedBusiness(biz)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap',
                selectedBusiness === biz
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              )}
            >
              {biz}
            </button>
          ))}
        </div>
      </div>

      {/* Leads List */}
      <div className="flex-1 overflow-y-auto px-4">
        {filteredLeads.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Users className="w-16 h-16 text-muted-foreground mb-3" />
            <p className="text-lg font-medium text-muted-foreground">No leads yet</p>
          </div>
        ) : (
          <div className="space-y-3 pb-4">
            {filteredLeads.map(lead => (
              <div
                key={lead.id}
                className="bg-card rounded-xl p-4 shadow-sm border border-border"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold">{lead.name}</h3>
                  <div className={cn(
                    'w-2 h-2 rounded-full',
                    lead.status === 'hot' ? 'bg-red-500' :
                    lead.status === 'warm' ? 'bg-yellow-500' : 'bg-gray-500'
                  )} />
                </div>
                <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-lg inline-block">
                  {lead.business}
                </div>
                {lead.notes && (
                  <p className="text-sm text-muted-foreground mt-2">{lead.notes}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Lead Modal */}
      {showAddLead && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-card rounded-3xl w-full max-w-md shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">New Lead</h3>
                <button
                  onClick={() => setShowAddLead(false)}
                  className="p-1 hover:bg-accent rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <input
                type="text"
                value={newLead.name}
                onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                placeholder="Lead name"
                className="w-full px-4 py-3 bg-background rounded-xl focus:outline-none focus:ring-2 focus:ring-primary mb-3"
              />

              <select
                value={newLead.business}
                onChange={(e) => setNewLead({ ...newLead, business: e.target.value })}
                className="w-full px-4 py-3 bg-background rounded-xl focus:outline-none focus:ring-2 focus:ring-primary mb-3"
              >
                {businesses.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>

              <textarea
                value={newLead.notes}
                onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
                placeholder="Notes (optional)"
                className="w-full px-4 py-3 bg-background rounded-xl focus:outline-none focus:ring-2 focus:ring-primary mb-4 resize-none h-20"
              />

              <div className="flex gap-3">
                <Button className="flex-1" onClick={handleAddLead}>
                  Add Lead
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setShowAddLead(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
