import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
const recentOrders = [
  {
    id: '#98765',
    customer: '??n h?ng',
    total: '??n h?ng',
    status: '??n h?ng'
  },
  {
    id: '#98764',
    customer: '??n h?ng',
    total: '??n h?ng',
    status: '??n h?ng'
  },
  {
    id: '#98763',
    customer: '??n h?ng',
    total: '??n h?ng',
    status: '??n h?ng'
  }
]

export function RecentOrdersTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>??n h?ng</TableHead>
          <TableHead>??n h?ng</TableHead>
          <TableHead className="text-right">??n h?ng</TableHead>
          <TableHead>??n h?ng</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {recentOrders.map((order, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">{order.id}</TableCell>
            <TableCell>{order.customer}</TableCell>
            <TableCell className="text-right">{order.total}</TableCell>
            <TableCell>{order.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
