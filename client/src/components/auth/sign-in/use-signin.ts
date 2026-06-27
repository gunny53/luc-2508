import { useState } from 'react'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { LoginSchema } from '../schema/index'
import { authService } from '@/services/auth/auth-service'
import { ROUTES } from '@/constants/route'
import { showToast } from '@/components/ui/toastify'
import { parseApiError } from '@/utils/error'
import { useTranslations } from 'next-intl'
import { useGetProfile } from '@/hooks/use-get-profile'
import { useUserData } from '@/hooks/use-get-data-user-login'
import { useGetAbility } from '@/hooks/use-get-ability'

export function useSignin() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { fetchProfile } = useGetProfile()
  const { fetchAbility } = useGetAbility()
  const t = useTranslations()
  const Schema = LoginSchema(t)
  const userData = useUserData()

  type SigninData = Omit<z.infer<typeof Schema>, 'rememberMe'>

  const handleSignin = async (data: SigninData) => {
    try {
      setLoading(true)
      const { data: responseData, status } = await authService.login(data)

      if (status === 200) {
        showToast(responseData.message || t('admin.showToast.auth.success'), 'success')
        await fetchProfile()
        router.push(ROUTES.ADMIN.DASHBOARD)
      }
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
    } catch (error: any) {
      console.error('Login error:', error)
      showToast(parseApiError(error), 'error')
    } finally {
      setLoading(false)
    }
  }

  return { handleSignin, loading }
}
