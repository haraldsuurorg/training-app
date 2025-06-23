"use client"

import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { MoreHorizontal, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RegistrationData } from "@/types"

interface ColumnActionsProps {
  onStatusChange: (registrationId: number, newStatus: string) => void
  onDeleteClick: (registrationId: number) => void
}

export const createColumns = ({ onStatusChange, onDeleteClick }: ColumnActionsProps): ColumnDef<RegistrationData>[] => [
  {
    accessorKey: "user.name",
    header: "User Name",
    cell: ({ row }) => {
      return <div className="font-medium">{row.original.user.name}</div>
    },
  },
  {
    accessorKey: "user.email",
    header: "Email",
    cell: ({ row }) => {
      return <div>{row.original.user.email}</div>
    },
  },
  {
    accessorKey: "training.title",
    header: "Training",
    cell: ({ row }) => {
      return <div>{row.original.training.title}</div>
    },
  },
  {
    accessorKey: "training.date",
    header: ({ column }) => {
      return (
        <Button
          variant="outline"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className=""
        >
          Training Date
          {column.getIsSorted() === "asc" && <span className="ml-1">↑</span>}
          {column.getIsSorted() === "desc" && <span className="ml-1">↓</span>}
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div>{format(new Date(row.original.training.date), 'dd/MM/yyyy HH:mm')}</div>
    },
    sortingFn: (rowA, rowB) => {
      const dateA = new Date(rowA.original.training.date)
      const dateB = new Date(rowB.original.training.date)
      return dateA.getTime() - dateB.getTime()
    },
  },
  {
    accessorKey: "registered_at",
    header: "Registration Date",
    cell: ({ row }) => {
      return <div>{format(new Date(row.original.registered_at), 'dd/MM/yyyy')}</div>
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const registration = row.original
      return (
        <Select
          value={registration.status}
          onValueChange={(value) => onStatusChange(registration.id, value)}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const registration = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem 
              className="text-red-600 focus:text-red-600 cursor-pointer"
              onClick={() => onDeleteClick(registration.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Registration
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
] 