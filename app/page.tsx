'use client';

import { useState } from 'react';

const initialData = {
  columns: {
    Backlog: ['Task A', 'Task B'],
    'In Progress': ['Task C'],
    Done: ['Task D']
  }
};

function Card({ content }: { content: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm hover:shadow-md transition dark:border-slate-800 dark:bg-slate-900">
      {content}
    </div>
  );
}

export default function Home() {
  const [data] = useState(initialData);

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="-mx-4 overflow-x-auto px-4 py-8">
        <div className="flex min-w-[900px] gap-4">
          {Object.keys(data.columns).map((column) => (
            <section key={column} className="w-[300px] shrink-0">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-sm font-semibold">{column}</h2>
                <span className="rounded-full border border-slate-200 px-2 py-0.5 text-xs text-slate-600 dark:border-slate-800 dark:text-slate-300">
                  {data.columns[column as keyof typeof data.columns].length}
                </span>
              </div>
              <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
                {data.columns[column as keyof typeof data.columns].map((card, index) => (
                  <Card key={index} content={card} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
