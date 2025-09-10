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
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'

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
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isOldPasswordShown, setIsOldPasswordShown] = useState(false)
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false)

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

      <DialogTitle className='text-center p-6 border-b'>
        <div className='flex flex-col gap-1'>
          <Typography variant='h4' className='font-bold text-textPrimary'>
            Change Password
          </Typography>
          <div className='flex items-center justify-center gap-2'>
            <Typography variant='body2' className='text-textSecondary'>
              Update password for
            </Typography>
            <Typography variant='subtitle2' className='font-medium text-textPrimary bg-actionHover px-2 py-0.5 rounded'>
              {employee.fname} {employee.lname}
            </Typography>
          </div>
        </div>
      </DialogTitle>

      <DialogContent className='p-6'>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
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
                type={isOldPasswordShown ? 'text' : 'password'}
                label='Old Password'
                placeholder='Enter Old password'
                slotProps={{
                  input: {
                    startAdornment: <i className='bx-lock-alt text-xl text-textSecondary mr-2' />,
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onClick={() => setIsOldPasswordShown(show => !show)}
                          onMouseDown={e => e.preventDefault()}
                        >
                          <i className={isOldPasswordShown ? 'bx-show' : 'bx-hide'} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                }}
                {...(errors.newPassword && { error: true, helperText: errors.newPassword.message })}
              />
            )}
          />
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
                type={isPasswordShown ? 'text' : 'password'}
                label='New Password'
                placeholder='Enter new password'
                slotProps={{
                  input: {
                    startAdornment: <i className='bx-lock-alt text-xl text-textSecondary mr-2' />,
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onClick={() => setIsPasswordShown(show => !show)}
                          onMouseDown={e => e.preventDefault()}
                        >
                          <i className={isPasswordShown ? 'bx-show' : 'bx-hide'} />
                        </IconButton>
                      </InputAdornment>
                    )
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
                type={isConfirmPasswordShown ? 'text' : 'password'}
                label='Confirm Password'
                placeholder='Confirm new password'
                slotProps={{
                  input: {
                    startAdornment: <i className='bx-check-circle text-xl text-textSecondary mr-2' />,
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onClick={() => setIsConfirmPasswordShown(show => !show)}
                          onMouseDown={e => e.preventDefault()}
                        >
                          <i className={isConfirmPasswordShown ? 'bx-show' : 'bx-hide'} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                }}
                {...(errors.confirmPassword && { error: true, helperText: errors.confirmPassword.message })}
              />
            )}
          />
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
          startIcon={isSubmitting ? <i className='bx-loader-alt animate-spin' /> : <i className='bx-lock-alt' />}
        >
          {isSubmitting ? 'Changing...' : 'Change Password'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ChangePasswordDialog
