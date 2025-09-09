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

// Type Imports
import type { Employee, EditEmployeeFormData } from '@/types/apps/employeeTypes'

// Component Imports
import CustomTextField from '@core/components/mui/TextField'
import DialogCloseButton from '@components/dialogs/DialogCloseButton'

type Props = {
  open: boolean
  handleClose: () => void
  employee: Employee | null
  onUpdateEmployee: (employeeId: number, updatedData: Partial<Employee>) => void
}

const EditEmployeeDialog = ({ open, handleClose, employee, onUpdateEmployee }: Props) => {
  // States
  const [isSubmitting, setIsSubmitting] = useState(false)

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
      role: 'user'
    }
  })

  // Update form when employee changes
  useEffect(() => {
    if (employee) {
      resetForm({
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        role: employee.role
      })
    }
  }, [employee, resetForm])

  const onSubmit = async (data: EditEmployeeFormData) => {
    if (!employee) return

    setIsSubmitting(true)

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      const updatedEmployee: Partial<Employee> = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        role: data.role
      }

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
    } catch (error) {
      toast.error('Failed to update employee. Please try again.', {
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
          <div className='p-2 bg-warning-lighter rounded-lg'>
            <i className='bx-edit text-2xl text-warning' />
          </div>
          <div>
            <Typography variant='h4' className='font-bold'>
              Edit Employee
            </Typography>
            <Typography component='span' className='text-textSecondary'>
              Update employee information
            </Typography>
          </div>
        </div>
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
                <MenuItem value='user'>
                  <div className='flex items-center gap-2'>
                    <i className='bx-user text-lg text-success' />
                    <span>User</span>
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
          startIcon={isSubmitting ? <i className='bx-loader-alt animate-spin' /> : <i className='bx-edit' />}
        >
          {isSubmitting ? 'Updating...' : 'Update Employee'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditEmployeeDialog
