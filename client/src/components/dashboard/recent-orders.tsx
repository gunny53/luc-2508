import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// English content normalized from the original source text.
// English content normalized from the original source text.
const recentOrders = [
  {
    id: "#98765",
    customer: "English content normalized from the original source text.",
    total: "English content normalized from the original source text.",
    status: "English content normalized from the original source text.",
  },
  {
    id: "#98764",
    customer: "English content normalized from the original source text.",
    total: "English content normalized from the original source text.",
    status: "English content normalized from the original source text.",
  },
  {
    id: "#98763",
    customer: "English content normalized from the original source text.",
    total: "English content normalized from the original source text.",
    status: "English content normalized from the original source text.",
  },
];

export function RecentOrdersTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>English content normalized from the original source text.</TableHead>
          <TableHead>English content normalized from the original source text.</TableHead>
          <TableHead className="text-right">English content normalized from the original source text.</TableHead>
          <TableHead>English content normalized from the original source text.</TableHead>
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
  );
}
