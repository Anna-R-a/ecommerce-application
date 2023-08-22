import {  defaultClient } from "../api/client/createClient"


require('dotenv').config()

export const projectKey = 'demo'
const fetch = require('node-fetch')

describe('client builder', () => {
  const authMiddlewareOptions = {
    host: 'https://auth.europe-west1.gcp.commercetools.com',
    projectKey: process.env.REACT_APP_ADMIN_CTP_PROJECT_KEY || projectKey,
    credentials: {
      clientId: process.env.REACT_APP_ADMIN_CTP_CLIENT_ID || '',
      clientSecret: process.env.REACT_APP_ADMIN_CTP_CLIENT_SECRET || '',
    },
    oauthUri: process.env.REACT_APP_ADMIN_CTP_AUTH_URL || '',
    scopes: ['manage_project:demo-1'],
    fetch,
  }

  const httpMiddlewareOptions = {
    host: 'https://api.europe-west1.gcp.commercetools.com',
    fetch,
  }

  describe('general', () => {

    test('should build the client when build method is called', () => {
      const client = defaultClient(httpMiddlewareOptions.host,
        authMiddlewareOptions.credentials,
        authMiddlewareOptions.host,
        authMiddlewareOptions.projectKey)
        .withHttpMiddleware(httpMiddlewareOptions)
        .withClientCredentialsFlow(authMiddlewareOptions)
        .build()

      expect(client).toHaveProperty('execute')
      expect(client).toHaveProperty('process')

      expect(typeof client.execute).toEqual('function')
      expect(typeof client.process).toEqual('function')
    })
  })

  describe('middlewares', () => {
    test('should create should create default client', () => {

      const defaultClientTest = defaultClient(
        httpMiddlewareOptions.host,
        authMiddlewareOptions.credentials,
        authMiddlewareOptions.host,
        authMiddlewareOptions.projectKey
      )
      expect(defaultClientTest.withHttpMiddleware).toBeTruthy()
      expect(defaultClientTest.withAuthMiddleware).toBeTruthy()
      
    })
  })
})


