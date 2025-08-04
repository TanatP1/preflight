import { Priority } from '@/types/todo';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Filter, List, CheckCircle, Circle } from 'lucide-react';

interface TaskFiltersProps {
  filter: 'all' | 'active' | 'completed';
  onFilterChange: (filter: 'all' | 'active' | 'completed') => void;
  priorityFilter: Priority | 'all';
  onPriorityFilterChange: (priority: Priority | 'all') => void;
}

export function TaskFilters({ 
  filter, 
  onFilterChange, 
  priorityFilter, 
  onPriorityFilterChange 
}: TaskFiltersProps) {
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

  const getPriorityBgColor = (priority: Priority) => {
    switch (priority) {
      case Priority.LOW: return 'bg-green-100 border-green-200';
      case Priority.MEDIUM: return 'bg-yellow-100 border-yellow-200';
      case Priority.HIGH: return 'bg-red-100 border-red-200';
      case Priority.URGENT: return 'bg-red-200 border-red-300';
    }
  };

  return (
    <Card className="p-4">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <span className="font-medium text-sm">Filters:</span>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onFilterChange('all')}
              className="flex items-center gap-2"
            >
              <List className="h-4 w-4" />
              All Tasks
            </Button>
            <Button
              variant={filter === 'active' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onFilterChange('active')}
              className="flex items-center gap-2"
            >
              <Circle className="h-4 w-4" />
              Active
            </Button>
            <Button
              variant={filter === 'completed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onFilterChange('completed')}
              className="flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Completed
            </Button>
          </div>
          
          <Select
            value={priorityFilter}
            onValueChange={(value: Priority | 'all') => onPriorityFilterChange(value)}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              {Object.values(Priority).map((priority) => (
                <SelectItem 
                  key={priority} 
                  value={priority} 
                  className={`${getPriorityColor(priority)} hover:${getPriorityBgColor(priority)}`}
                >
                  <span className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      priority === Priority.LOW ? 'bg-green-500' :
                      priority === Priority.MEDIUM ? 'bg-yellow-500' :
                      priority === Priority.HIGH ? 'bg-red-500' :
                      'bg-red-700'
                    }`} />
                    {getPriorityLabel(priority)}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
}