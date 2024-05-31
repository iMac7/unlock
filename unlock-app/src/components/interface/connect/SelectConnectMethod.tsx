import { useState } from 'react'
import { ConnectWallet } from './Wallet'
import { ConnectUnlockAccount } from './UnlockAccount'
import { ConnectedWallet } from './ConnectedWallet'
import { useStorageService } from '~/utils/withStorageService'
import { UserAccountType } from '~/utils/userAccountType'
import { ToastHelper } from '~/components/helpers/toast.helper'
import { useAuthenticate } from '~/hooks/useAuthenticate'
import { useSIWE } from '~/hooks/useSIWE'

interface SelectConnectMethodProps {
  connected: string | undefined
  onNext?: () => void
  onUnlockAccount?: () => void
  onExit?: () => void
}

export const SelectConnectMethod = ({
  connected,
  onNext,
  onUnlockAccount,
  onExit,
}: SelectConnectMethodProps) => {
  const [email, setEmail] = useState('')
  const [useEmail, setUseEmail] = useState(false)

  const [accountType, setAccountType] = useState<UserAccountType>(
    UserAccountType.None
  )
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false)

  const storageService = useStorageService()

  const verifyAndSetEmail = async (email: string) => {
    setIsVerifyingEmail(true)
    setEmail(email)
    try {
      const existingUser = await storageService.getUserAccountType(email)
      setAccountType(existingUser)
    } catch (error) {
      if (error instanceof Error) {
        ToastHelper.error(`Email Error: ${error.message}`)
      }
    }
    setIsVerifyingEmail(false)
  }

  const { isConnectingProvider } = useAuthenticate()
  const { isSigningSiwe } = useSIWE()

  if (isSigningSiwe || isConnectingProvider) {
    return <div>Loading</div>
  }

  return (
    <div>
      {!useEmail && !connected && (
        <ConnectWallet
          isVerifyingEmail={isVerifyingEmail}
          onUnlockAccount={async (email) => {
            await verifyAndSetEmail(email || '')
            setUseEmail(true)
            if (onUnlockAccount) {
              onUnlockAccount()
            }
          }}
        />
      )}
      {useEmail && !connected && !isVerifyingEmail && (
        <ConnectUnlockAccount
          defaultEmail={email}
          useIcon={false}
          accountType={accountType}
          onExit={() => {
            setEmail('')
            setUseEmail(false)
            if (onExit) {
              onExit()
            }
          }}
        />
      )}
      {connected && <ConnectedWallet showIcon={false} onNext={onNext} />}
    </div>
  )
}
