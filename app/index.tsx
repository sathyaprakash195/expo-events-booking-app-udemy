import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import FlexBox from '@/components/ui/flexbox'
import { RelativePathString, useRouter } from 'expo-router'
import { getCurrentUser } from '@/services/users'
import { useUsersStore } from '@/store/users-store'


const Homescreen = () => {
  const router = useRouter()
  const { setUser } = useUsersStore()

  const checkAuthSession = async () => {
    try {
      const response = await getCurrentUser()
      setUser(response.user)
      if (response.user.role === 'user') {
        router.replace('/user/home' as RelativePathString)
      } else {
        router.replace('/admin/home' as RelativePathString)
      }
    } catch (error) {
      router.replace('/welcome' as RelativePathString)
    }
  }

  useEffect(() => {
    checkAuthSession()
  }, [])

  return (
    <FlexBox flex={1}
      justifyContent='center'
      alignItems='center'
    >
      <Text>Loading...</Text>
    </FlexBox>
  )
}

export default Homescreen