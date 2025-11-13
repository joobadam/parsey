'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export function useTransactions(filters = {}) {
  const queryParams = new URLSearchParams()
  if (filters.month) queryParams.set('month', filters.month)
  if (filters.category) queryParams.set('category', filters.category)
  if (filters.type) queryParams.set('type', filters.type)
  return useQuery({
    queryKey: ['transactions', filters],
    queryFn: async () => {
      const response = await fetch(`/api/transactions?${queryParams}`)
      if (!response.ok) throw new Error('Failed to fetch transactions')
      return response.json()
    },
  })
}

export function useCreateTransaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (transaction) => {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transaction),
      })
      if (!response.ok) throw new Error('Failed to create transaction')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
  })
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Failed to update transaction')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
  })
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id) => {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete transaction')
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
  })
}


