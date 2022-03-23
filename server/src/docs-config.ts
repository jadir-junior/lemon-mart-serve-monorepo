import swaggerJsdoc, { Options } from 'swagger-jsdoc'

import * as packageJson from '../package.json'

const options: Options = {
  swaggerDefinition: {
    openapi: '3.0.1',
    components: {},
    info: {
      title: 'Lemon Mart',
      version: packageJson.version,
      description: packageJson.description,
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Local Environment' },
      {
        url: 'https://mytaginsserver.com',
        description: 'Staging environment',
      },
      {
        url: 'https://myprodserver.com',
        description: 'Production environment',
      },
    ],
  },
  apis: ['**/api.js', '**/models/*.js', '**/v1/**/*.js', '**/v2/**/*.js'],
}

const specs = swaggerJsdoc(options)

export { specs }
