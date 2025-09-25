"use client";

import { TicketFilterDto, TicketStatus } from "@/lib/dtos/ticket";
import { Button } from "@/modules/ui/button";
import { Input } from "@/modules/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/modules/ui/select";
import { Search, X } from "lucide-react";

interface TicketFiltersProps {
  filters: TicketFilterDto;
  onFilterChange: (filters: TicketFilterDto) => void;
}

export function TicketFilters({ filters, onFilterChange }: TicketFiltersProps) {
  const handleClearFilters = () => {
    onFilterChange({});
  };

  const hasActiveFilters = filters.status || filters.search;

  const getStatusLabel = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.OPEN:
        return "Open";
      case TicketStatus.IN_PROGRESS:
        return "In Progress";
      case TicketStatus.CLOSED:
        return "Closed";
      default:
        return status;
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search tickets..."
            value={filters.search || ""}
            onChange={(e) =>
              onFilterChange({ ...filters, search: e.target.value || undefined })
            }
            className="pl-10 w-64"
          />
        </div>

        {/* Status Filter */}
        <Select
          value={filters.status || ""}
          onValueChange={(value) =>
            onFilterChange({ 
              ...filters, 
              status: value ? (value as TicketStatus) : undefined 
            })
          }
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All statuses</SelectItem>
            {Object.values(TicketStatus).map((status) => (
              <SelectItem key={status} value={status}>
                {getStatusLabel(status)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearFilters}
          className="flex items-center space-x-2"
        >
          <X className="h-4 w-4" />
          <span>Clear Filters</span>
        </Button>
      )}
    </div>
  );
}