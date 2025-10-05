import { LoaderIcon } from 'lucide-react'
import React from 'react'
import { useThemeStore } from '../store/useThemeStore'

const PageLoader = () => {
  const {theme} = useThemeStore()
  return (
    <div className='min-h-screen flex flex-col items-center justify-center' data-theme= {theme}>
        <LoaderIcon className='animate-spin size-12 text-primary'/>
        <span className='animate-pulse size-16 text-primary'>Loading </span>
    </div>
  )
}

export default PageLoader