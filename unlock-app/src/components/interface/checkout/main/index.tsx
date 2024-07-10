import React, { useCallback, useEffect, useMemo } from 'react'
import { useCheckoutCommunication } from '~/hooks/useCheckoutCommunication'
import { checkoutMachine } from './checkoutMachine'
import { Quantity } from './Quantity'
import { Metadata } from './Metadata'
import { Confirm } from './Confirm'
import { MessageToSign } from './MessageToSign'
import { Minting } from './Minting'
import { CardPayment } from './CardPayment'
import { useMachine } from '@xstate/react'
import { Captcha } from './Captcha'
import { Returning } from './Returning'
import { Payment } from './Payment'
import { Password } from './Password'
import { Promo } from './Promo'
import { useAuth } from '~/contexts/AuthenticationContext'
import { isEqual } from 'lodash'
import { CheckoutHead, TopNavigation } from '../Shell'
import { PaywallConfigType } from '@unlock-protocol/core'
import { Guild } from './Guild'
import { Gitcoin } from './Gitcoin'
import { isInIframe } from '~/utils/iframe'
import { ConnectWithLoader } from './ConnectWithLoader'
import { useRouter } from 'next/router'
import { Select } from './Select'

interface Props {
  paywallConfig: PaywallConfigType
  redirectURI?: URL
  handleClose?: (params: Record<string, string>) => void
  communication?: ReturnType<typeof useCheckoutCommunication>
}

export function Checkout({
  paywallConfig,
  redirectURI,
  handleClose,
  communication,
}: Props) {
  // @ts-expect-error - The types returned by 'resolveState(...)' are incompatible between these types
  const [state, send, checkoutService] = useMachine(checkoutMachine, {
    input: {
      paywallConfig,
    },
  })
  const { account } = useAuth()

  const { mint, messageToSign } = state.context
  const matched = state.value.toString()
  const paywallConfigChanged = !isEqual(
    paywallConfig,
    state.context.paywallConfig
  )

  const router = useRouter()

  useEffect(() => {
    console.debug('Unlock paywall config', paywallConfig)
  }, [paywallConfig])

  useEffect(() => {
    if (paywallConfigChanged) {
      checkoutService.send({
        type: 'UPDATE_PAYWALL_CONFIG',
        config: paywallConfig,
      })
    }
  }, [paywallConfig, checkoutService, paywallConfigChanged])

  useEffect(() => {
    const user = account ? { address: account } : {}
    if (isInIframe() && communication) {
      communication.emitUserInfo(user)
    }
  }, [account, communication])

  const onClose = useCallback(
    (params: Record<string, string> = {}) => {
      // Reset the Paywall State!
      checkoutService.send({ type: 'RESET_CHECKOUT' })
      if (handleClose) {
        handleClose(params)
      } else if (redirectURI) {
        const redirect = new URL(redirectURI.toString())
        if (mint && mint?.status === 'ERROR') {
          redirect.searchParams.append('error', 'access-denied')
        }

        if (paywallConfig.messageToSign && !messageToSign) {
          redirect.searchParams.append('error', 'user did not sign message')
        }

        if (messageToSign) {
          redirect.searchParams.append('signature', messageToSign.signature)
          redirect.searchParams.append('address', messageToSign.address)
        }
        for (const [key, value] of Object.entries(params)) {
          redirect.searchParams.append(key, value)
        }
        return window.location.assign(redirect)
      } else if (!isInIframe() || !communication) {
        window.history.back()
      } else {
        communication.emitCloseModal()
      }
    },
    [
      handleClose,
      communication,
      redirectURI,
      mint,
      messageToSign,
      paywallConfig.messageToSign,
      checkoutService,
    ]
  )

  const onBack = useMemo(() => {
    const unlockAccount = state.children?.unlockAccount
    const canBackInUnlockAccountService = unlockAccount
      ?.getSnapshot()
      .can('BACK')
    const canBack = state.can({ type: 'BACK' })
    if (canBackInUnlockAccountService) {
      return () => unlockAccount.send('BACK')
    }
    if (canBack) {
      return () => checkoutService.send({ type: 'BACK' })
    }
    return undefined
  }, [state, checkoutService])

  useEffect(() => {
    if (matched !== 'SELECT' && matched != 'CONNECT' && router.query.lock) {
      // Remove the lock from the query string
      const { lock, ...otherQueryParams } = router.query
      router.replace(
        {
          pathname: router.pathname,
          query: otherQueryParams,
        },
        undefined,
        { shallow: true }
      )
    }
  }, [router])

  const Content = useCallback(() => {
    switch (matched) {
      case 'CONNECT': {
        return <ConnectWithLoader checkoutService={checkoutService} />
      }
      case 'SELECT': {
        return <Select checkoutService={checkoutService} />
      }
      case 'QUANTITY': {
        return <Quantity checkoutService={checkoutService} />
      }
      case 'PAYMENT': {
        return <Payment checkoutService={checkoutService} />
      }
      case 'CARD': {
        return <CardPayment checkoutService={checkoutService} />
      }
      case 'METADATA': {
        return <Metadata checkoutService={checkoutService} />
      }
      case 'CONFIRM': {
        return (
          <Confirm
            checkoutService={checkoutService}
            communication={communication}
          />
        )
      }
      case 'MESSAGE_TO_SIGN': {
        return (
          <MessageToSign
            checkoutService={checkoutService}
            communication={communication}
          />
        )
      }
      case 'MINTING': {
        return (
          <Minting
            onClose={onClose}
            checkoutService={checkoutService}
            communication={communication}
          />
        )
      }
      case 'CAPTCHA': {
        return <Captcha checkoutService={checkoutService} />
      }
      case 'GUILD': {
        return <Guild checkoutService={checkoutService} />
      }
      case 'PASSWORD': {
        return <Password checkoutService={checkoutService} />
      }
      case 'PROMO': {
        return <Promo checkoutService={checkoutService} />
      }
      case 'GITCOIN': {
        return <Gitcoin checkoutService={checkoutService} />
      }
      case 'RETURNING': {
        return (
          <Returning
            onClose={onClose}
            communication={communication}
            checkoutService={checkoutService}
          />
        )
      }
      default: {
        return null
      }
    }
  }, [onClose, matched, communication])

  return (
    <div className="bg-white z-10  shadow-xl max-w-md rounded-xl flex flex-col w-full h-[90vh] sm:h-[80vh] min-h-[32rem] max-h-[42rem]">
      <TopNavigation
        onClose={!paywallConfig?.persistentCheckout ? onClose : undefined}
        onBack={onBack}
      />
      <CheckoutHead iconURL={paywallConfig.icon} title={paywallConfig.title} />
      <Content />
    </div>
  )
}
