'use client'

// React Imports
import { useRef, useState } from 'react'
import type { MouseEvent } from 'react'

// Next Imports
import { useParams, useRouter } from 'next/navigation'

// MUI Imports
// import { styled } from '@mui/material/styles'
// import Badge from '@mui/material/Badge'
import Popper from '@mui/material/Popper'
import Fade from '@mui/material/Fade'
import Paper from '@mui/material/Paper'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import MenuList from '@mui/material/MenuList'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'

// Third-party Imports
import { signOut, useSession } from 'next-auth/react'

// Type Imports
import type { Locale } from '@configs/i18n'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'
import UpdateProfileDialog from '@/views/apps/employees/UpdateProfileDialog'
import ChangeUserPasswordDialog from '@/views/apps/employees/ChangeUserPassword'

// Styled component for badge content
/* const BadgeContentSpan = styled('span')({
  width: 8,
  height: 8,
  borderRadius: '50%',
  cursor: 'pointer',
  backgroundColor: 'var(--mui-palette-success-main)',
  boxShadow: '0 0 0 2px var(--mui-palette-background-paper)'
}) */

const UserDropdown = () => {
  // States
  const [open, setOpen] = useState(false)
  const [profileDialogOpen, setProfileDialogOpen] = useState(false)
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] = useState(false)

  // Refs
  const anchorRef = useRef<HTMLDivElement>(null)

  // Hooks
  const router = useRouter()
  const { data: session } = useSession()
  const { settings } = useSettings()
  const { lang: locale } = useParams()

  const handleDropdownOpen = () => {
    !open ? setOpen(true) : setOpen(false)
  }

  const handleDropdownClose = (event?: MouseEvent<HTMLLIElement> | (MouseEvent | TouchEvent), action?: string) => {
    if (action === 'profile') {
      setProfileDialogOpen(true)
    } else if (action === 'change-password') {
      setChangePasswordDialogOpen(true)
    } else if (action && action.startsWith('/')) {
      router.push(getLocalizedUrl(action, locale as Locale))
    }

    if (anchorRef.current && anchorRef.current.contains(event?.target as HTMLElement)) {
      return
    }

    setOpen(false)
  }

  const handleUserLogout = async () => {
    try {
      // Sign out from the app
      await signOut({ callbackUrl: process.env.NEXT_PUBLIC_APP_URL })
    } catch (error) {
      console.error(error)

      // Show above error in a toast like following
      // toastService.error((err as Error).message)
    }
  }

  return (
    <>
      <CustomAvatar
        ref={anchorRef}
        alt={session?.user?.name || ''}
        src={session?.user?.image || ''}
        onClick={handleDropdownOpen}
        className='cursor-pointer'
      />
      <Popper
        open={open}
        transition
        disablePortal
        placement='bottom-end'
        anchorEl={anchorRef.current}
        className='min-is-[240px] !mbs-4 z-[1]'
      >
        {({ TransitionProps, placement }) => (
          <Fade
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom-end' ? 'right top' : 'left top'
            }}
          >
            <Paper className={settings.skin === 'bordered' ? 'border shadow-none' : 'shadow-lg'} sx={{ minWidth: 280 }}>
              <ClickAwayListener onClickAway={e => handleDropdownClose(e as MouseEvent | TouchEvent)}>
                <MenuList>
                  <div className='flex items-center p-4 gap-3' tabIndex={-1}>
                    <CustomAvatar
                      size={40}
                      alt={session?.user?.name || ''}
                      src={session?.user?.image || ''}
                      className='shadow-sm border'
                    />
                    <div className='flex flex-col flex-1 min-w-0'>
                      <div className='flex items-center gap-2'>
                        <Typography variant='h6' noWrap className='flex-1 text-textPrimary'>
                          {session?.user?.name || ''}
                        </Typography>
                        {session?.user?.role && (
                          <Typography
                            variant='caption'
                            className='px-2 py-0.5 rounded-md bg-action-hover/50 text-primary font-medium'
                            sx={{
                              backgroundColor: 'var(--mui-palette-primary-lightOpacity)',
                              color: 'var(--mui-palette-primary-main)'
                            }}
                          >
                            {session.user.role.charAt(0).toUpperCase() + session.user.role.slice(1)}
                          </Typography>
                        )}
                      </div>
                      <Typography variant='body2' color='text.disabled' noWrap className='w-full text-sm'>
                        {session?.user?.email || ''}
                      </Typography>
                    </div>
                  </div>
                  <Divider className='mlb-1' />
                  <MenuItem
                    className='gap-3 py-2.5 px-4'
                    onClick={e => handleDropdownClose(e, 'profile')}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'action.hover',
                        '&, & .MuiTypography-root, & i': {
                          color: 'primary.main'
                        }
                      },
                      transition: 'all 0.2s ease-in-out',
                      borderRadius: 1,
                      mx: 1.5,
                      my: 0.5
                    }}
                  >
                    <i className='bx-user text-xl' />
                    <Typography className='font-medium'>My Profile</Typography>
                  </MenuItem>
                  <MenuItem
                    className='gap-3 py-2.5 px-4'
                    onClick={e => handleDropdownClose(e, 'change-password')}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'action.hover',
                        '&, & .MuiTypography-root, & i': {
                          color: 'primary.main'
                        }
                      },
                      transition: 'all 0.2s ease-in-out',
                      borderRadius: 1,
                      mx: 1.5,
                      my: 0.5
                    }}
                  >
                    <i className='bx-lock-alt text-xl' />
                    <Typography className='font-medium'>Change Password</Typography>
                  </MenuItem>
                  {/*                   <MenuItem className='gap-3' onClick={e => handleDropdownClose(e, '/pages/pricing')}>
                    <i className='bx-dollar' />
                    <Typography color='text.primary'>Pricing</Typography>
                  </MenuItem>
                  <MenuItem className='gap-3' onClick={e => handleDropdownClose(e, '/pages/faq')}>
                    <i className='bx-help-circle' />
                    <Typography color='text.primary'>FAQ</Typography>
                  </MenuItem> */}
                  <Divider className='mlb-1' />
                  <MenuItem
                    className='gap-3 justify-center'
                    onClick={handleUserLogout}
                    sx={{
                      '&.MuiMenuItem-root': {
                        padding: '8px 16px',
                        minHeight: 'auto',
                        '&:hover': {
                          backgroundColor: 'transparent'
                        }
                      },
                      '& .MuiTypography-root': {
                        color: 'error.main',
                        fontWeight: 600,
                        fontSize: '0.9375rem',
                        transition: 'all 0.2s ease-in-out'
                      },
                      '& .bx-power-off': {
                        color: 'error.main',
                        fontSize: '1.25rem',
                        transition: 'all 0.2s ease-in-out',
                        marginTop: '2px'
                      },
                      '&:hover': {
                        '& .MuiTypography-root, & .bx-power-off': {
                          color: 'error.dark'
                        }
                      }
                    }}
                  >
                    <i className='bx-power-off' />
                    <Typography>Logout</Typography>
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>

      {session?.user && (
        <UpdateProfileDialog
          open={profileDialogOpen}
          handleClose={() => setProfileDialogOpen(false)}
          employee={{
            id: parseInt(session.user.id || '0'),
            fname: session.user.name?.split(' ')[0] || '',
            lname: session.user.name?.split(' ').slice(1).join(' ') || '',
            email: session.user.email || '',
            role: (session.user.role as 'user' | 'admin') || 'user',
            avatar: session.user.image || '',
            accountStatus: 'active',
            createdAt: new Date().toISOString() // Add current date as default
          }}
          onUpdateEmployee={async (employeeId, updatedData) => {
            // Handle employee update
            console.log('Update employee:', employeeId, updatedData)
          }}
        />
      )}

      <ChangeUserPasswordDialog
        open={changePasswordDialogOpen}
        handleClose={() => setChangePasswordDialogOpen(false)}
        onChangePassword={async (data: { currentPassword: string; newPassword: string }) => {
          console.log('Change password:', data)

          // Add your password change logic here
        }}
      />
    </>
  )
}

export default UserDropdown
