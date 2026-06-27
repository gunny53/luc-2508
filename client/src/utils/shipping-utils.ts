import { shippingService } from '@/services/shipping-service'
import { Province, District, Ward } from '@/types/shipping.interface'


let provincesCache: Province[] = []
let districtsCache: Map<number, District[]> = new Map()
let wardsCache: Map<number, Ward[]> = new Map()

export const shippingUtils = {
  
  initProvinces: async () => {
    if (provincesCache.length === 0) {
      try {
        const response = await shippingService.getProvinces()
        if (response.data) {
          provincesCache = response.data
        }
      } catch (error) {
        console.error('Failed to load provinces:', error)
      }
    }
    return provincesCache
  },

  
  getProvinceName: (provinceId: string | number): string | null => {
    const id = typeof provinceId === 'string' ? parseInt(provinceId) : provinceId
    const province = provincesCache.find((p) => p.ProvinceID === id)
    return province?.ProvinceName || null
  },

  
  getDistrictName: async (provinceId: string | number, districtId: string | number): Promise<string | null> => {
    const pId = typeof provinceId === 'string' ? parseInt(provinceId) : provinceId
    const dId = typeof districtId === 'string' ? parseInt(districtId) : districtId

    
    let districts = districtsCache.get(pId)
    if (!districts) {
      try {
        const response = await shippingService.getDistricts({ provinceId: pId })
        if (response.data) {
          districts = response.data
          districtsCache.set(pId, districts)
        }
      } catch (error) {
        console.error('Failed to load districts:', error)
        return null
      }
    }

    const district = districts?.find((d) => d.DistrictID === dId)
    return district?.DistrictName || null
  },

  
  getWardName: async (districtId: string | number, wardCode: string): Promise<string | null> => {
    const dId = typeof districtId === 'string' ? parseInt(districtId) : districtId

    
    let wards = wardsCache.get(dId)
    if (!wards) {
      try {
        const response = await shippingService.getWards({ districtId: dId })
        if (response.data) {
          wards = response.data
          wardsCache.set(dId, wards)
        }
      } catch (error) {
        console.error('Failed to load wards:', error)
        return null
      }
    }

    const ward = wards?.find((w) => w.WardCode === wardCode)
    return ward?.WardName || null
  },

  
  formatAddress: (province: string, district: string, ward: string, detail: string): string => {
    const parts = [detail, ward, district, province].filter(Boolean)
    return parts.join(', ')
  },

  
  parseAddressData: (addressString: string) => {
    if (!addressString) return { id: '', name: '' }

    const parts = addressString.split('|')
    return {
      id: parts[0] || '',
      name: parts[1] || parts[0] || ''
    }
  },

  
  formatAddressData: (id: string | number, name: string): string => {
    return `${id}|${name}`
  }
}

export default shippingUtils
