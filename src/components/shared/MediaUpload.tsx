'use client';

import { useToast } from "../ui/use-toast"
import { CldImage, CldUploadWidget } from 'next-cloudinary';
import Image from "next/image";
import { dataUrl, getImageSize } from "@/lib/utils";
import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";

type MediaUploadProps = {
    onValueChange: (value: string) => void;
    setImage: React.Dispatch<any>;
    publicId: string;
    image: any;
    type: string;
}

const MediaUpload = ({onValueChange, setImage, image, publicId, type}: MediaUploadProps) => {
    const { toast } = useToast();
 
    const onUploadSuccessHandle = (result: any) => {
        setImage((prev: any) => {
            return({
                ...prev,
                publicId: result?.info?.public_Id,
                width: result?.info?.width,
                height: result?.info?.height,
                secureUrl: result?.info?.secure_url
            })
        })
        onValueChange(result?.info?.public_id)

        toast({
            title: 'Hình Ảnh Đã được Tải Lên Thành Công',
            description: '1 Tín Dụng đã được trừ khỏi tài khoản của bạn',
            duration: 5000,
            className: 'success-toast',
            
        })
    }

    const onUploadErrorHanlde = () => {
        toast({
            title: 'Opps! Đã có lỗi xảy ra trong quá trình upload',
            description: 'Vui Lòng Thử lại lần nữa',
            duration: 5000,
            className: 'error-toast',

        })
    }

    return (
    <CldUploadWidget uploadPreset="AI-SmartImage"
        options={{
            multiple: false,
            resourceType: 'image',
        }}
        onSuccess={onUploadSuccessHandle}
        onError={onUploadErrorHanlde}
    >
        {({open}) => {
            return (
                <div className="flex flex-col gap-4">
                    <h3 className="h3-bold text-dark-600">Nguyên Bản</h3>
                    {publicId ? (
                        <>
                            <div className="cursor-pointer 
                            overflow-hidden rounded-[10px]">
                                <CldImage width={getImageSize(type, image, 'width')}
                                    height={getImageSize(type, image, 'height')}
                                    src={publicId}
                                    alt="image"
                                    sizes={"(max-width: 767px) 100vw, 50vw"}
                                    placeholder={dataUrl as PlaceholderValue}
                                    className="media-uploader_cldImage"
                                />
                            </div>
                        </>
                    ) : (
                        <div className="media-uploader_cta" onClick={() => open()}>
                            <div className="media-uploader_cta-image">
                                <Image src="/assets/icons/add.svg" alt="Add Image"
                                    width={24} height={24}
                                />
                            </div>
                            <p className="p-14-medium">Nhấp Để Tải Ảnh Lên</p>
                        </div>
                    )}
                </div>
            )
        }}
    </CldUploadWidget>
    )
}

export default MediaUpload
