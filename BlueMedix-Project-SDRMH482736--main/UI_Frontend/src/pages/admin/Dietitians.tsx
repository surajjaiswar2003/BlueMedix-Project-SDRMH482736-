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
import { Textarea } from '@/components/ui/textarea';
import { Plus, Search, UserPlus, Activity, Users } from 'lucide-react';
import { toast } from 'sonner';

// Mock data
const dietitians = [
  {
    id: 1,
    name: 'Sarah Smith',
    email: 'sarah@example.com',
    specialization: 'Weight Loss, Sports Nutrition',
    clients: 24,
    status: 'active',
    joinDate: '2022-01-15',
  },
  {
    id: 2,
    name: 'Mike Johnson',
    email: 'mike@example.com',
    specialization: 'Clinical Nutrition, Diabetes',
    clients: 18,
    status: 'active',
    joinDate: '2022-03-20',
  },
  {
    id: 3,
    name: 'Emily Brown',
    email: 'emily@example.com',
    specialization: 'Pediatric Nutrition, Allergies',
    clients: 15,
    status: 'on leave',
    joinDate: '2022-05-10',
  },
];

const Dietitians = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newDietitian, setNewDietitian] = useState({
    name: '',
    email: '',
    specialization: '',
    bio: '',
  });

  const handleAddDietitian = () => {
    toast.success('Dietitian added successfully');
    setIsAddDialogOpen(false);
    // In a real app, this would call an API
  };

  const handleAssignClients = (dietitianId: number) => {
    toast.success('Clients assigned successfully');
    // In a real app, this would call an API
  };

  const filteredDietitians = dietitians.filter(dietitian =>
    dietitian.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dietitian.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dietitian Management</h1>
          <p className="text-gray-500">Manage dietitian profiles and assignments</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-dietGreen hover:bg-dietGreen-dark">
              <UserPlus className="w-4 h-4 mr-2" />
              Add Dietitian
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Dietitian</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    value={newDietitian.name}
                    onChange={(e) => setNewDietitian({ ...newDietitian, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    value={newDietitian.email}
                    onChange={(e) => setNewDietitian({ ...newDietitian, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Specialization</label>
                <Input
                  value={newDietitian.specialization}
                  onChange={(e) => setNewDietitian({ ...newDietitian, specialization: e.target.value })}
                  placeholder="e.g., Weight Loss, Sports Nutrition"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Bio</label>
                <Textarea
                  value={newDietitian.bio}
                  onChange={(e) => setNewDietitian({ ...newDietitian, bio: e.target.value })}
                  placeholder="Enter dietitian's bio..."
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddDietitian}>Add Dietitian</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search dietitians..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Dietitian</TableHead>
              <TableHead>Specialization</TableHead>
              <TableHead>Clients</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDietitians.map((dietitian) => (
              <TableRow key={dietitian.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{dietitian.name}</div>
                    <div className="text-sm text-gray-500">{dietitian.email}</div>
                  </div>
                </TableCell>
                <TableCell>{dietitian.specialization}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2 text-dietGreen" />
                    {dietitian.clients}
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    dietitian.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {dietitian.status}
                  </span>
                </TableCell>
                <TableCell>{new Date(dietitian.joinDate).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAssignClients(dietitian.id)}
                    >
                      <Activity className="w-4 h-4 mr-2" />
                      View Activity
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAssignClients(dietitian.id)}
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Assign Clients
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default Dietitians; 