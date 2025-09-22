'use client'

// React Imports
import { useState, useEffect } from 'react'

// Next Auth Imports
import { useSession } from 'next-auth/react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'

// Server Actions
import { uploadFile } from '@/app/server/file-upload'

// Type Imports

import type { EditEmployeeFormData } from '@/types/apps/employeeTypes'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import DialogCloseButton from '@components/dialogs/DialogCloseButton'
import ImageUpload from '@/components/image-upload/ImageUpload'
import { updateProfile } from '@/app/server/actions'
import { errorHandler } from '@/libs/errorhandler'
import { errorToast } from '@/libs/errortoast'

type Props = {
  open: boolean
  handleClose: () => void

  // onUpdateProfile: (updatedData: { firstName: string; lastName: string; email: string; avatar?: string }) => Promise<void>
}

const UpdateProfileDialog = ({ open, handleClose /* onUpdateProfile */ }: Props) => {
  const { data: session, update } = useSession()

  // Get employee data from session
  const employee = session?.user
    ? {
        id: parseInt(session.user.id || '0'),
        fname: session.user.name?.split(' ')[0] || '',
        lname: session.user.name?.split(' ').slice(1).join(' ') || '',
        email: session.user.email || '',
        role: (session.user.role as 'user' | 'admin') || 'user',
        avatar: session.user.avatar || session.user.image || '',
        accountStatus: 'active',
        createdAt: new Date().toISOString()
      }
    : null

  // States
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [currentAvatar, setCurrentAvatar] = useState<string>('')

  // Form handling
  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors }
  } = useForm<EditEmployeeFormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      role: 'user' as const
    }
  })

  // Update form when session changes
  useEffect(() => {
    if (session?.user) {
      resetForm({
        firstName: session.user.name?.split(' ')[0] || '',
        lastName: session.user.name?.split(' ').slice(1).join(' ') || '',
        email: session.user.email || '',
        role: (session.user.role as 'user' | 'admin') || 'user'
      })

      // Use avatar if available, otherwise fall back to image
      setCurrentAvatar(session.user.avatar || session.user.image || '')
    }
  }, [session, resetForm])

  const handleCloseDialog = () => {
    setAvatarFile(null)
    setUploadProgress(0)
    setIsUploading(false)
    handleClose()

    if (session?.user) {
      resetForm({
        firstName: session.user.name?.split(' ')[0] || '',
        lastName: session.user.name?.split(' ').slice(1).join(' ') || '',
        email: session.user.email || '',
        role: (session.user.role as 'user' | 'admin') || 'user'
      })

      // Reset to the original avatar from session
      setCurrentAvatar(session.user.avatar || session.user.image || '')
    }
  }

  const onSubmit = async (data: EditEmployeeFormData) => {
    if (!employee) return
    setIsSubmitting(true)
    const avatarUrl = currentAvatar

    try {
      // Upload new avatar if a file was selected
      setIsUploading(true)
      setUploadProgress(0)

      try {
        const updatedProfile = {
          fname: data.firstName,
          lname: data.lastName,
          email: data.email,
          role: data.role,
          avatar: avatarUrl,
          id: employee.id,
          accountStatus: 'active' as const
        }

        const profile = await updateProfile(updatedProfile)

        if (profile.errorMessage) {
          throw new Error(profile.errorMessage)
        }

        update({
          name: `${profile.user.fname} ${profile.user.lname}`,
          email: profile.user.email,
          role: profile.user.role,
          id: profile.user.id,
          avatar: avatarUrl
        })

        setCurrentAvatar(avatarUrl)
        handleClose()
        setUploadProgress(100)
      } catch (error: unknown) {
        const message = errorHandler(error)

        errorToast(message)
      } finally {
        setIsUploading(false)
      }
    } catch (error) {
      console.error('Error in form submission:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!employee) return null

  return (
    <Dialog
      fullWidth
      maxWidth='sm'
      open={open}
      onClose={handleCloseDialog}
      scroll='body'
      closeAfterTransition={false}
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <DialogCloseButton onClick={handleCloseDialog} disableRipple>
        <i className='bx-x' />
      </DialogCloseButton>

      <DialogTitle className='text-center p-6 border-b'>
        <div className='flex flex-col gap-1'>
          <Typography variant='h4' className='font-bold text-textPrimary'>
            Update Profile
          </Typography>
          <Typography variant='body2' className='text-textSecondary'>
            Update your profile information below
          </Typography>
        </div>
      </DialogTitle>

      <DialogContent className='p-6'>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <Controller
              name='firstName'
              control={control}
              rules={{ required: 'First name is required' }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='First Name'
                  placeholder='John'
                  slotProps={{
                    input: {
                      startAdornment: <i className='bx-user text-xl text-textSecondary mr-2' />
                    }
                  }}
                  {...(errors.firstName && { error: true, helperText: errors.firstName.message })}
                />
              )}
            />
            <Controller
              name='lastName'
              control={control}
              rules={{ required: 'Last name is required' }}
              render={({ field }) => (
                <CustomTextField
                  {...field}
                  fullWidth
                  label='Last Name'
                  placeholder='Doe'
                  slotProps={{
                    input: {
                      startAdornment: <i className='bx-user text-xl text-textSecondary mr-2' />
                    }
                  }}
                  {...(errors.lastName && { error: true, helperText: errors.lastName.message })}
                />
              )}
            />
          </div>

          <Controller
            name='email'
            control={control}
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            }}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                type='email'
                label='Email'
                placeholder='john.doe@company.com'
                slotProps={{
                  input: {
                    startAdornment: <i className='bx-envelope text-xl text-textSecondary mr-2' />
                  }
                }}
                {...(errors.email && { error: true, helperText: errors.email.message })}
              />
            )}
          />

          <Controller
            name='role'
            control={control}
            rules={{ required: 'Role is required' }}
            render={({ field }) => (
              <CustomTextField
                select
                fullWidth
                label='Role'
                {...field}
                slotProps={{
                  input: {
                    startAdornment: <i className='bx-shield text-xl text-textSecondary mr-2' />
                  }
                }}
                {...(errors.role && { error: true, helperText: errors.role.message })}
              >
                <MenuItem value='employee'>
                  <div className='flex items-center gap-2'>
                    <i className='bx-user text-lg text-success' />
                    <span>Employee</span>
                  </div>
                </MenuItem>
                <MenuItem value='admin'>
                  <div className='flex items-center gap-2'>
                    <i className='bx-crown text-lg text-error' />
                    <span>Admin</span>
                  </div>
                </MenuItem>
              </CustomTextField>
            )}
          />

          <div className='w-full py-4 border-t border-gray-100 mt-2'>
            <Typography variant='subtitle2' className='text-textSecondary mb-4'>
              Profile Photo
            </Typography>
            <div className='w-full'>
              <ImageUpload
                value={avatarFile ? URL.createObjectURL(avatarFile) : currentAvatar}
                onChange={async file => {
                  if (!file) {
                    setAvatarFile(null)
                    setCurrentAvatar('')

                    return
                  }

                  try {
                    setIsUploading(true)
                    setUploadProgress(30)

                    // Upload the file
                    const response = await uploadFile(file)

                    if (response?.url) {
                      setCurrentAvatar(response.url)
                      setUploadProgress(100)
                    }

                    setAvatarFile(file)
                  } catch (error) {
                    console.error('Error uploading file:', error)
                    toast.error('Failed to upload image. Please try again.', {
                      position: 'top-right',
                      autoClose: 3000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true
                    })
                  } finally {
                    setIsUploading(false)
                  }
                }}
                avatarSize={100}
                label={isUploading ? 'Uploading...' : 'Change Photo'}
                disabled={isUploading || isSubmitting}
                helperText={
                  isUploading
                    ? `Uploading... ${Math.round(uploadProgress)}%`
                    : 'Drag & drop an image or click to select (max 5MB)'
                }
                color={isUploading ? 'secondary' : 'primary'}
                className={isUploading ? 'opacity-70' : ''}
              />
            </div>
          </div>
        </form>
      </DialogContent>

      <DialogActions className='p-4 border-t gap-3'>
        <Button
          variant='outlined'
          color='secondary'
          onClick={handleCloseDialog}
          disabled={isSubmitting}
          className='hover:shadow-md transition-all duration-200'
          startIcon={<i className='bx-x' />}
        >
          Cancel
        </Button>
        <Button
          variant='contained'
          className='shadow-sm hover:shadow-md transition-all duration-200'
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          startIcon={isSubmitting ? <i className='bx-loader-alt animate-spin' /> : <i className='bx-edit' />}
        >
          {isSubmitting ? 'Updating...' : 'Update Profile'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default UpdateProfileDialog
