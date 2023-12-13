'use client'
import React, { useEffect } from 'react'
import LoginForm from '../components/login-module/login-form'
import { fetchData } from '../core/hooks/getBearer'

const Page = () => {

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className='flex flex-col w-full min-h-screen justify-center items-center'>
        <LoginForm/>
    </div>
  )
}

export default Page