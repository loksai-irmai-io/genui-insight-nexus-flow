
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DataTableWidgetProps {
  title: string;
  dataSource?: string;
  settings?: Record<string, any>;
}

export const DataTableWidget = ({ title, dataSource }: DataTableWidgetProps) => {
  // Sample data - in real implementation, this would come from dataSource
  const data = [
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'Inactive' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', status: 'Active' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', status: 'Pending' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-green-400';
      case 'Inactive': return 'text-red-400';
      case 'Pending': return 'text-yellow-400';
      default: return 'text-white/70';
    }
  };

  return (
    <div className="w-full h-full">
      <ScrollArea className="h-full">
        <Table>
          <TableHeader>
            <TableRow className="border-white/20 hover:bg-white/5">
              <TableHead className="text-white/90">Name</TableHead>
              <TableHead className="text-white/90">Email</TableHead>
              <TableHead className="text-white/90">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id} className="border-white/10 hover:bg-white/5">
                <TableCell className="text-white text-sm">{row.name}</TableCell>
                <TableCell className="text-white/70 text-sm">{row.email}</TableCell>
                <TableCell className={`text-sm ${getStatusColor(row.status)}`}>
                  {row.status}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};
