import { useState } from 'react';
import { Task, Priority } from '@/types/todo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, Link as LinkIcon, Save, X } from 'lucide-react';
import { format } from 'date-fns';

interface TaskFormProps {
  onSubmit: (task: Omit<Task, 'id' | 'isCompleted' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  initialData?: Partial<Task>;
}

export function TaskForm({ onSubmit, onCancel, initialData }: TaskFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [dueDate, setDueDate] = useState(
    initialData?.dueDate ? format(initialData.dueDate, 'yyyy-MM-dd') : ''
  );
  const [dueTime, setDueTime] = useState(
    initialData?.dueTime ? format(initialData.dueTime, 'HH:mm') : ''
  );
  const [priority, setPriority] = useState<Priority>(initialData?.priority || Priority.MEDIUM);
  const [link, setLink] = useState(initialData?.link || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const dueDateObj = dueDate ? new Date(dueDate) : undefined;
    const dueTimeObj = dueDate && dueTime ? new Date(`${dueDate}T${dueTime}`) : undefined;

    onSubmit({
      title: title.trim(),
      dueDate: dueDateObj,
      dueTime: dueTimeObj,
      priority,
      link: link.trim() || undefined
    });
  };

  const getPriorityLabel = (priority: Priority) => {
    switch (priority) {
      case Priority.LOW: return 'Low Priority';
      case Priority.MEDIUM: return 'Medium Priority';
      case Priority.HIGH: return 'High Priority';
      case Priority.URGENT: return 'Urgent';
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case Priority.LOW: return 'text-priority-low';
      case Priority.MEDIUM: return 'text-priority-medium';
      case Priority.HIGH: return 'text-priority-high';
      case Priority.URGENT: return 'text-priority-urgent';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Save className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">
          {initialData ? 'Edit Task' : 'Create New Task'}
        </h3>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="title" className="text-sm font-medium">
            Task Title *
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title..."
            className="mt-1"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="dueDate" className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Due Date
            </Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="dueTime" className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Due Time
            </Label>
            <Input
              id="dueTime"
              type="time"
              value={dueTime}
              onChange={(e) => setDueTime(e.target.value)}
              className="mt-1"
              disabled={!dueDate}
            />
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">Priority Level</Label>
          <Select value={priority} onValueChange={(value: Priority) => setPriority(value)}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(Priority).map((p) => (
                <SelectItem key={p} value={p} className={getPriorityColor(p)}>
                  <span className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full bg-current`} />
                    {getPriorityLabel(p)}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="link" className="text-sm font-medium flex items-center gap-2">
            <LinkIcon className="h-4 w-4" />
            Related Link (Optional)
          </Label>
          <Input
            id="link"
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://example.com"
            className="mt-1"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1">
          <Save className="h-4 w-4 mr-2" />
          {initialData ? 'Update Task' : 'Create Task'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
      </div>
    </form>
  );
}