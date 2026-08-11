"use client"

import { useCallback, useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { useEvent } from "@/hooks/use-event"

export interface UseDataTableOptions {
  defaultPerPage?: number
  searchParamKey?: string
  statusParamKey?: string
  pageParamKey?: string
  perPageParamKey?: string
  debounceMs?: number
}

export function useDataTable(options: UseDataTableOptions = {}) {
  const {
    defaultPerPage = 10,
    searchParamKey = "search",
    statusParamKey = "status",
    pageParamKey = "page",
    perPageParamKey = "perPage",
    debounceMs = 400,
  } = options

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const initialSearch = searchParams.get(searchParamKey) || ""
  const [searchVal, setSearchVal] = useState(initialSearch)

  const statusFilter = searchParams.get(statusParamKey) || "all"
  const page = parseInt(searchParams.get(pageParamKey) || "1", 10)
  const perPage = parseInt(
    searchParams.get(perPageParamKey) || defaultPerPage.toString(),
    10
  )

  // Sync internal search input if URL changes externally
  useEffect(() => {
    setSearchVal(searchParams.get(searchParamKey) || "")
  }, [searchParams, searchParamKey])

  const createQueryString = useCallback(
    (newParams: Record<string, string | null>) => {
      const updatedSearchParams = new URLSearchParams(searchParams.toString())
      for (const [key, value] of Object.entries(newParams)) {
        if (value === null || value === "all" || value === "") {
          updatedSearchParams.delete(key)
        } else {
          updatedSearchParams.set(key, value)
        }
      }
      if (!newParams.hasOwnProperty(pageParamKey)) {
        updatedSearchParams.set(pageParamKey, "1")
      }
      return updatedSearchParams.toString()
    },
    [searchParams, pageParamKey]
  )

  const onSearch = useEvent(() => {
    const currentSearch = searchParams.get(searchParamKey) || ""
    if (searchVal !== currentSearch) {
      router.push(
        `${pathname}?${createQueryString({ [searchParamKey]: searchVal })}`
      )
    }
  })

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch()
    }, debounceMs)
    return () => clearTimeout(handler)
  }, [searchVal, onSearch, debounceMs])

  const handlePageChange = (newPage: number) => {
    router.push(
      `${pathname}?${createQueryString({ [pageParamKey]: newPage.toString() })}`
    )
  }

  const handleStatusFilterChange = (val: string) => {
    router.push(`${pathname}?${createQueryString({ [statusParamKey]: val })}`)
  }

  const resetFilters = () => {
    setSearchVal("")
    router.push(pathname)
  }

  return {
    page,
    perPage,
    searchVal,
    setSearchVal,
    statusFilter,
    handlePageChange,
    handleStatusFilterChange,
    resetFilters,
    createQueryString,
  }
}
