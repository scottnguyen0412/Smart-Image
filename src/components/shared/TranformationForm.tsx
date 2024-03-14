"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Form,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  
import { aspectRatioOptions, creditFee, defaultValues, transformationTypes } from "@/constants"
import { CustomField } from "./CustomField"
import { useEffect, useState, useTransition } from "react"
import { AspectRatioKey, debounce, deepMergeObjects } from "@/lib/utils"
import { updateCredits } from "@/lib/actions/user.actions"
import MediaUpload from "./MediaUpload"
import TransformedImage from "./TransformedImage"
import { getCldImageUrl } from "next-cloudinary"
import { addImage, updateImage } from "@/lib/actions/image.actions"
import { useRouter } from "next/navigation"
import { NotEnoughCreditsModal } from "./NotEnoughCreditsModal"


export const formSchema = z.object({
    title: z.string(),
    aspectRatio: z.string().optional(),
    color: z.string().optional(),
    prompt: z.string().optional(),
    publicId: z.string(),
})

const TranformationForm = ({action, data = null, 
    userId, type, creditBalance, config = null } : TransformationFormProps) => {

    const TranformationTypes = transformationTypes[type];

    const [image, setImage] = useState(data);
    const [newTransformation, setNewTransformation] = useState<Transformations | null>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isTransforming, setIsTransforming] = useState(false);

    const [transformationConfig, setTransformationConfig] = useState(config)

    const [isPending, startTransition] = useTransition()

    const router = useRouter();
    // 1. Define your form.
        
    // if you create new image then have empty blank form
    // However if you updated image, it will be take old data and fill to box
    const initValue = data && action === 'Update' ? {
        title: data?.title,
        aspectRatio: data?.aspectRatio,
        color: data?.color,
        prompt: data?.prompt,
        publicId: data?.publicId,
    } : defaultValues
    const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initValue
  })
 
  // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setIsSubmitting(true);
    if(data || image) {
        // get image from cloudinary
        const transformationURL = getCldImageUrl({
            width: image?.width,
            height: image?.height,
            src: image?.publicId,
            ...transformationConfig
        });

        const imageData = {
            title: values.title,
            publicId: image?.publicId,
            transformationType: type,
            width: image?.width,
            height: image?.height,
            config: transformationConfig,
            secureURL: image?.secureURL,
            transformationURL,
            aspectRatio: values.aspectRatio,
            prompt: values.prompt,
            color: values.color
        }
        // action add image
        if(action === 'Add') {
            try {
                const newImage = await addImage({
                    image: imageData,
                    userId,
                    path: '/'
                })

                if(newImage){
                    form.reset();
                    setImage(data);
                    router.push(`/transformations/${newImage._id}`)
                }
            } catch (error) {
                console.log(error);
                
            }
        }

        // action update image
        if(action === 'Update') {
            try {
                const updatedImage = await updateImage({
                    image: {
                        ...imageData,
                        _id: data._id
                    },
                    userId,
                    path: `/transformations/${data._id}`
                })

                if(updatedImage){
                    router.push(`/transformations/${updatedImage._id}`)
                }
            } catch (error) {
                console.log(error);
                
            }
        }
    }
    setIsSubmitting(false);
    // console.log(values)
  }

    // handle select field
    const onSelectField = (value: string, onChangeField: (value: string) => void) => {
        // get image size
        // ép kiểu value sang key
        const imageSize = aspectRatioOptions[value as AspectRatioKey];

        setImage((prev: any) => {
            // return object
            return ({
                // get value previous and update new value
                ...prev,
                aspecRatio: imageSize.aspectRatio,
                width: imageSize.width,
                height: imageSize.height
            })
        })

        setNewTransformation(TranformationTypes.config);
        return onChangeField(value);
    }

    // handle remove or recolor object
    const onInputChangeHandle = (fieldName: string, value: string, 
        type: string, onChangeField: (value: string) => void) =>  {
            debounce(() => {
                setNewTransformation((prev: any) => ({
                    ...prev,
                    [type]: {
                        ...prev?.[type],
                        [fieldName === 'prompt' ? 'prompt':'to'] : value
                    } 
                }))
            }, 1000);
            return onChangeField(value);
        }

    // handle tranform with credit fee
    const onTranformHandle = async () => {
        setIsTransforming(true);
        setTransformationConfig(
            deepMergeObjects(newTransformation, transformationConfig)
        )
        setNewTransformation(null)
        startTransition(async () => {
            await updateCredits(userId, creditFee);
        })
    }

    useEffect(() => {
        if(image && (type === 'restore' || type === 'removeBackground'))
        {
            setNewTransformation(TranformationTypes.config);
        }
    },[image, TranformationTypes.config, type]);
    
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {creditBalance < Math.abs(creditFee) && <NotEnoughCreditsModal/>}
        <CustomField control={form.control} name="title" 
        formLabel="Tiêu Đề Ảnh"
        render={({field}) => <Input {...field} className="input-field"/>}
        />
        {/* Display with type is fill */}
        {type === 'fill' && (
            <CustomField 
                control={form.control}
                name="aspectRatio"
                formLabel="Tỷ lệ khung hình"
                className="w-full"
                render={({field}) => (
                <Select onValueChange={(value) => onSelectField(value, field.onChange)} 
                    value={field.value}>
                    <SelectTrigger className="select-field">
                        <SelectValue placeholder="Lựa Chọn Kích Thước" />
                    </SelectTrigger>
                    <SelectContent>
                        {/* Trả về một mảng với các key vd: ["1.1", "4.3", "16.9"] */}
                        {Object.keys(aspectRatioOptions).map((key) => {
                            return (
                                <SelectItem key={key} value={key}
                                    className="select-item"
                                >
                                    {/* as sử dụng để ép kiểu key sang AspectRatioKey */}
                                    {aspectRatioOptions[key as AspectRatioKey].label} 
                                </SelectItem>
                            )
                        })}
                    </SelectContent>
                </Select>
            )} />
        )}

        {/* Display with type is remove and recolor */}
        {(type === 'remove' || type === 'recolor') && (
            <div className="prompt-field">
                <CustomField 
                    control={form.control}
                    name="prompt"
                    formLabel={ type === 'remove' ? 'Vật Thể Cần Loại Bỏ' : 'Vật Thể Cần Đổi Màu'}
                    className="w-full"
                    render={({field}) => ( 
                    <Input value={field.value} className="input-field"
                        onChange={(e) => onInputChangeHandle('prompt', e.target.value, 
                                    type, field.onChange)}/>
                    )}
                />
            {type === 'recolor' && (
                <CustomField control={form.control} name="color" 
                formLabel="Màu Sắc Thay Thế"
                className="w-full"
                render={({field}) => (
                    <Input value={field.value} className="input-field"
                        onChange={(e) => onInputChangeHandle('color', e.target.value, 
                                    'recolor', field.onChange)}/>
                    )}
                />
            )}
            </div>
        )}

        {/* upload image */}
        <div className="media-uploader-field">
            <CustomField
                control={form.control}
                name="publicId"
                className="flex size-full flex-col"
                render={({field}) => (
                    <MediaUpload
                        onValueChange = {field.onChange}
                        setImage={setImage}
                        publicId={field.value}
                        image={image}
                        type={type}
                    />
                )}
            />
            <TransformedImage 
                image={image}
                type={type}
                title={form.getValues().title}
                isTransforming = {isTransforming}
                setIsTransforming = {setIsTransforming}
                transformationConfig = {transformationConfig}
            />
        </div>


        {/* apply and submit button */}
        <div className="flex flex-col gap-4">
            <Button type="button" className="submit-button capitalize" 
            disabled={isTransforming || newTransformation === null}
            onClick={onTranformHandle}
            >{isTransforming ? 'Tranforming...' : 'Apply Tranformation'}</Button>

            <Button type="submit" className="submit-button capitalize" 
            // disable when user is submitting
            disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Save Image'}</Button>
        </div>

      </form>
    </Form>
  )
}

export default TranformationForm
