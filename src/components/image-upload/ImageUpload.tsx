'use client'

// React Imports
import { useState, useCallback, useRef } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import { styled, useTheme } from '@mui/material/styles'

// Type Imports
import type { ThemeColor } from '@core/types'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif']

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
  opacity: 0
})

type ImageUploadProps = {
  value?: string
  onChange: (file: File | null) => void
  disabled?: boolean
  avatarSize?: number
  label?: string
  error?: boolean
  helperText?: string
  color?: ThemeColor
  className?: string
}

const ImageUpload = ({
  value,
  onChange,
  disabled = false,
  avatarSize = 100,
  label = 'Upload Photo',
  error = false,
  helperText,
  color = 'primary',
  className = ''
}: ImageUploadProps) => {
  // States
  const [preview, setPreview] = useState<string | null>(value || null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const theme = useTheme()

  // Handle file validation
  const validateFile = (file: File): { isValid: boolean; error?: string } => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return {
        isValid: false,
        error: 'Invalid file type. Please upload a JPEG, PNG, or WebP image.'
      }
    }

    if (file.size > MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: 'File is too large. Maximum size is 5MB.'
      }
    }

    return { isValid: true }
  }

  // Handle file selection
  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]

      if (!file) {
        return
      }

      const { isValid, error } = validateFile(file)

      if (!isValid && error) {
        setUploadError(error)

        return
      }

      setUploadError(null)
      const reader = new FileReader()

      reader.onloadstart = () => {
        // Could add loading state here if needed
      }

      reader.onloadend = () => {
        setPreview(reader.result as string)
        onChange(file)
      }

      reader.onerror = () => {
        setUploadError('Error reading file. Please try again.')
      }

      reader.readAsDataURL(file)
    },
    [onChange]
  )

  // Handle drag and drop events
  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (disabled) return
      setIsDragging(true)
    },
    [disabled]
  )

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      if (disabled) {
        return
      }

      const file = e.dataTransfer.files?.[0]

      if (!file) {
        return
      }

      const { isValid, error } = validateFile(file)

      if (!isValid && error) {
        setUploadError(error)

        return
      }

      setUploadError(null)
      const reader = new FileReader()

      reader.onloadend = () => {
        setPreview(reader.result as string)
        onChange(file)
      }

      reader.readAsDataURL(file)
    },
    [disabled, onChange]
  )

  // Handle remove image
  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      setPreview(null)
      setUploadError(null)
      onChange(null)

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    },
    [onChange]
  )

  // Handle button click to trigger file input
  const handleButtonClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }, [])

  // Determine border color based on state
  const getBorderColor = () => {
    if (error || uploadError) {
      return theme.palette.error.main
    }

    if (isDragging) {
      return theme.palette.primary.main
    }

    if (preview) {
      return 'transparent'
    }

    return theme.palette.divider
  }

  return (
    <Box
      className={`flex flex-col w-full ${className}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Box className='flex flex-col sm:flex-row items-center gap-6 w-full'>
        <Tooltip title={preview ? 'Click to change' : 'Drag & drop or click to upload'} placement='top' arrow>
          <Box
            className='relative cursor-pointer flex-shrink-0'
            onClick={handleButtonClick}
            sx={{
              '&:hover .MuiAvatar-root': {
                borderColor: isDragging || error || uploadError ? theme.palette.error.main : theme.palette.primary.main,
                transform: 'scale(1.02)',
                transition: 'all 0.3s ease'
              }
            }}
          >
            <Avatar
              src={preview || '/images/avatars/placeholder.png'}
              alt='Profile'
              sx={{
                width: avatarSize,
                height: avatarSize,
                border: `2px ${preview ? 'solid' : 'dashed'}`,
                borderColor: getBorderColor(),
                transition: 'all 0.3s ease',
                backgroundColor: preview ? 'transparent' : 'action.hover'
              }}
            />
            {preview && (
              <Button
                variant='contained'
                color='error'
                size='small'
                onClick={handleRemove}
                className='absolute -top-2 -right-2 min-w-0 w-8 h-8 rounded-full p-0 shadow-md'
                sx={{
                  '&:hover': {
                    transform: 'scale(1.1)'
                  },
                  transition: 'transform 0.2s ease'
                }}
              >
                <i className='bx-x text-lg' />
              </Button>
            )}
            {isDragging && (
              <Box
                className='absolute inset-0 rounded-full flex items-center justify-center bg-black bg-opacity-50'
                sx={{
                  '&::after': {
                    content: '"Drop image here"',
                    color: 'white',
                    fontWeight: 600,
                    textAlign: 'center',
                    p: 2
                  }
                }}
              />
            )}
          </Box>
        </Tooltip>

        <Box className='flex-1 w-full max-w-[400px]'>
          <Button
            component='label'
            variant='outlined'
            color={error || uploadError ? 'error' : color}
            disabled={disabled}
            startIcon={<i className='bx bx-upload' />}
            className='relative w-full'
            sx={{
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 3
              },
              transition: 'all 0.2s ease',
              justifyContent: 'flex-start',
              textAlign: 'left',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {label}
            <VisuallyHiddenInput
              ref={fileInputRef}
              type='file'
              accept={ALLOWED_FILE_TYPES.join(',')}
              onChange={handleFileChange}
              disabled={disabled}
            />
          </Button>

          <Typography variant='caption' className='text-textSecondary mt-2 block'>
            Allowed JPG, PNG or WebP. Max size of 5MB
          </Typography>

          {(error || uploadError || helperText) && (
            <Typography
              variant='caption'
              color={error || uploadError ? 'error' : 'textSecondary'}
              className='mt-1 block'
              sx={{
                maxWidth: '100%',
                whiteSpace: 'normal',
                wordBreak: 'break-word'
              }}
            >
              {uploadError || helperText}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default ImageUpload
