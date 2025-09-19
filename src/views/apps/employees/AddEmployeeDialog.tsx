'use client'

// React Imports

import { useState } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'

// Server Actions
import { uploadFile } from '@/app/server/file-upload'

// Type Imports
import type { Employee, EmployeeFormData } from '@/types/apps/employeeTypes'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import DialogCloseButton from '@components/dialogs/DialogCloseButton'
import { createEmployee } from '@/app/server/actions'
import ImageUpload from '@/components/image-upload/ImageUpload'
import { errorHandler } from '@/libs/errorhandler'
import { errorToast } from '@/libs/errortoast'

type Props = {
  open: boolean
  handleClose: () => void
  onAddEmployee: (employee: Employee) => void
}

const AddEmployeeDialog = ({ open, handleClose, onAddEmployee }: Props) => {
  // States
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [currentAvatar, setCurrentAvatar] = useState<string>('')

  // Hooks
  const {
    control,
    reset: resetForm,
    handleSubmit,
    formState: { errors }
  } = useForm<EmployeeFormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: 'employee' as const
    }
  })

  const onSubmit = async (data: EmployeeFormData) => {
    setIsSubmitting(true)

    try {
      // Use the already uploaded avatar or a default one
      const avatarUrl = currentAvatar || `/images/avatars/${Math.floor(Math.random() * 20) + 1}.png`

      const newEmployee: Omit<Employee, 'id' | 'accountStatus' | 'createdAt'> & { password: string } = {
        fname: data.firstName,
        lname: data.lastName,
        email: data.email,
        password: data.password,
        role: data.role,
        avatar: avatarUrl
      }

      const res = await createEmployee(newEmployee)

      onAddEmployee(res.user)

      // Show success toast
      toast.success('Employee added successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      })

      // Reset form and close dialog
      resetForm()
      handleClose()
    } catch (error: unknown) {
      const message = errorHandler(error)

      errorToast(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setAvatarFile(null)
    setCurrentAvatar('')
    setUploadProgress(0)
    setIsUploading(false)
    resetForm()
    handleClose()
  }

  return (
    <Dialog
      fullWidth
      maxWidth='sm'
      open={open}
      onClose={handleReset}
      scroll='body'
      closeAfterTransition={false}
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <DialogCloseButton onClick={handleReset} disableRipple>
        <i className='bx-x' />
      </DialogCloseButton>

      <DialogTitle className='text-center p-6 border-b'>
        <div className='flex flex-col gap-1'>
          <Typography variant='h4' className='font-bold text-textPrimary'>
            Add New Employee
          </Typography>
          <Typography variant='body2' className='text-textSecondary'>
            Fill in the details to create a new employee account
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
            name='password'
            control={control}
            rules={{
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters'
              }
            }}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                type={isPasswordShown ? 'text' : 'password'}
                slotProps={{
                  input: {
                    startAdornment: <i className='bx-lock-alt text-xl text-textSecondary mr-2' />,
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onMouseDown={e => e.preventDefault()}
                          onClick={() => setIsPasswordShown(!isPasswordShown)}
                        >
                          <i className={isPasswordShown ? 'bx-hide' : 'bx-show'} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                }}
                {...(errors.password && { error: true, helperText: errors.password.message })}
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

                  setAvatarFile(file)
                  setIsUploading(true)
                  setUploadProgress(0)

                  try {
                    const uploadResponse = await uploadFile(file)

                    setCurrentAvatar(uploadResponse.url)
                    setUploadProgress(100)
                  } catch (error) {
                    console.error('Error uploading avatar:', error)
                    toast.error('Failed to upload avatar. Please try again.', {
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
                label={isUploading ? 'Uploading...' : 'Upload Photo'}
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

          <DialogActions className='p-4 border-t gap-3'>
            <Button variant='outlined' color='secondary' onClick={handleReset} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type='submit'
              variant='contained'
              className='shadow-sm'
              disabled={isSubmitting}
              endIcon={isSubmitting ? <i className='bx-loader bx-spin' /> : null}
            >
              {isSubmitting ? 'Adding...' : 'Add Employee'}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddEmployeeDialog
