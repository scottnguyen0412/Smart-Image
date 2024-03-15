"use client";

import { useTransition } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteImage } from "@/lib/actions/image.actions";

import { Button } from "../ui/button";

export const DeleteConfirm = ({ imageId }: { imageId: string }) => {
    const [isPending, startTransition] = useTransition();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild className="w-full rounded-full">
        <Button
          type="button"
          className="button h-[44px] w-full md:h-[54px]"
          variant="destructive"
        >
          Xoá Ảnh
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="flex flex-col gap-10">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Bạn Có Chắc Chắn Muốn Xoá Ảnh Này?
          </AlertDialogTitle>
          <AlertDialogDescription className="p-16-regular">
            Thao tác này sẽ xóa vĩnh viễn hình ảnh này
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Huỷ Bỏ</AlertDialogCancel>
          <AlertDialogAction
            className="border bg-red-500 text-white hover:bg-red-600"
            onClick={() =>
              startTransition(async () => {
                await deleteImage(imageId);
              })
            }
          >
            {isPending ? "Đang Xoá..." : "Xoá"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
