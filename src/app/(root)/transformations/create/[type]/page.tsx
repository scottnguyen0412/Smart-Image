import Header from '@/components/shared/Header'
import React from 'react'
import { transformationTypes } from '@/constants'
import { redirect } from 'next/navigation'
import TranformationForm from '@/components/shared/TranformationForm'
import { auth } from '@clerk/nextjs'
import { getUserById } from '@/lib/actions/user.actions'
const CreateTransformationPage = async ({ params: { type } }: SearchParamProps) => {

  // console.log(params);
  
  // get current params
  // const {type} = useParams();
    // Sử dụng keyof typeof transformationTypes để chỉ định kiểu dữ liệu cho type
    // Vì type có kiểu là "string" nên không nên index được
  // const transformation = transformationTypes[type as keyof typeof transformationTypes];
  
  
  const transformation = transformationTypes[type];

  if (!transformation) {
    // Xử lý khi giá trị type không hợp lệ hoặc không tồn tại trong transformationTypes
    return <div>Loại biến đổi không hợp lệ</div>;
  }  
  
  const {userId} = auth();
  // console.log(userId);

  if(!userId){
    return redirect('/sign-in');
  }
  // lấy user id của clerk và kiểm tra với user id trong database
  const user = await getUserById(userId);
  return (
    <>
      <Header title={transformation.title}
        subTitle = {transformation.subTitle}
      />

    <section className='mt-10 '>
      <TranformationForm action='Add' userId={user._id}
        type={transformation.type as TransformationTypeKey}
        creditBalance={user.creditBalance}/>
    </section>
    </>
  )
}

export default CreateTransformationPage
