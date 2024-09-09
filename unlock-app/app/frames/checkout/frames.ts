import { createFrames } from 'frames.js/next'

type Lock = {
  name: string
  address: string
  network: string
  image: string
  description: string
  price: string
  defaultImage: any
}

export type State = {
  lock: Lock | null
}

export const frames = createFrames<State>({
  basePath: '/frames/checkout',
  initialState: {
    lock: null,
  },
})
