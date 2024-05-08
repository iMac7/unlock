import express from 'express'
import {
  getEventDetailsByLock,
  saveEventDetails,
  getEvent,
  getAllEvents,
} from '../../controllers/v2/eventsController'
import { authenticatedMiddleware } from '../../utils/middlewares/auth'
import { eventOrganizerMiddleware } from '../../utils/middlewares/eventOrganizerMiddleware'
import {
  addEventVerifier,
  deleteEventVerifier,
  getEventVerifiers,
} from '../../controllers/v2/verifierController'
const router = express.Router({ mergeParams: true })

router.get('/:slug/verifiers', getEventVerifiers)
router.put(
  '/:slug/verifiers/:address',
  authenticatedMiddleware,
  eventOrganizerMiddleware,
  addEventVerifier
)
router.delete(
  '/:slug/verifiers/:address',
  authenticatedMiddleware,
  eventOrganizerMiddleware,
  deleteEventVerifier
)

router.get('/:network/:lockAddress', getEventDetailsByLock)
router.get('/:slug', getEvent)
router.get('/', getAllEvents)
router.post(
  '/save',
  authenticatedMiddleware,
  eventOrganizerMiddleware,
  saveEventDetails
)

export default router
