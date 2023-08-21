import React, { useRef, useState } from 'react'
import { toast } from 'react-toastify'
import config from 'src/constants/config'

interface Props {
  onChange?: (file: File) => void
}

export default function InputFile({ onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileFromLocal = e.target.files?.[0]

    if (
      fileFromLocal &&
      (fileFromLocal?.size >= config.maxSizeUploadAvatar || !fileFromLocal?.type.includes('image'))
    ) {
      toast.error('Maximum size 1MB. Format: .JPEG, .PNG')
      return
    }

    fileFromLocal && onChange && onChange(fileFromLocal)
  }

  const handleUpload = () => {
    fileInputRef.current?.click()
  }

  return (
    <>
      <input
        type='file'
        className='hidden'
        accept='.jpg,.jpeg,.pgn'
        ref={fileInputRef}
        onChange={onFileChange}
        onClick={(event) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(event.target as any).value = null
        }}
      />
      <button
        type='button'
        className='flex h-10 items-center justify-end rounded-sm border bg-white px-6 text-sm text-gray-600 shadow-sm'
        onClick={handleUpload}
      >
        Choose image
      </button>
    </>
  )
}
