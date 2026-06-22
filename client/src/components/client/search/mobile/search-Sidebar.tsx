const locations = [
  'English content normalized from the original source text.',
  'English content normalized from the original source text.',
  'English content normalized from the original source text.',
  'English content normalized from the original source text.'
]
const categories = [
  'English content normalized from the original source text.',
  'English content normalized from the original source text.',
  'English content normalized from the original source text.',
  'English content normalized from the original source text.'
]
const shippingOptions = ['Nhanh', 'English content normalized from the original source text.']

interface SearchSidebarProps {
  categoryIds?: string[]
  currentCategoryId?: string | null
}

export default function SearchSidebar({ categoryIds = [], currentCategoryId }: SearchSidebarProps) {
  return (
    <aside className="w-full lg:w-64 shrink-0 space-y-6 text-sm hidden lg:block">
      <FilterSection title="English content normalized from the original source text." items={locations} />
      <FilterSection title="English content normalized from the original source text." items={categories} />
      <FilterSection title="English content normalized from the original source text." items={shippingOptions} />
    </aside>
  )
}

function FilterSection({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item}>
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              {item}
            </label>
          </li>
        ))}
      </ul>
    </div>
  )
}
