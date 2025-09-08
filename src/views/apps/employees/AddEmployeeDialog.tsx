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

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'

// Type Imports
import type { Employee, EmployeeFormData } from '@/types/apps/employeeTypes'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import DialogCloseButton from '@components/dialogs/DialogCloseButton'

type Props = {
  open: boolean
  handleClose: () => void
  onAddEmployee: (employee: Employee) => void
}

const AddEmployeeDialog = ({ open, handleClose, onAddEmployee }: Props) => {
  // States
  const [isSubmitting, setIsSubmitting] = useState(false)

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
      role: 'user'
    }
  })

  const onSubmit = async (data: EmployeeFormData) => {
    setIsSubmitting(true)

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      const newEmployee: Employee = {
        id: Date.now(), // Simple ID generation
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        role: data.role,
        avatar: `/images/avatars/${Math.floor(Math.random() * 20) + 1}.png`,
        createdAt: new Date().toISOString().split('T')[0]
      }

      onAddEmployee(newEmployee)

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
    } catch (error) {
      toast.error('Failed to add employee. Please try again.', {
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

      <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        Add Employee
        <Typography component='span' className='flex flex-col text-center'>
          Create a new employee account
        </Typography>
      </DialogTitle>

      <DialogContent className='pbs-0 sm:pli-16 sm:pbe-16'>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
          <div className='flex gap-4'>
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
                type='password'
                label='Password'
                placeholder='Enter password'
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
                {...(errors.role && { error: true, helperText: errors.role.message })}
              >
                <MenuItem value='user'>User</MenuItem>
                <MenuItem value='admin'>Admin</MenuItem>
              </CustomTextField>
            )}
          />
        </form>
      </DialogContent>

      <DialogActions className='justify-center gap-4 pbs-0 sm:pli-16 sm:pbe-16'>
        <Button variant='tonal' color='error' onClick={handleReset} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          variant='contained'
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          startIcon={isSubmitting ? <i className='bx-loader-alt animate-spin' /> : <i className='bx-plus' />}
        >
          {isSubmitting ? 'Creating...' : 'Create Employee'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddEmployeeDialog
