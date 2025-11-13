"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function TransactionsFilters({ filters, categories, onFilterChange, onClearFilters }) {
  const hasActiveFilters = 
    filters.type !== "All" ||
    filters.category !== "All" ||
    filters.dateFrom !== "" ||
    filters.dateTo !== "" ||
    filters.searchText !== "";

  return (
    <div className="bg-white rounded-xl border border-[var(--color-card-border)] p-4 md:p-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-[var(--color-foreground-secondary)] mb-2">
            Type
          </label>
          <Select value={filters.type} onValueChange={(value) => onFilterChange("type", value)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
              <SelectItem value="income">Income</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-[var(--color-foreground-secondary)] mb-2">
            Category
          </label>
          <Select value={filters.category} onValueChange={(value) => onFilterChange("category", value)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-[var(--color-foreground-secondary)] mb-2">
            From Date
          </label>
          <Input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => onFilterChange("dateFrom", e.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-[var(--color-foreground-secondary)] mb-2">
            To Date
          </label>
          <Input
            type="date"
            value={filters.dateTo}
            onChange={(e) => onFilterChange("dateTo", e.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-[var(--color-foreground-secondary)] mb-2">
            Search
          </label>
          <Input
            type="text"
            placeholder="Search merchant..."
            value={filters.searchText}
            onChange={(e) => onFilterChange("searchText", e.target.value)}
            className="w-full"
          />
        </div>

        {hasActiveFilters && (
          <div className="flex items-end">
            <Button variant="outline" onClick={onClearFilters} size="sm">
              <X className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

