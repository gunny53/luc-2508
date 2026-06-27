import { useQuery } from '@tanstack/react-query'
import { shippingService } from '@/services/shipping-service'
import { GetDistrictsParams, GetWardsParams } from '@/types/shipping.interface'
export const useProvinces = () => {
  return useQuery({
    queryKey: ['provinces'],
    queryFn: () => shippingService.getProvinces(),
    staleTime: 1000 * 60 * 60, 
    gcTime: 1000 * 60 * 60 * 24 
  })
}
export const useDistricts = (params: GetDistrictsParams, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['districts', params.provinceId],
    queryFn: () => shippingService.getDistricts(params),
    enabled: enabled && !!params.provinceId,
    staleTime: 1000 * 60 * 30, 
    gcTime: 1000 * 60 * 60 * 2 
  })
}
export const useWards = (params: GetWardsParams, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['wards', params.districtId],
    queryFn: () => shippingService.getWards(params),
    enabled: enabled && !!params.districtId,
    staleTime: 1000 * 60 * 30, 
    gcTime: 1000 * 60 * 60 * 2 
  })
}
