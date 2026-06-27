import axios from 'axios'

const BASE_URL = 'https://provinces.open-api.vn/api'


export interface Province {
  code: string
  name: string
  division_type: string
  codename: string
  phone_code: string
  districts?: District[]
}

export interface District {
  code: string
  name: string
  division_type: string
  codename: string
  province_code: string
  wards?: Ward[]
}

export interface Ward {
  code: string
  name: string
  division_type: string
  codename: string
  district_code: string
}


export const provincesService = {
  
  getProvinces: async (depth?: number): Promise<Province[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/p`, {
        params: depth ? { depth } : {}
      })
      return response.data
    } catch (error) {
      console.error('Error fetching provinces:', error)
      throw error
    }
  },

  





  getProvince: async (code: string, depth?: number): Promise<Province> => {
    try {
      const response = await axios.get(`${BASE_URL}/p/${code}`, {
        params: depth ? { depth } : {}
      })
      return response.data
    } catch (error) {
      console.error(`Error fetching province with code ${code}:`, error)
      throw error
    }
  },

  




  getDistricts: async (depth?: number): Promise<District[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/d`, {
        params: depth ? { depth } : {}
      })
      return response.data
    } catch (error) {
      console.error('Error fetching districts:', error)
      throw error
    }
  },

  





  getDistrictsByProvince: async (provinceCode: string, depth?: number): Promise<District[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/p/${provinceCode}`, {
        params: { depth: depth || 2 }
      })
      return response.data.districts || []
    } catch (error) {
      console.error(`Error fetching districts for province ${provinceCode}:`, error)
      throw error
    }
  },

  





  getDistrict: async (code: string, depth?: number): Promise<District> => {
    try {
      const response = await axios.get(`${BASE_URL}/d/${code}`, {
        params: depth ? { depth } : {}
      })
      return response.data
    } catch (error) {
      console.error(`Error fetching district with code ${code}:`, error)
      throw error
    }
  },

  



  getWards: async (): Promise<Ward[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/w`)
      return response.data
    } catch (error) {
      console.error('Error fetching wards:', error)
      throw error
    }
  },

  




  getWardsByDistrict: async (districtCode: string): Promise<Ward[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/d/${districtCode}`, {
        params: { depth: 2 }
      })
      return response.data.wards || []
    } catch (error) {
      console.error(`Error fetching wards for district ${districtCode}:`, error)
      throw error
    }
  },

  




  getWard: async (code: string): Promise<Ward> => {
    try {
      const response = await axios.get(`${BASE_URL}/w/${code}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching ward with code ${code}:`, error)
      throw error
    }
  },

  





  search: async (q: string, type?: 'p' | 'd' | 'w'): Promise<any[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/search`, {
        params: { q, ...(type ? { type } : {}) }
      })
      return response.data
    } catch (error) {
      console.error(`Error searching for "${q}":`, error)
      throw error
    }
  }
}

export default provincesService
