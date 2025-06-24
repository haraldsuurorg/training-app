"use client"

import * as React from "react"
import { CalendarIcon, MapPinIcon, UsersIcon } from "lucide-react"
import { format } from "date-fns"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EditTraining } from "./edit-training"
import { RegisterTraining } from "./register-training"
import { DeleteTrainingRegistration } from "./delete-training-registration"
import { Training } from "@/types"

// Virtual column for search functionality
const columns: ColumnDef<Training>[] = [
  {
    accessorKey: "title",
    header: "Title",
    filterFn: (row, id, value) => {
      const training = row.original
      const searchValue = value.toLowerCase()
      return (
        training.title.toLowerCase().includes(searchValue) ||
        training.description.toLowerCase().includes(searchValue) ||
        training.location.toLowerCase().includes(searchValue)
      )
    },
  }
]

export function TrainingsList({ trainings, futureTrainings, isAdmin }: { trainings: Training[], futureTrainings: Training[], isAdmin: boolean }) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [showPastTrainings, setShowPastTrainings] = React.useState(false)

  // Use futureTrainings by default, switch to all trainings when toggle is on
  const currentTrainings = showPastTrainings ? trainings : futureTrainings

  const table = useReactTable({
    data: currentTrainings,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, columnId, filterValue) => {
      if (!filterValue) return true
      
      const training = row.original as Training
      const searchValue = filterValue.toLowerCase()
      
      return (
        training.title.toLowerCase().includes(searchValue) ||
        training.description.toLowerCase().includes(searchValue) ||
        training.location.toLowerCase().includes(searchValue)
      )
    },
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  })

  return (
    <div className="w-full">
      {/* Search Input and Toggle */}
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Search trainings by title, description, or location"
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-md"
        />
        <Button
          variant={showPastTrainings ? "default" : "outline"}
          onClick={() => setShowPastTrainings(!showPastTrainings)}
          className="ml-4"
        >
          {showPastTrainings ? "Hide past trainings" : "Show past trainings"}
        </Button>
      </div>

      {/* Training Cards */}
      <div className="flex flex-col gap-4">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => {
            const training = row.original
            return (
              <div key={training.id} className="rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border p-8 flex flex-col md:flex-row gap-4 md:gap-8">
                <div className="flex-4 flex flex-col gap-2">
                  <h2 className="text-lg font-bold">{training.title}</h2>
                  <p className=" text-muted-foreground">{training.description}</p>
                </div>
                <div className="flex-2 flex flex-col gap-2">
                  {/* Date */}
                  <div className="flex items-center gap-2">
                    <CalendarIcon size={18} className="flex-shrink-0"/>
                    <p className=" text-muted-foreground">{format(new Date(training.date), 'dd/MM/yyyy HH:mm')}</p>
                  </div>
                  {/* Location */}
                  <div className="flex items-center gap-2">
                    <MapPinIcon size={18} />
                    <p className=" text-muted-foreground">{training.location}</p>
                  </div>
                  {/* Max participants */}
                  <div className="flex items-center gap-2">
                    <UsersIcon size={18} />
                    <p className=" text-muted-foreground">
                      {training.registrations_count || 0}/{training.max_participants}
                    </p>
                  </div>
                </div>
                <div className="flex-1">
                  {isAdmin ? (
                    <EditTraining training={training} />
                  ) : 'registrationId' in training ? (
                    <DeleteTrainingRegistration training={training as Training & { registrationId: number }} />
                  ) : (
                    <RegisterTraining training={training} />
                  )}
                </div>
              </div>
            )
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-lg font-semibold text-muted-foreground">No trainings found</p>
            <p className="text-sm text-muted-foreground mt-2">Try adjusting your search criteria</p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} training(s) found
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Trainings per page</p>
            <select
              value={`${table.getState().pagination.pageSize}`}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value))
              }}
              className="h-8 w-[70px] rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              {[10, 20, 50, 100].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {"<"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {">"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}