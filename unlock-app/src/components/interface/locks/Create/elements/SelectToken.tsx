import { Token } from '@unlock-protocol/types'
import { CryptoIcon } from '@unlock-protocol/crypto-icon'
import { useEffect, useState } from 'react'
import { SelectCurrencyModal } from '../modals/SelectCurrencyModal'
import networks from '@unlock-protocol/networks'
import { Web3Service } from '@unlock-protocol/unlock-js'
import { twMerge } from 'tailwind-merge'

export const SelectToken = ({
  network,
  onChange,
  defaultToken,
  className,
}: {
  network: number
  defaultToken?: Partial<Token>
  onChange: (token: Token) => void
  className?: string
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [token, setToken] = useState(defaultToken)

  const onSelect = (_token: Token) => {
    onChange(_token)
    setToken(_token)
  }

  useEffect(() => {
    const initialize = async () => {
      if (defaultToken?.address) {
        const web3Service = new Web3Service(networks)

        const symbol = await web3Service.getTokenSymbol(
          defaultToken.address,
          network
        )
        if (symbol) {
          onSelect({
            ...defaultToken,
            symbol,
          } as Token)
        } else {
          onSelect((networks[network]?.nativeCurrency as Token) ?? {})
        }
      } else {
        onSelect((networks[network]?.nativeCurrency as Token) ?? {})
      }
    }
    initialize()
  }, [defaultToken?.address, network])

  return (
    <div className={twMerge('flex flex-col gap-1.5', className)}>
      <SelectCurrencyModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        network={network}
        onSelect={onSelect}
        defaultCurrencyAddress={token?.address}
      />

      <div
        onClick={() => setIsOpen(true)}
        className="box-border flex items-center flex-1 w-full gap-2 pl-4 text-base text-left transition-all border border-gray-400 rounded-lg shadow-sm cursor-pointer hover:border-gray-500 focus:ring-gray-500 focus:border-gray-500 focus:outline-none px-3"
      >
        {token?.symbol && (
          <>
            <CryptoIcon symbol={token?.symbol || ''} />
            <span>{token?.symbol}</span>
          </>
        )}
      </div>
      <div className="pl-1"></div>
    </div>
  )
}
