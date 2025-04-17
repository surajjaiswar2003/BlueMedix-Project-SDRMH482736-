import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Search, Calendar, Clock, Target, Users } from 'lucide-react';
import { toast } from 'sonner';

// Mock data
const plans = [
  {
    id: 1,
    name: 'Weight Loss Plan',
    goal: 'Weight Loss',
    duration: '12 weeks',
    status: 'active',
    assignedTo: 'John Doe',
    createdBy: 'Sarah Smith',
    createdAt: '2023-01-15',
  },
  {
    id: 2,
    name: 'Muscle Gain Plan',
    goal: 'Muscle Building',
    duration: '8 weeks',
    status: 'pending',
    assignedTo: 'Jane Smith',
    createdBy: 'Mike Johnson',
    createdAt: '2023-02-20',
  },
  {
    id: 3,
    name: 'Maintenance Plan',
    goal: 'Weight Maintenance',
    duration: 'Ongoing',
    status: 'active',
    assignedTo: 'Bob Wilson',
    createdBy: 'Emily Brown',
    createdAt: '2023-03-10',
  },
];

const goals = [
  'Weight Loss',
  'Muscle Building',
  'Weight Maintenance',
  'Athletic Performance',
  'General Health',
];

const users = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
  { id: 3, name: 'Bob Wilson' },
];

const Plans = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newPlan, setNewPlan] = useState({
    name: '',
    goal: '',
    duration: '',
    description: '',
    meals: '',
  });

  const handleAddPlan = () => {
    toast.success('Diet plan created successfully');
    setIsAddDialogOpen(false);
    // In a real app, this would call an API
  };

  const handleAssignPlan = (planId: number, userId: number) => {
    const user = users.find(u => u.id === userId);
    toast.success(`Plan assigned to ${user?.name}`);
    // In a real app, this would call an API
  };

  const filteredPlans = plans.filter(plan =>
    plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plan.goal.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Diet Plan Management</h1>
          <p className="text-gray-500">Create and manage diet plans</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-dietGreen hover:bg-dietGreen-dark">
              <Plus className="w-4 h-4 mr-2" />
              Create Plan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Diet Plan</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Plan Name</label>
                  <Input
                    value={newPlan.name}
                    onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Goal</label>
                  <Select
                    value={newPlan.goal}
                    onValueChange={(value) => setNewPlan({ ...newPlan, goal: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select goal" />
                    </SelectTrigger>
                    <SelectContent>
                      {goals.map((goal) => (
                        <SelectItem key={goal} value={goal}>
                          {goal}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Duration</label>
                <Input
                  value={newPlan.duration}
                  onChange={(e) => setNewPlan({ ...newPlan, duration: e.target.value })}
                  placeholder="e.g., 12 weeks"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={newPlan.description}
                  onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Meal Plan</label>
                <Textarea
                  value={newPlan.meals}
                  onChange={(e) => setNewPlan({ ...newPlan, meals: e.target.value })}
                  placeholder="Enter meal plan details..."
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddPlan}>Create Plan</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search plans..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Plan</TableHead>
              <TableHead>Goal</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPlans.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell className="font-medium">{plan.name}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Target className="w-4 h-4 mr-2 text-dietGreen" />
                    {plan.goal}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-dietBlue" />
                    {plan.duration}
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    plan.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {plan.status}
                  </span>
                </TableCell>
                <TableCell>{plan.assignedTo}</TableCell>
                <TableCell>{plan.createdBy}</TableCell>
                <TableCell>{new Date(plan.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <Select onValueChange={(value) => handleAssignPlan(plan.id, parseInt(value))}>
                    <SelectTrigger className="w-[180px]">
                      <Users className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Assign to..." />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default Plans; 