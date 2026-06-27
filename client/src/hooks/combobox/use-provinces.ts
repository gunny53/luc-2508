'use client'

import { useState, useEffect } from 'react'
import provincesService, { Province, District, Ward } from '@/services/shared/provinces-service'

export interface LocationOption {
  value: string
  label: string
}

interface UseProvincesReturn {
  provinces: LocationOption[]
  districts: LocationOption[]
  wards: LocationOption[]
  selectedProvince: string
  selectedDistrict: string
  selectedWard: string
  isLoadingProvinces: boolean
  isLoadingDistricts: boolean
  isLoadingWards: boolean
  error: string | null
  setSelectedProvince: (provinceCode: string) => void
  setSelectedDistrict: (districtCode: string) => void
  setSelectedWard: (wardCode: string) => void
  getProvinceName: (code: string) => string
  getDistrictName: (code: string) => string
  getWardName: (code: string) => string
  resetDistrict: () => void
  resetWard: () => void
  resetAll: () => void
}


export function useProvinces(): UseProvincesReturn {
  
  const [provincesData, setProvincesData] = useState<Province[]>([])
  const [districtsData, setDistrictsData] = useState<District[]>([])
  const [wardsData, setWardsData] = useState<Ward[]>([])

  
  const [selectedProvince, setSelectedProvince] = useState<string>('')
  const [selectedDistrict, setSelectedDistrict] = useState<string>('')
  const [selectedWard, setSelectedWard] = useState<string>('')

  
  const [isLoadingProvinces, setIsLoadingProvinces] = useState<boolean>(false)
  const [isLoadingDistricts, setIsLoadingDistricts] = useState<boolean>(false)
  const [isLoadingWards, setIsLoadingWards] = useState<boolean>(false)

  
  const [error, setError] = useState<string | null>(null)

  
  const provinces: LocationOption[] = provincesData.map((province) => ({
    value: province.code,
    label: province.name
  }))

  const districts: LocationOption[] = districtsData.map((district) => ({
    value: district.code,
    label: district.name
  }))

  const wards: LocationOption[] = wardsData.map((ward) => ({
    value: ward.code,
    label: ward.name
  }))

  
  const getProvinceName = (code: string): string => {
    const province = provincesData.find((p) => p.code === code)
    return province?.name || ''
  }

  const getDistrictName = (code: string): string => {
    const district = districtsData.find((d) => d.code === code)
    return district?.name || ''
  }

  const getWardName = (code: string): string => {
    const ward = wardsData.find((w) => w.code === code)
    return ward?.name || ''
  }

  
  const resetDistrict = () => {
    setSelectedDistrict('')
    setDistrictsData([])
  }

  const resetWard = () => {
    setSelectedWard('')
    setWardsData([])
  }

  const resetAll = () => {
    setSelectedProvince('')
    setSelectedDistrict('')
    setSelectedWard('')
    setDistrictsData([])
    setWardsData([])
  }

  
  useEffect(() => {
    const fetchProvinces = async () => {
      setIsLoadingProvinces(true)
      setError(null)

      try {
        const data = await provincesService.getProvinces()
        setProvincesData(data)
      } catch (err) {
        console.error('Failed to fetch provinces:', err)
        setError('ECSite')
      } finally {
        setIsLoadingProvinces(false)
      }
    }

    fetchProvinces()
  }, [])

  
  useEffect(() => {
    if (!selectedProvince) {
      resetDistrict()
      return
    }

    const fetchDistricts = async () => {
      setIsLoadingDistricts(true)
      setError(null)

      try {
        const data = await provincesService.getDistrictsByProvince(selectedProvince)
        setDistrictsData(data)
        resetWard() 
      } catch (err) {
        console.error(`Failed to fetch districts for province ${selectedProvince}:`, err)
        setError('ECSite')
      } finally {
        setIsLoadingDistricts(false)
      }
    }

    fetchDistricts()
  }, [selectedProvince])

  
  useEffect(() => {
    if (!selectedDistrict) {
      resetWard()
      return
    }

    const fetchWards = async () => {
      setIsLoadingWards(true)
      setError(null)

      try {
        const data = await provincesService.getWardsByDistrict(selectedDistrict)
        setWardsData(data)
      } catch (err) {
        console.error(`Failed to fetch wards for district ${selectedDistrict}:`, err)
        setError('ECSite')
      } finally {
        setIsLoadingWards(false)
      }
    }

    fetchWards()
  }, [selectedDistrict])

  return {
    provinces,
    districts,
    wards,
    selectedProvince,
    selectedDistrict,
    selectedWard,
    isLoadingProvinces,
    isLoadingDistricts,
    isLoadingWards,
    error,
    setSelectedProvince,
    setSelectedDistrict,
    setSelectedWard,
    getProvinceName,
    getDistrictName,
    getWardName,
    resetDistrict,
    resetWard,
    resetAll
  }
}

export default useProvinces
