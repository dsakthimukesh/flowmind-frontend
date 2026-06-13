import { useSearchParams } from "react-router"
import { useMemo } from "react"
import { type AuditLogFilters } from "../types/auditLog.types"

export const useAuditLogFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const page = Number(searchParams.get("page") || "1")
  const pageSize = Number(searchParams.get("pageSize") || "10")
  const action = searchParams.get("action") || undefined
  const resourceType = searchParams.get("resourceType") || undefined
  const actorId = searchParams.get("actorId") || undefined
  const dateRange = (searchParams.get("dateRange") as AuditLogFilters["dateRange"]) || undefined
  const customDateFrom = searchParams.get("dateFrom") || undefined
  const customDateTo = searchParams.get("dateTo") || undefined

  // Compute dateFrom/dateTo based on dateRange selection
  const computedDates = useMemo(() => {
    if (!dateRange || dateRange === "custom") {
      return {
        dateFrom: customDateFrom,
        dateTo: customDateTo,
      }
    }

    const now = new Date()
    let fromDate: Date

    switch (dateRange) {
      case "today":
        fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        break
      case "7days":
        fromDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case "30days":
        fromDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      default:
        return { dateFrom: undefined, dateTo: undefined }
    }

    return {
      dateFrom: fromDate.toISOString(),
      dateTo: now.toISOString(),
    }
  }, [dateRange, customDateFrom, customDateTo])

  // Aggregate active filter parameters for API request
  const filters = useMemo<AuditLogFilters>(() => {
    return {
      page,
      pageSize,
      action,
      resourceType,
      actorId,
      dateRange,
      dateFrom: computedDates.dateFrom,
      dateTo: computedDates.dateTo,
    }
  }, [page, pageSize, action, resourceType, actorId, dateRange, computedDates])

  const setFilter = (key: keyof AuditLogFilters, value: any) => {
    setSearchParams((prev) => {
      if (value === undefined || value === null || value === "" || value === "ALL") {
        prev.delete(key)
      } else {
        prev.set(key, String(value))
      }

      // If dateRange changes, update dateFrom/dateTo accordingly or clean custom dates
      if (key === "dateRange") {
        if (value !== "custom") {
          prev.delete("dateFrom")
          prev.delete("dateTo")
        }
      }

      // Reset page to 1 whenever any filter parameter changes
      if (key !== "page") {
        prev.set("page", "1")
      }
      return prev
    })
  }

  const setFilters = (newFilters: Partial<AuditLogFilters>) => {
    setSearchParams((prev) => {
      Object.entries(newFilters).forEach(([key, val]) => {
        if (val === undefined || val === null || val === "" || val === "ALL") {
          prev.delete(key)
        } else {
          prev.set(key, String(val))
        }
      })

      // Clean custom dates if dateRange changes to non-custom
      if (newFilters.dateRange && newFilters.dateRange !== "custom") {
        prev.delete("dateFrom")
        prev.delete("dateTo")
      }

      prev.set("page", "1")
      return prev
    })
  }

  const clearFilters = () => {
    setSearchParams((prev) => {
      prev.delete("action")
      prev.delete("resourceType")
      prev.delete("actorId")
      prev.delete("dateRange")
      prev.delete("dateFrom")
      prev.delete("dateTo")
      prev.set("page", "1")
      return prev
    })
  }

  return {
    filters,
    setFilter,
    setFilters,
    clearFilters,
  }
}
