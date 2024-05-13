import { PaywallConfigType } from '@unlock-protocol/core'
import Link from 'next/link'
import BrowserOnly from '~/components/helpers/BrowserOnly'
import { AppLayout } from '~/components/interface/layouts/AppLayout'
import { useEvent } from '~/hooks/useEvent'
import { BsArrowLeft as ArrowBackIcon } from 'react-icons/bs'
import { Scanner } from '~/components/interface/verification/Scanner'

interface EventVerificationProps {
  slug: string
  checkoutConfig: {
    id?: string
    config: PaywallConfigType
  }
}

export const EventVerification = ({
  slug,
  checkoutConfig,
}: EventVerificationProps) => {
  const { data: event } = useEvent({ slug: slug })

  return (
    <BrowserOnly>
      <AppLayout authRequired={true} showHeader={false}>
        {event && (
          <div>
            <div className="flex flex-row gap-4 align-center items-center">
              <Link href={`/event/${event.slug}`}>
                <ArrowBackIcon size={20} />
              </Link>
              <div className="w-16 h-16 overflow-hidden bg-cover rounded-2xl">
                <img
                  className="object-cover w-full m-auto aspect-1 rounded-2xl"
                  src={event.image}
                  alt={event.name}
                />
              </div>
              <div>
                <span className="text-xl font-bold text-brand-dark">
                  {event.name} /
                </span>{' '}
                <span className="text-xl text-gray-600">Verification</span>
              </div>
            </div>
            <div className="pt-10">
              <Scanner
                eventAddress={Object.keys(checkoutConfig.config.locks)[0]}
              />
            </div>
          </div>
        )}
      </AppLayout>
    </BrowserOnly>
  )
}

export default EventVerification
