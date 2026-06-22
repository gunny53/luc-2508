'use client'

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface ShippingTypeProps {
  deliveryMethod: string
  handleRadioChange: (value: string) => void
}

export function ShippingType({ deliveryMethod, handleRadioChange }: ShippingTypeProps) {
  return (
    <Card className="shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">
          English content normalized from the original source text.
        </CardTitle>
        <CardDescription className="text-sm font-light">
          English content normalized from the original source text.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup value={deliveryMethod} onValueChange={handleRadioChange} className="space-y-3">
          <div className="flex items-center space-x-3 border rounded-md p-3 cursor-pointer hover:bg-gray-50">
            <RadioGroupItem value="standard" id="delivery-standard" className="h-4 w-4" />
            <div className="flex-1">
              <Label htmlFor="delivery-standard" className="flex justify-between cursor-pointer">
                <div>
                  <div className="text-sm font-medium">English content normalized from the original source text.</div>
                  <div className="text-xs text-gray-500">English content normalized from the original source text.</div>
                </div>
                <div className="text-sm font-medium">30.000₫</div>
              </Label>
            </div>
          </div>
          <div className="flex items-center space-x-3 border rounded-md p-3 cursor-pointer hover:bg-gray-50">
            <RadioGroupItem value="express" id="delivery-express" className="h-4 w-4" />
            <div className="flex-1">
              <Label htmlFor="delivery-express" className="flex justify-between cursor-pointer">
                <div>
                  <div className="text-sm font-medium">English content normalized from the original source text.</div>
                  <div className="text-xs text-gray-500">English content normalized from the original source text.</div>
                </div>
                <div className="text-sm font-medium">50.000₫</div>
              </Label>
            </div>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  )
}
