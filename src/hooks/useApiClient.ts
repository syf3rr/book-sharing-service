import { useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { API_ENDPOINTS } from '../constants'

interface ApiClient {
  get: <T>(url: string, options?: RequestInit) => Promise<T>
  post: <T>(url: string, data?: any, options?: RequestInit) => Promise<T>
  put: <T>(url: string, data?: any, options?: RequestInit) => Promise<T>
  delete: <T>(url: string, options?: RequestInit) => Promise<T>
}

export function useApiClient(): ApiClient {
  const { token } = useAuth()

  const getHeaders = useCallback((customHeaders?: HeadersInit, isFormData?: boolean): HeadersInit => {
    const headers: HeadersInit = {
      ...customHeaders,
    }

    // Only set Content-Type for JSON, not for FormData
    if (!isFormData && !customHeaders?.['Content-Type']) {
      headers['Content-Type'] = 'application/json'
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    return headers
  }, [token])

  const handleResponse = useCallback(async <T>(response: Response): Promise<T> => {
    if (!response.ok) {
      let errorMessage = 'Request failed'
      try {
        const errorData = await response.json()
        errorMessage = errorData.error || errorMessage
      } catch {
        // Try to read as text if JSON parsing fails
        try {
          errorMessage = await response.text() || errorMessage
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`
        }
      }
      throw new Error(errorMessage)
    }

    try {
      return await response.json()
    } catch {
      throw new Error('Invalid JSON response')
    }
  }, [])

  const get = useCallback(async <T>(url: string, options?: RequestInit): Promise<T> => {
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(options?.headers),
      ...options,
    })
    return handleResponse<T>(response)
  }, [getHeaders, handleResponse])

  const post = useCallback(async <T>(url: string, data?: any, options?: RequestInit): Promise<T> => {
    const isFormData = data instanceof FormData
    const response = await fetch(url, {
      method: 'POST',
      headers: getHeaders(options?.headers, isFormData),
      body: data ? (isFormData ? data : JSON.stringify(data)) : undefined,
      ...options,
    })
    return handleResponse<T>(response)
  }, [getHeaders, handleResponse])

  const put = useCallback(async <T>(url: string, data?: any, options?: RequestInit): Promise<T> => {
    const isFormData = data instanceof FormData
    const response = await fetch(url, {
      method: 'PUT',
      headers: getHeaders(options?.headers, isFormData),
      body: data ? (isFormData ? data : JSON.stringify(data)) : undefined,
      ...options,
    })
    return handleResponse<T>(response)
  }, [getHeaders, handleResponse])

  const deleteMethod = useCallback(async <T>(url: string, options?: RequestInit): Promise<T> => {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: getHeaders(options?.headers),
      ...options,
    })
    return handleResponse<T>(response)
  }, [getHeaders, handleResponse])

  return {
    get,
    post,
    put,
    delete: deleteMethod,
  }
}
