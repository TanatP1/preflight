import { useState } from 'react';
import { Task, Priority } from '@/types/todo';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  ExternalLink, 
  Edit3, 
  Trash2, 
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { format, isAfter, isBefore, addDays, isToday } from 'date-fns';
import { cn } from '@/lib/utils';
import { TaskForm } from './TaskForm';

interface TaskItemProps {
  task: Task;
  onUpdate: (updates: Partial<Task>) => void;
  onDelete: () => void;
}

export function TaskItem({ task, onUpdate, onDelete }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case Priority.LOW: return 'bg-priority-low/10 text-priority-low border-priority-low/20';
      case Priority.MEDIUM: return 'bg-priority-medium/10 text-priority-medium border-priority-medium/20';
      case Priority.HIGH: return 'bg-priority-high/10 text-priority-high border-priority-high/20';
      case Priority.URGENT: return 'bg-priority-urgent/10 text-priority-urgent border-priority-urgent/20';
    }
  };

  const getPriorityLabel = (priority: Priority) => {
    switch (priority) {
      case Priority.LOW: return 'Low';
      case Priority.MEDIUM: return 'Medium';
      case Priority.HIGH: return 'High';
      case Priority.URGENT: return 'Urgent';
    }
  };

  const getTaskStatus = () => {
    if (task.isCompleted) return 'completed';
    if (!task.dueDate) return 'normal';
    
    const now = new Date();
    const dueDate = task.dueDate;
    
    if (isBefore(dueDate, now) && !isToday(dueDate)) return 'overdue';
    if (isToday(dueDate) || isBefore(dueDate, addDays(now, 3))) return 'due-soon';
    return 'normal';
  };

  const getStatusIndicator = () => {
    const status = getTaskStatus();
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-todo-completed" />;
      case 'overdue':
        return <AlertTriangle className="h-4 w-4 text-todo-overdue" />;
      case 'due-soon':
        return <Clock className="h-4 w-4 text-todo-due-soon" />;
      default:
        return null;
    }
  };

  const handleToggleComplete = () => {
    onUpdate({ isCompleted: !task.isCompleted });
  };

  const handleEdit = (updates: Omit<Task, 'id' | 'isCompleted' | 'createdAt' | 'updatedAt'>) => {
    onUpdate(updates);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Card className="p-6">
        <TaskForm
          initialData={task}
          onSubmit={handleEdit}
          onCancel={() => setIsEditing(false)}
        />
      </Card>
    );
  }

  return (
    <Card className={cn(
      "p-4 transition-all duration-200 hover:shadow-md",
      task.isCompleted && "opacity-60 bg-muted/30",
      getTaskStatus() === 'overdue' && !task.isCompleted && "border-l-4 border-l-todo-overdue",
      getTaskStatus() === 'due-soon' && !task.isCompleted && "border-l-4 border-l-todo-due-soon"
    )}>
      <div className="flex items-start gap-4">
        <Checkbox
          checked={task.isCompleted}
          onCheckedChange={handleToggleComplete}
          className="mt-1"
        />
        
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className={cn(
                "font-medium text-lg leading-tight",
                task.isCompleted && "line-through text-muted-foreground"
              )}>
                {task.title}
              </h3>
              
              <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                {getStatusIndicator()}
                
                {task.dueDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{format(task.dueDate, 'MMM dd, yyyy')}</span>
                    {task.dueTime && (
                      <>
                        <Clock className="h-4 w-4 ml-2" />
                        <span>{format(task.dueTime, 'HH:mm')}</span>
                      </>
                    )}
                  </div>
                )}
                
                {task.link && (
                  <a
                    href={task.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-primary hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Link</span>
                  </a>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge className={getPriorityColor(task.priority)}>
                {getPriorityLabel(task.priority)}
              </Badge>
              
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="h-8 w-8 p-0"
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDelete}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground">
            Created {format(task.createdAt, 'MMM dd, yyyy')}
            {task.updatedAt.getTime() !== task.createdAt.getTime() && (
              <span> • Updated {format(task.updatedAt, 'MMM dd, yyyy')}</span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}