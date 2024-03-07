'use client'
import Header from '@/components/shared/Header'
import React from 'react'
import { transformationTypes } from '@/constants'
import { useParams } from 'next/navigation'
import TranformationForm from '@/components/shared/TranformationForm'
const CreateTransformationPage = () => {

  // get current params
  const {type} = useParams();

    // Sử dụng keyof typeof transformationTypes để chỉ định kiểu dữ liệu cho type
    // Vì type có kiểu là "string" nên không nên index được
  const transformation = transformationTypes[type as keyof typeof transformationTypes];
  if (!transformation) {
    // Xử lý khi giá trị type không hợp lệ hoặc không tồn tại trong transformationTypes
    return <div>Loại biến đổi không hợp lệ</div>;
  }  
  
  return (
    <>
      <Header title={transformation.title}
        subTitle = {transformation.subTitle}
      />

      <TranformationForm/>
    </>
  )
}

export default CreateTransformationPage
