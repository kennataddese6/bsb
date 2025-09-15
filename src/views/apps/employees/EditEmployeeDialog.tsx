'use client'

// React Imports
import { useState, useEffect } from 'react'

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
import type { Employee, EditEmployeeFormData } from '@/types/apps/employeeTypes'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import DialogCloseButton from '@components/dialogs/DialogCloseButton'
import { updateEmployee } from '@/app/server/actions'
import ImageUpload from '@/components/image-upload/ImageUpload'
import { errorHandler } from '@/libs/errorhandler'
import { errorToast } from '@/libs/errortoast'

type Props = {
  open: boolean
  handleClose: () => void
  employee: Employee | null
  onUpdateEmployee: (employeeId: number, updatedData: Partial<Employee>) => void
}

const EditEmployeeDialog = ({ open, handleClose, employee, onUpdateEmployee }: Props) => {
  // States
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [currentAvatar, setCurrentAvatar] = useState<string>('')

  // Hooks
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

  // Update form when employee changes
  useEffect(() => {
    if (employee) {
      resetForm({
        firstName: employee.fname,
        lastName: employee.lname,
        email: employee.email,
        role: employee.role as 'user' | 'admin'
      })
      setCurrentAvatar(employee.avatar || '')
    }
  }, [employee, resetForm])

  const onSubmit = async (data: EditEmployeeFormData) => {
    if (!employee) return

    setIsSubmitting(true)
    const avatarUrl = currentAvatar // Already uploaded in the onChange handler

    try {
      const updatedEmployee = {
        fname: data.firstName,
        lname: data.lastName,
        email: data.email,
        role: data.role,
        avatar: avatarUrl,
        id: employee.id,
        accountStatus: 'active' as const
      }

      await updateEmployee(updatedEmployee)

      onUpdateEmployee(employee.id, updatedEmployee)

      // Show success toast
      toast.success('Employee updated successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      })

      // Close dialog
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
    setUploadProgress(0)
    setIsUploading(false)
    handleClose()
  }

  if (!employee) return null

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
            Edit Employee
          </Typography>
          <Typography variant='body2' className='text-textSecondary'>
            Update the employee&apos;s information below
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
          onClick={handleReset}
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
          {isSubmitting ? 'Updating...' : 'Update Employee'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditEmployeeDialog
