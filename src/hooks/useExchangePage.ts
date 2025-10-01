import { useEffect, useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { fetchExchangeRequests, acceptExchange, rejectExchange } from '../services/exchangeService'
import type { ExchangeRequestData } from '../types'

export function useExchangePage() {
  const token = useAuthStore(s => s.token)
  const user = useAuthStore(s => s.user)

  const [requests, setRequests] = useState<ExchangeRequestData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [selectedRequest, setSelectedRequest] = useState<ExchangeRequestData | null>(null)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)

  useEffect(() => {
    if (!token) {
      setError('Please log in to view exchange requests')
      setLoading(false)
      return
    }
    if (user) fetchRequests()
  }, [token, user])

  const fetchRequests = async () => {
    if (!token) return
    try {
      setLoading(true)
      setError(null)
      const data = await fetchExchangeRequests(token)
      setRequests(data.requests)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch exchange requests')
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = async (requestId: string) => {
    if (!token) return
    try {
      setActionLoading(requestId)
      await acceptExchange(token, requestId)
      setSnackbarMessage('Exchange request accepted!')
      setSnackbarOpen(true)
      await fetchRequests()
    } catch (err: any) {
      setSnackbarMessage(err.message || 'Failed to accept request')
      setSnackbarOpen(true)
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async (requestId: string) => {
    if (!token) return
    try {
      setActionLoading(requestId)
      await rejectExchange(token, requestId)
      setSnackbarMessage('Exchange request rejected')
      setSnackbarOpen(true)
      await fetchRequests()
    } catch (err: any) {
      setSnackbarMessage(err.message || 'Failed to reject request')
      setSnackbarOpen(true)
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning'
      case 'accepted': return 'success'
      case 'rejected': return 'error'
      case 'completed': return 'info'
      default: return 'default'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Очікує'
      case 'accepted': return 'Прийнято'
      case 'rejected': return 'Відхилено'
      case 'completed': return 'Завершено'
      default: return status
    }
  }

  return {
    user,
    requests,
    loading,
    error,
    actionLoading,
    snackbarOpen,
    snackbarMessage,
    selectedRequest,
    detailsDialogOpen,
    setSnackbarOpen,
    setSelectedRequest,
    setDetailsDialogOpen,
    handleAccept,
    handleReject,
    getStatusColor,
    getStatusText,
  }
}

export type UseExchangePageReturn = ReturnType<typeof useExchangePage>


