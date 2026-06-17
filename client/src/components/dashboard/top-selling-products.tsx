import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// English content normalized from the original source text.
interface TopSellingProductsProps {
  products: { name: string; sold: number }[];
}

export function TopSellingProductsTable({ products }: TopSellingProductsProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>English content normalized from the original source text.</TableHead>
          <TableHead className="text-right">English content normalized from the original source text.</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">{product.name}</TableCell>
            <TableCell className="text-right">{product.sold}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}