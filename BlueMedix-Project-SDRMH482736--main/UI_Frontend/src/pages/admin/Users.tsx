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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Search, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

// Mock data
const users = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    status: 'active',
    dietitian: 'Sarah Smith',
    joinDate: '2023-01-15',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    status: 'suspended',
    dietitian: 'Mike Johnson',
    joinDate: '2023-02-20',
  },
  {
    id: 3,
    name: 'Bob Wilson',
    email: 'bob@example.com',
    status: 'active',
    dietitian: 'Sarah Smith',
    joinDate: '2023-03-10',
  },
];

const dietitians = [
  { id: 1, name: 'Sarah Smith' },
  { id: 2, name: 'Mike Johnson' },
  { id: 3, name: 'Emily Brown' },
];

const Users = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleStatusChange = (userId: number, newStatus: string) => {
    toast.success(`User status updated to ${newStatus}`);
    // In a real app, this would call an API
  };

  const handleDietitianChange = (userId: number, dietitianId: number) => {
    const dietitian = dietitians.find(d => d.id === dietitianId);
    toast.success(`User assigned to ${dietitian?.name}`);
    // In a real app, this would call an API
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500">Manage and monitor user accounts</p>
        </div>
        <Button className="bg-dietGreen hover:bg-dietGreen-dark">
          <UserPlus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      <Card>
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search users..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Dietitian</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status}
                  </span>
                </TableCell>
                <TableCell>{user.dietitian}</TableCell>
                <TableCell>{new Date(user.joinDate).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(
                          user.id,
                          user.status === 'active' ? 'suspended' : 'active'
                        )}
                      >
                        {user.status === 'active' ? 'Suspend User' : 'Activate User'}
                      </DropdownMenuItem>
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>Edit User</DropdownMenuItem>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="w-full text-left px-2 py-1.5 text-sm">
                          Assign Dietitian
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {dietitians.map((dietitian) => (
                            <DropdownMenuItem
                              key={dietitian.id}
                              onClick={() => handleDietitianChange(user.id, dietitian.id)}
                            >
                              {dietitian.name}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default Users; 