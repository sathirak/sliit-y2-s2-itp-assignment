"use client";

import { ContractFilterDto } from "@/lib/services/dtos/contract";
import { Input } from "@/modules/ui/input";
import { Button } from "@/modules/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/modules/ui/select";
import { Search, Filter, X } from "lucide-react";
import { useState } from "react";

interface ContractFiltersProps {
  filters: ContractFilterDto;
  onFilterChange: (filters: Partial<ContractFilterDto>) => void;
}

const STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const PAYMENT_STATUS = [
  { value: "true", label: "Paid" },
  { value: "false", label: "Unpaid" },
];

export function ContractFilters({ filters, onFilterChange }: ContractFiltersProps) {
  const [localFilters, setLocalFilters] = useState<Partial<ContractFilterDto>>({
    search: filters.search || "",
    title: filters.title || "",
    status: filters.status || "",
    isPaid: filters.isPaid,
    minAmount: filters.minAmount || "",
    maxAmount: filters.maxAmount || "",
    startDateFrom: filters.startDateFrom || "",
    startDateTo: filters.startDateTo || "",
    endDateFrom: filters.endDateFrom || "",
    endDateTo: filters.endDateTo || "",
  });

  const handleFilterChange = (key: keyof ContractFilterDto, value: string | number | boolean) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const applyFilters = () => {
    const cleanFilters = Object.fromEntries(
      Object.entries(localFilters).filter(([_, value]) => 
        value !== "" && value !== null && value !== undefined
      )
    );
    onFilterChange(cleanFilters);
  };

  const clearFilters = () => {
    setLocalFilters({
      search: "",
      title: "",
      status: "",
      isPaid: undefined,
      minAmount: "",
      maxAmount: "",
      startDateFrom: "",
      startDateTo: "",
      endDateFrom: "",
      endDateTo: "",
    });
    onFilterChange({});
  };

  const hasActiveFilters = Object.values(localFilters).some(
    value => value !== "" && value !== null && value !== undefined
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Filter className="h-4 w-4" />
        <span className="font-medium">Filters</span>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contracts..."
              value={localFilters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Title</label>
          <Input
            placeholder="Filter by title"
            value={localFilters.title}
            onChange={(e) => handleFilterChange("title", e.target.value)}
          />
        </div>

        {/* Status */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <Select
            value={localFilters.status}
            onValueChange={(value) => handleFilterChange("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {STATUSES.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Payment Status */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Payment Status</label>
          <Select
            value={localFilters.isPaid?.toString() || ""}
            onValueChange={(value) => handleFilterChange("isPaid", value === "true")}
          >
            <SelectTrigger>
              <SelectValue placeholder="All payments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All payments</SelectItem>
              {PAYMENT_STATUS.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Amount Range */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Min Amount</label>
          <Input
            type="number"
            placeholder="0"
            value={localFilters.minAmount}
            onChange={(e) => handleFilterChange("minAmount", e.target.value ? parseFloat(e.target.value) : "")}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Max Amount</label>
          <Input
            type="number"
            placeholder="100000"
            value={localFilters.maxAmount}
            onChange={(e) => handleFilterChange("maxAmount", e.target.value ? parseFloat(e.target.value) : "")}
          />
        </div>

        {/* Start Date Range */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Start Date From</label>
          <Input
            type="date"
            value={localFilters.startDateFrom}
            onChange={(e) => handleFilterChange("startDateFrom", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Start Date To</label>
          <Input
            type="date"
            value={localFilters.startDateTo}
            onChange={(e) => handleFilterChange("startDateTo", e.target.value)}
          />
        </div>

        {/* End Date Range */}
        <div className="space-y-2">
          <label className="text-sm font-medium">End Date From</label>
          <Input
            type="date"
            value={localFilters.endDateFrom}
            onChange={(e) => handleFilterChange("endDateFrom", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">End Date To</label>
          <Input
            type="date"
            value={localFilters.endDateTo}
            onChange={(e) => handleFilterChange("endDateTo", e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          variant="outline"
          onClick={clearFilters}
          className="flex items-center space-x-2"
          disabled={!hasActiveFilters}
        >
          <X className="h-4 w-4" />
          <span>Clear Filters</span>
        </Button>
        <Button onClick={applyFilters} className="flex items-center space-x-2">
          <Search className="h-4 w-4" />
          <span>Apply Filters</span>
        </Button>
      </div>
    </div>
  );
}
