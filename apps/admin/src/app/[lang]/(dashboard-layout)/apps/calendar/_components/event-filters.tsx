import { Filter } from "lucide-react"

import { categoriesData } from "../_data/categories"

import { useCalendarContext } from "../_hooks/calendar-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function EventFilters() {
  const { calendarState, handleSelectCategory, handleSelectAllCategories } =
    useCalendarContext()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" aria-label="Filter calendar by">
          <Filter className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          // The "All" checkbox is checked if all categories are selected
          checked={
            calendarState.selectedCategories.length === categoriesData.length
          }
          onCheckedChange={handleSelectAllCategories}
        >
          All
        </DropdownMenuCheckboxItem>
        {(() => {
          const selectedSet = new Set(calendarState.selectedCategories)
          return categoriesData.map((category) => (
            <DropdownMenuCheckboxItem
              key={category}
              // Checkbox is checked if the current category is included in the selected categories array
              checked={selectedSet.has(category)}
              onCheckedChange={() => handleSelectCategory(category)}
            >
              {category}
            </DropdownMenuCheckboxItem>
          ))
        })()}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
