import { Router } from 'express'

import { router as apiV1 } from './v1'
import { router as apiv2 } from './v2'

const api = Router()

/**
 * @swagger
 * components:
 *   parameters:
 *     filterParam:
 *       in: query
 *       name: filter
 *       required: false
 *       schema:
 *         type: string
 *       description: Search text to filter the result set by
 *     skipParam:
 *       in: query
 *       name: skip
 *       required: false
 *       schema:
 *         type: integer
 *         minimum: 0
 *       description: The number of items to skip before collecting the result set.
 *     limitParam:
 *       in: query
 *       name: limit
 *       required: false
 *       schema:
 *         type: integer
 *         minimum: 1
 *         maximum: 50
 *         default: 10
 *       description: The numbers of items to return.
 *     sortKeyParam:
 *       in: query
 *       name: sortKey
 *       required: false
 *       schema:
 *         type: string
 *       description: Name of a column to sort ascending.
 *                    Prepend column name with a dash to sort descending.
 */

api.use('/v1', apiV1)
api.use('/v2', apiv2)

export { api }
