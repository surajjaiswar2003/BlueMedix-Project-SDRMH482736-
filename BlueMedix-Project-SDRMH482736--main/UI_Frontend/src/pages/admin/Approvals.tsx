import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Clock, Utensils, ClipboardList } from 'lucide-react';
import { toast } from 'sonner';

// Mock data
const pendingApprovals = [
  {
    id: 1,
    type: 'recipe',
    title: 'Keto Breakfast Bowl',
    submittedBy: 'Sarah Smith',
    submittedAt: '2023-04-15',
    status: 'pending',
  },
  {
    id: 2,
    type: 'plan',
    title: 'Muscle Gain Plan',
    submittedBy: 'Mike Johnson',
    submittedAt: '2023-04-14',
    status: 'pending',
  },
  {
    id: 3,
    type: 'recipe',
    title: 'Vegan Buddha Bowl',
    submittedBy: 'Emily Brown',
    submittedAt: '2023-04-13',
    status: 'pending',
  },
];

const Approvals = () => {
  const handleApprove = (id: number, type: string) => {
    toast.success(`${type === 'recipe' ? 'Recipe' : 'Plan'} approved successfully`);
    // In a real app, this would call an API
  };

  const handleReject = (id: number, type: string) => {
    toast.error(`${type === 'recipe' ? 'Recipe' : 'Plan'} rejected`);
    // In a real app, this would call an API
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Approval Center</h1>
        <p className="text-gray-500">Review and approve pending submissions</p>
      </div>

      <Card>
        <div className="p-4 border-b">
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              Pending Approvals
            </Badge>
            <Badge variant="outline" className="flex items-center">
              <Utensils className="w-4 h-4 mr-1" />
              Recipes
            </Badge>
            <Badge variant="outline" className="flex items-center">
              <ClipboardList className="w-4 h-4 mr-1" />
              Diet Plans
            </Badge>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Submitted By</TableHead>
              <TableHead>Submitted At</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingApprovals.map((approval) => (
              <TableRow key={approval.id}>
                <TableCell>
                  <Badge
                    variant={approval.type === 'recipe' ? 'secondary' : 'default'}
                    className="flex items-center"
                  >
                    {approval.type === 'recipe' ? (
                      <Utensils className="w-4 h-4 mr-1" />
                    ) : (
                      <ClipboardList className="w-4 h-4 mr-1" />
                    )}
                    {approval.type}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">{approval.title}</TableCell>
                <TableCell>{approval.submittedBy}</TableCell>
                <TableCell>{new Date(approval.submittedAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {approval.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      onClick={() => handleApprove(approval.id, approval.type)}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleReject(approval.id, approval.type)}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Recently Approved */}
      <Card>
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Recently Approved</h2>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">Approved Item {i}</div>
                  <div className="text-sm text-gray-500">By Dietitian {i}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="default" className="flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Approved
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Approvals; 