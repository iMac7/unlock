import React from 'react'
import { Event, PaywallConfigType } from '@unlock-protocol/core'
import AddToCalendarButton from '../AddToCalendarButton'
import TweetItButton from '../TweetItButton'
import CastItButton from '../CastItButton'
import CopyUrlButton from '../CopyUrlButton'
import Hosts from '../Hosts'
import { EventDetail } from '../EventDetail'
import { EventLocation } from '../EventLocation'
import ReactMarkdown from 'react-markdown'
import { RegistrationCard } from '../Registration/RegistrationCard'
import { Card } from '@unlock-protocol/ui'
import { MdAssignmentLate } from 'react-icons/md'
import { AttendeeCues } from '../Registration/AttendeeCues'
import { AiOutlineCalendar as CalendarIcon } from 'react-icons/ai'

type EventBannerlessProps = {
  event: Event
  checkoutConfig: {
    id?: string
    config: PaywallConfigType
  }
  hasLocation: boolean
  hasDate: string | null
  organizers: string[] | undefined
  startDate: string | null
  endDate: string | null
  startTime: string | undefined
  endTime: string | null
  eventUrl: string
  hasPassed: boolean
}

export const EventBannerlessLayout = ({
  event,
  checkoutConfig,
  hasLocation,
  hasDate,
  organizers,
  startDate,
  endDate,
  startTime,
  endTime,
  eventUrl,
  hasPassed,
}: EventBannerlessProps) => {
  return (
    <div>
      <div className="md:flex md:flex-row-reverse md:gap-4 md:mt-16 mt-8">
        <div className="flex flex-col gap-4">
          <div className="flex justify-center w-full">
            <section className="flex justify-between flex-col">
              <div className="flex p-1 bg-white sm:p-2 sm:w-96 sm:h-96 sm:rounded-3xl rounded-xl border">
                <img
                  alt={event.title}
                  className="object-cover w-full m-auto aspect-1 sm:rounded-2xl rounded-lg"
                  src={event.image}
                />
              </div>
            </section>
          </div>
          <ul className="flex items-center justify-center gap-0 md:gap-2">
            <li>
              <AddToCalendarButton event={event} eventUrl={eventUrl} />
            </li>
            <li>
              <TweetItButton event={event} eventUrl={eventUrl} />
            </li>
            <li>
              <CastItButton event={event} eventUrl={eventUrl} />
            </li>
            <li>
              <CopyUrlButton url={eventUrl} />
            </li>
          </ul>
          {!hasPassed && (
            <RegistrationCard
              requiresApproval={event.requiresApproval}
              checkoutConfig={checkoutConfig}
            />
          )}
          {hasPassed && (
            <Card className="grid gap-4 mt-5 md:mt-0">
              <p className="text-lg">
                <MdAssignmentLate />
                This event is over. It is not possible to register for it
                anymore.
              </p>
            </Card>
          )}
          <AttendeeCues checkoutConfig={checkoutConfig} />
        </div>
        <div className="flex flex-col col-span-3 gap-4 md:col-span-2">
          <h1 className="mt-4 text-3xl font-bold md:text-6xl">{event.name}</h1>
          <section className="flex flex-col gap-4">
            {organizers && organizers.length > 0 && (
              <Hosts organizers={organizers} />
            )}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 rounded-xl">
              {hasDate && (
                <EventDetail label="Date" icon={CalendarIcon}>
                  <div
                    style={{ color: `#${event.background_color}` }}
                    className="flex flex-col text-lg font-normal text-brand-dark"
                  >
                    {(startDate || endDate) && (
                      <span>
                        {startDate} {endDate && <>to {endDate}</>}
                      </span>
                    )}
                    {startTime && endTime && (
                      <span>
                        {startTime} {endTime && <>to {endTime}</>}
                      </span>
                    )}
                  </div>
                </EventDetail>
              )}
              {hasLocation && <EventLocation event={event} />}
            </div>
            <div>
              {event.description && (
                <div className="mt-4 markdown">
                  {/* eslint-disable-next-line react/no-children-prop */}
                  <ReactMarkdown children={event.description} />
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
