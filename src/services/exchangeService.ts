import { apiGetExchangeRequests, apiAcceptExchangeRequest, apiRejectExchangeRequest } from '../api/client'

export async function fetchExchangeRequests(token: string) {
  return apiGetExchangeRequests(token)
}

export async function acceptExchange(token: string, requestId: string) {
  return apiAcceptExchangeRequest(token, requestId)
}

export async function rejectExchange(token: string, requestId: string) {
  return apiRejectExchangeRequest(token, requestId)
}


