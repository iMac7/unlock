import { Abi, encodeFunctionData } from 'viem'
import { frames } from '../frames'
import { transaction } from 'frames.js/core'
import { PublicLockV14 } from '@unlock-protocol/contracts'

const abi = PublicLockV14.abi

export const POST = frames(async (ctx) => {
  if (!ctx?.message) {
    throw new Error('Invalid frame message')
  }

  const userAddress = ctx.message.address!
  const { address: lockAddress, priceForUser } = ctx.state.lock!
  const network = Number(ctx.state.lock!.network)

  const calldata = encodeFunctionData({
    abi,
    functionName: 'purchase',
    args: [[priceForUser], [userAddress], [userAddress], [userAddress], ['0x']],
  })

  return transaction({
    chainId: `eip155:${network}`,
    method: 'eth_sendTransaction',
    params: {
      abi: abi as Abi,
      to: lockAddress as `0x${string}`,
      data: calldata,
      value: priceForUser,
    },
  })
})
