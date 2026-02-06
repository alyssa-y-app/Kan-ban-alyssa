'use client';

import { Terminal, User, BookOpen, CheckSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

export type TabKey = 'command' | 'profile' | 'knowledge' | 'tasks';

interface BottomNavProps {
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
}

export function BottomNav({ activeTab, onChange }: BottomNavProps) {
  const tabs = [
    { key: 'command' as const, label: 'Command', icon: Terminal },
    { key: 'profile' as const, label: 'Profile', icon: User },
    { key: 'knowledge' as const, label: 'Knowledge', icon: BookOpen },
    { key: 'tasks' as const, label: 'Tasks', icon: CheckSquare },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40">
      <div className="grid grid-cols-4 h-16">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={cn(
              'flex flex-col items-center justify-center gap-1 transition-colors',
              activeTab === key ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
