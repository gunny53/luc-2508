"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SheetRework } from "@/components/ui/component/sheet-rework";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Plus,
  Home,
  Building2,
  Loader2,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { useAddress, AddressFormValues } from "./useAdddress";
import {
  AddAddressRequest,
  UpdateAddressRequest,
} from "@/types/auth/profile.interface";
import { Badge } from "@/components/ui/badge";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useResponsive } from "@/hooks/useResponsive";
import { SimpleAddressSelect } from "@/components/ui/simple-address-select";
import { useProvinces, useDistricts, useWards } from "@/hooks/useShipping";

export default function AddressBook() {
  const [open, setOpen] = useState(false);
  const [editingAddress, setEditingAddress] =
    useState<AddressFormValues | null>(null);
  const [addresses, setAddresses] = useState<AddressFormValues[]>([]);
  const {
    getAllAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    getAddressById,
    fetchAndMapAddresses,
    prepareAddressForEdit,
    handleSaveAddress,
    formatFullAddress,
    loading: addressLoading
  } = useAddress();
  const { isMobile } = useResponsive();

  // State cho address selection
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>('');
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('');
  const [selectedWardCode, setSelectedWardCode] = useState<string>('');

  // English content normalized from the original source text.
  const { data: provincesData } = useProvinces();
  const { data: districtsData } = useDistricts(
    { provinceId: parseInt(selectedProvinceId) || 0 },
    !!selectedProvinceId
  );
  const { data: wardsData } = useWards(
    { districtId: parseInt(selectedDistrictId) || 0 },
    !!selectedDistrictId
  );

  const form = useForm<AddressFormValues>({
    defaultValues: {
      recipient: "",
      phone: "",
      province: "",
      district: "",
      ward: "",
      detail: "",
      label: "",
      isDefault: false,
      provinceId: 0,
      districtId: 0,
      wardCode: "",
      type: "home",
    },
  });

  const fetchAddresses = async () => {
    const mapped = await fetchAndMapAddresses();
    setAddresses(mapped);
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleAdd = () => {
    setEditingAddress(null);

    // English content normalized from the original source text.
    form.reset({
      recipient: "",
      phone: "",
      province: "",
      district: "",
      ward: "",
      detail: "",
      label: "",
      isDefault: false,
      provinceId: 0,
      districtId: 0,
      wardCode: "",
      type: "home",
    });

    // Reset address selection
    setSelectedProvinceId('');
    setSelectedDistrictId('');
    setSelectedWardCode('');

    // English content normalized from the original source text.
    setOpen(true);
  };

  const handleEdit = async (addr: AddressFormValues) => {
    setEditingAddress(addr);

    // English content normalized from the original source text.
    setOpen(true);

    // English content normalized from the original source text.
    setSelectedProvinceId(addr.provinceId?.toString() || '');
    setSelectedDistrictId(addr.districtId?.toString() || '');
    setSelectedWardCode(addr.wardCode || '');
    form.reset(addr);

    // English content normalized from the original source text.
    try {
      const { addressData, matchedIds } = await prepareAddressForEdit(addr.id!);

      if (addressData) {
        // English content normalized from the original source text.
        setSelectedProvinceId(matchedIds.provinceId || addr.provinceId?.toString() || '');
        setSelectedDistrictId(matchedIds.districtId || addr.districtId?.toString() || '');
        setSelectedWardCode(matchedIds.wardCode || addr.wardCode || '');

        // English content normalized from the original source text.
        form.reset(addressData);
      }
    } catch (error) {
      console.error('Error loading address details:', error);
      // English content normalized from the original source text.
    }
  };

  // English content normalized from the original source text.
  const handleAddressChange = useCallback((provinceId: string, districtId: string, wardCode: string) => {
    setSelectedProvinceId(provinceId);
    setSelectedDistrictId(districtId);
    setSelectedWardCode(wardCode);

    // Update form values
    const numProvinceId = parseInt(provinceId) || 0;
    const numDistrictId = parseInt(districtId) || 0;

    form.setValue('provinceId', numProvinceId);
    form.setValue('districtId', numDistrictId);
    form.setValue('wardCode', wardCode);

    // Update province name
    if (provincesData?.data && provinceId) {
      const province = provincesData.data.find(p => p.ProvinceID.toString() === provinceId);
      if (province) {
        form.setValue('province', province.ProvinceName);
      }
    }

    // Update district name
    if (districtsData?.data && districtId) {
      const district = districtsData.data.find(d => d.DistrictID.toString() === districtId);
      if (district) {
        form.setValue('district', district.DistrictName);
      }
    } else if (!districtId) {
      form.setValue('district', '');
    }

    // Update ward name
    if (wardsData?.data && wardCode) {
      const ward = wardsData.data.find(w => w.WardCode === wardCode);
      if (ward) {
        form.setValue('ward', ward.WardName);
      }
    } else if (!wardCode) {
      form.setValue('ward', '');
    }
  }, [form, provincesData, districtsData, wardsData]);

  const handleSave = async (data: AddressFormValues) => {
    try {
      await handleSaveAddress(data, editingAddress?.id, afterSave);
    } catch (error) {
      console.error('Error saving address:', error);
    }
  };

  const afterSave = () => {
    setOpen(false);
    fetchAddresses();
  };

  const handleDelete = async (addr: AddressFormValues) => {
    if (!addr.id) return;
    await deleteAddress(addr.id, () => {
      fetchAddresses();
    });
  };

  const formContent = (
    <Form {...form}>
      <form className="space-y-4" onSubmit={form.handleSubmit(handleSave)}>
        {/* English content normalized from the original source text. */}
        <div className="space-y-2">
          <label className="text-sm font-medium">English content normalized from the original source text.</label>
          <SimpleAddressSelect
            onAddressChange={handleAddressChange}
            initialValues={{
              provinceId: selectedProvinceId,
              districtId: selectedDistrictId,
              wardCode: selectedWardCode,
            }}
          />
        </div>

        {/* English content normalized from the original source text. */}
        {[
          ["detail", "English content normalized from the original source text.", "required"],
          ["label", "English content normalized from the original source text."],
          ["recipient", "English content normalized from the original source text.", "required"],
        ].map(([name, label, required]) => (
          <FormField
            key={String(name)}
            control={form.control}
            name={name as keyof AddressFormValues}
            rules={
              required
                ? { required: `${label}English content normalized from the original source text.` }
                : undefined
            }
            render={({ field }) => (
              <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={`English content normalized from the original source text.${label.toLowerCase()}`}
                    {...field}
                    value={typeof field.value === "string" ? field.value : ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        ))}

        <FormField
          control={form.control}
          name="phone"
          rules={{
            required: "English content normalized from the original source text.",
            pattern: {
              value: /^(0|\+84)\d{9}$/,
              message: "English content normalized from the original source text.",
            },
          }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>English content normalized from the original source text.</FormLabel>
              <FormControl>
                <Input
                  placeholder="English content normalized from the original source text."
                  {...field}
                  value={typeof field.value === "string" ? field.value : ""}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>English content normalized from the original source text.</FormLabel>
              <div className="flex gap-3 border-b border-gray-200 pb-4">
                <Button
                  type="button"
                  variant={field.value === "home" ? "default" : "outline"}
                  onClick={() => field.onChange("home")}
                >
                  <Home className="h-4 w-4 mr-2" />English content normalized from the original source text.</Button>
                <Button
                  type="button"
                  variant={field.value === "office" ? "default" : "outline"}
                  onClick={() => field.onChange("office")}
                >
                  <Building2 className="h-4 w-4 mr-2" />English content normalized from the original source text.</Button>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isDefault"
          render={({ field }) => (
            <FormItem className="flex items-center gap-3">
              <FormLabel className="mb-0">English content normalized from the original source text.</FormLabel>
              <FormControl>
                <Switch
                  checked={!!field.value}
                  onCheckedChange={(checked) => field.onChange(checked)}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* English content normalized from the original source text. */}
        <input type="hidden" {...form.register('provinceId')} />
        <input type="hidden" {...form.register('districtId')} />
        <input type="hidden" {...form.register('wardCode')} />
        <input type="hidden" {...form.register('province')} />
        <input type="hidden" {...form.register('district')} />
        <input type="hidden" {...form.register('ward')} />
      </form>
    </Form>
  );

  return (
    <div className="bg-white rounded-lg p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-base text-[#121214]">English content normalized from the original source text.</h2>
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-[#D70019]"
          onClick={handleAdd}
        >
          <Plus size={18} />English content normalized from the original source text.</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((addr, i) => (
          <div
            key={i}
            className="bg-[#F9F9F9] border rounded-xl p-4 flex flex-col space-y-2"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-sm font-medium">
                {addr.type === "home" ? (
                  <Home size={16} />
                ) : (
                  <Building2 size={16} />
                )}
                {addr.label || "English content normalized from the original source text."}
              </div>
              {addr.isDefault && (
                <Badge variant="outline" className="bg-blue-100 text-[#193767]">English content normalized from the original source text.</Badge>
              )}
            </div>
            <div className="text-sm font-semibold flex flex-wrap gap-1">
              <span>{addr.recipient}</span>
              <span className="text-[#000000]">|</span>
              <span>{addr.phone}</span>
            </div>
            <p className="text-sm text-[#71717A]">{formatFullAddress(addr)}</p>
            <div className="mt-auto pt-2 flex justify-end items-center gap-3 text-sm">
              <button
                disabled={addressLoading}
                onClick={() => handleDelete(addr)}
                className="text-[#1D1D20] hover:underline"
              >
                {addressLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "English content normalized from the original source text."}
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={() => handleEdit(addr)}
                className="text-[#3B82F6] hover:underline"
              >English content normalized from the original source text.</button>
            </div>
          </div>
        ))}
      </div>

      {isMobile ? (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent className="p-0">
            <DrawerHeader>
              <DrawerTitle>
                {editingAddress ? "English content normalized from the original source text." : "English content normalized from the original source text."}
              </DrawerTitle>
            </DrawerHeader>

            <div className="px-4 overflow-y-auto max-h-[calc(80vh-100px)]">
              {formContent}
            </div>

            <DrawerFooter className="flex justify-end gap-2 mt-4">
              <Button
                onClick={form.handleSubmit(handleSave)}
                disabled={addressLoading}
              >
                {addressLoading ? "English content normalized from the original source text." : "English content normalized from the original source text."}
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        <SheetRework
          open={open}
          onOpenChange={setOpen}
          title={editingAddress ? "English content normalized from the original source text." : "English content normalized from the original source text."}
          subtitle="English content normalized from the original source text."
          onCancel={() => setOpen(false)}
          onConfirm={form.handleSubmit(handleSave)}
          confirmText={addressLoading ? "English content normalized from the original source text." : "English content normalized from the original source text."}
          cancelText="English content normalized from the original source text."
        >
          {formContent}
        </SheetRework>
      )}
    </div>
  );
}
