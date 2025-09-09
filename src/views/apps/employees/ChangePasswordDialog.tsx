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

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'

// Type Imports
import type { Employee, ChangePasswordFormData } from '@/types/apps/employeeTypes'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import DialogCloseButton from '@components/dialogs/DialogCloseButton'
import { changePassword } from '@/app/server/actions'

type Props = {
  open: boolean
  handleClose: () => void
  employee: Employee | null
  onChangePassword: (employeeId: number, newPassword: string) => void
}

const ChangePasswordDialog = ({ open, handleClose, employee, onChangePassword }: Props) => {
  // States
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Hooks
  const {
    control,
    reset: resetForm,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<ChangePasswordFormData>({
    defaultValues: {
      newPassword: '',
      confirmPassword: ''
    }
  })

  const newPassword = watch('newPassword')

  const onSubmit = async (data: ChangePasswordFormData) => {
    if (!employee) return

    setIsSubmitting(true)

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      const newData = {
        password: data.newPassword,
        userId: employee.id
      }

      changePassword(newData)

      onChangePassword(employee.id, data.newPassword)

      // Show success toast
      toast.success('Password changed successfully!', {
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
    } catch (error) {
      toast.error('Failed to change password. Please try again.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    handleClose()
    resetForm()
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

      <DialogTitle variant='h4' className='flex gap-3 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        <div className='flex items-center justify-center gap-3'>
          <div className='p-2 bg-secondary-lighter rounded-lg'>
            <i className='bx-lock-alt text-2xl text-secondary' />
          </div>
          <div>
            <Typography variant='h4' className='font-bold'>
              Change Password
            </Typography>
            <Typography component='span' className='text-textSecondary'>
              Update password for {employee.fname} {employee.lname}
            </Typography>
          </div>
        </div>
      </DialogTitle>

      <DialogContent className='pbs-0 sm:pli-16 sm:pbe-16'>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
          <Controller
            name='newPassword'
            control={control}
            rules={{
              required: 'New password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters'
              }
            }}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                type='password'
                label='New Password'
                placeholder='Enter new password'
                slotProps={{
                  input: {
                    startAdornment: <i className='bx-lock-alt text-xl text-textSecondary mr-2' />
                  }
                }}
                {...(errors.newPassword && { error: true, helperText: errors.newPassword.message })}
              />
            )}
          />

          <Controller
            name='confirmPassword'
            control={control}
            rules={{
              required: 'Please confirm your password',
              validate: value => value === newPassword || 'Passwords do not match'
            }}
            render={({ field }) => (
              <CustomTextField
                {...field}
                fullWidth
                type='password'
                label='Confirm Password'
                placeholder='Confirm new password'
                slotProps={{
                  input: {
                    startAdornment: <i className='bx-check-circle text-xl text-textSecondary mr-2' />
                  }
                }}
                {...(errors.confirmPassword && { error: true, helperText: errors.confirmPassword.message })}
              />
            )}
          />
        </form>
      </DialogContent>

      <DialogActions className='justify-center gap-4 pbs-0 sm:pli-16 sm:pbe-16'>
        <Button
          variant='tonal'
          color='error'
          onClick={handleReset}
          disabled={isSubmitting}
          className='hover:shadow-md transition-all duration-200'
          startIcon={<i className='bx-x' />}
        >
          Cancel
        </Button>
        <Button
          variant='contained'
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className='shadow-lg hover:shadow-xl transition-all duration-200'
          startIcon={isSubmitting ? <i className='bx-loader-alt animate-spin' /> : <i className='bx-lock-alt' />}
        >
          {isSubmitting ? 'Changing...' : 'Change Password'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ChangePasswordDialog
