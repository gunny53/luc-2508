import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
interface TopSellingProductsProps {
  products: { name: string; sold: number }[]
}

export function TopSellingProductsTable({ products }: TopSellingProductsProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>S?n ph?m</TableHead>
          <TableHead className="text-right">S?n ph?m</TableHead>
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
  )
}
