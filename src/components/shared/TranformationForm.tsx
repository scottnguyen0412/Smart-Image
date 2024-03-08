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
  
import { aspectRatioOptions, defaultValues, transformationTypes } from "@/constants"
import { CustomField } from "./CustomField"
import { useState } from "react"
import { AspectRatioKey } from "@/lib/utils"
import { config } from "process"

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
    const [isTransforming,  setIsTransforming] = useState(false);

    const [transformationConfig, setTransformationConfig] = useState(config)
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
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

    // handle select field
    const onSelectField = (value: string, onChangeField: (value: string) => void) => {
        // get image size
        // ép kiểu value sang key
        const imageSize = aspectRatioOptions[value as AspectRatioKey];

        setImage((prev: any) => {
            // return object
            return({
                // get value previoú and update new value
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
            
        }

    // handle tranform
    const onTranformHandle = () => {}
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <CustomField control={form.control} name="title" 
        formLabel="Image Title"
        render={({field}) => <Input {...field} className="input-field"/>}
        />
        {/* Display with type is fill */}
        {type === 'fill' && (
            <CustomField 
                control={form.control}
                name="aspectRatio"
                formLabel="Aspect Ratio"
                className="w-full"
                render={({field}) => (
                <Select onValueChange={(value) => onSelectField(value, field.onChange)}>
                    <SelectTrigger className="select-field">
                        <SelectValue placeholder="Select size" />
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
                    formLabel={ type === 'remove' ? 'Object to Remove' : 'Object to Recolor'}
                    className="w-full"
                    render={({field}) => ( 
                    <Input value={field.value} className="input-field"
                        onChange={(e) => onInputChangeHandle('prompt', e.target.value, 
                                    type, field.onChange)}/>
                    )}
                />
            {type === 'recolor' && (
                <CustomField control={form.control} name="color" 
                formLabel="Replacement Color"
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

        <div className="flex flex-col gap-4">

        <Button type="button" className="submit-button capitalize" 
        disabled={isTransforming || newTransformation === null}
        onClick={onTranformHandle}
        >{isSubmitting ? 'Tranforming...' : 'Apply Tranformation'}</Button>

        <Button type="submit" className="submit-button capitalize" 
        // disable when user is submitting
        disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Save Image'}</Button>
        </div>

      </form>
    </Form>
  )
}

export default TranformationForm