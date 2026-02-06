export type BusinessType = 'MyTruckManager' | '615Data' | 'YTruck' | 'General';
export type TaskStatus = 'backlog' | 'active' | 'waiting' | 'approval' | 'done';

export interface Task {
  id: string;
  title: string;
  business: string;
  status: TaskStatus;
  notes?: string;
  needsAttention?: boolean;
  createdAt?: number;
}
