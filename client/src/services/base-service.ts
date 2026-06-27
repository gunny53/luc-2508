import { privateAxios, publicAxios } from '@/lib/api'
import { API_ENDPOINTS } from '@/constants/api'
import {
  PaginationRequest,
  BaseResponse,
  MediaUploadResponse,
  PresignedUrlsRequest,
  PresignedUrlsResponse,
  PresignedFileRequest
} from '@/types/base.interface'
import { AxiosError } from 'axios'

export const baseService = {
  uploadMedia: async (files: File[], signal?: AbortSignal): Promise<MediaUploadResponse> => {
    try {
      const formData = new FormData()
      files.forEach((file) => {
        formData.append('files', file)
      })

      const response = await privateAxios.post(API_ENDPOINTS.BASE.UPLOAD_MEDIA, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        signal: signal
      })

      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      console.error('Error uploading media:', axiosError)
      throw (
        axiosError.response?.data || {
          message: 'Failed to upload media.'
        }
      )
    }
  },

  getPresignedUrls: async (files: PresignedFileRequest[], signal?: AbortSignal): Promise<PresignedUrlsResponse> => {
    try {
      const requestBody: PresignedUrlsRequest = {
        files: files
      }

      const response = await privateAxios.post(API_ENDPOINTS.BASE.GET_PRESIGN_URL, requestBody, {
        headers: {
          'Content-Type': 'application/json'
        },
        signal: signal
      })

      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      console.error('Error getting presigned URLs:', axiosError)
      throw (
        axiosError.response?.data || {
          message: 'Failed to create upload URLs.'
        }
      )
    }
  },

  uploadToS3: async (file: File, presignedUrl: string, signal?: AbortSignal): Promise<void> => {
    try {
      const response = await fetch(presignedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type
        },
        signal: signal
      })

      if (!response.ok) {
        throw new Error(`S3 upload failed: ${response.status} ${response.statusText}`)
      }
    } catch (error) {
      console.error('Error uploading to S3:', error)
      throw error
    }
  }
}
