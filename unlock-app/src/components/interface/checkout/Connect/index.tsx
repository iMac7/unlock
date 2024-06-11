import React, { useCallback, useEffect, useState } from 'react'
import { useCheckoutCommunication } from '~/hooks/useCheckoutCommunication'
import type { OAuthConfig } from '~/unlockTypes'

import { ConfirmConnect } from './ConfirmConnect'
import { Step, StepButton, StepTitle } from '../Stepper'
import { ConnectPage } from '../main/ConnectPage'
import { TopNavigation } from '../Shell'
import { useAuth } from '~/contexts/AuthenticationContext'
import { PaywallConfigType } from '@unlock-protocol/core'

interface Props {
  oauthConfig: OAuthConfig
  paywallConfig: PaywallConfigType
  communication?: ReturnType<typeof useCheckoutCommunication>
}

interface StepperProps {
  state: string
}

export const Stepper = ({ state }: StepperProps) => {
  const steps = ['connect', 'confirm']
  const { deAuthenticate } = useAuth()

  const [currentState, setCurentState] = useState(steps.indexOf(state))

  useEffect(() => {
    setCurentState(steps.indexOf(state))
  }, [state, setCurentState])

  return (
    <div className="flex items-center gap-1.5">
      {steps.map((step: string, idx: number) => {
        const isActive = step === steps[currentState]
        if (isActive) {
          return (
            <>
              <Step active>{idx + 1}</Step>
              <StepTitle key={idx}>{steps[idx]}</StepTitle>
            </>
          )
        } else if (currentState > idx) {
          return (
            <StepButton
              key={idx}
              onClick={() => {
                setCurentState(idx)
                deAuthenticate()
              }}
            >
              {idx + 1}
            </StepButton>
          )
        } else {
          return <Step key={idx}>{idx + 1}</Step>
        }
      })}
    </div>
  )
}

export function Connect({ oauthConfig, communication }: Props) {
  const { account } = useAuth()
  const [state, setState] = useState('connect')

  const onClose = useCallback(
    (params: Record<string, string> = {}) => {
      if (oauthConfig.redirectUri) {
        const redirectURI = new URL(oauthConfig.redirectUri)

        for (const [key, value] of Object.entries(params)) {
          redirectURI.searchParams.append(key, value)
        }
        return window.location.assign(redirectURI)
      } else if (!communication?.insideIframe) {
        window.history.back()
      } else {
        communication.emitCloseModal()
      }
    },
    [oauthConfig.redirectUri, communication]
  )

  useEffect(() => {
    if (!account) {
      return setState('connect')
    } else {
      return setState('confirm')
    }
  }, [account])

  return (
    <div className="bg-white z-10 shadow-xl max-w-md rounded-xl flex flex-col w-full h-[90vh] sm:h-[80vh] min-h-[32rem] max-h-[42rem]">
      <TopNavigation onClose={onClose} />
      <div className="flex items-center justify-between w-full gap-2 p-2 px-6 border-b">
        <div className="flex items-center gap-1.5">
          <Stepper state={state} />
        </div>
      </div>
      {!account && <ConnectPage style="h-full mt-4 space-y-5" />}
      {account && (
        <ConfirmConnect
          className="h-full mt-4 space-y-5"
          communication={communication}
          onClose={onClose}
          oauthConfig={oauthConfig}
        />
      )}
    </div>
  )
}
