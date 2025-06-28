// src/components/CustomerCombobox.tsx
import * as React from "react";
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Customer } from "@/Types/types";

interface CustomerComboboxProps {
  customers: Customer[];
  selectedCustomer: Customer | null;
  onSelectCustomer: (customer: Customer | null) => void;
  onAddNew: () => void;
  disabled?: boolean;
}

export function CustomerCombobox({ customers, selectedCustomer, onSelectCustomer, onAddNew, disabled }: CustomerComboboxProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full sm:w-[250px] justify-between"
          disabled={disabled}
        >
          {selectedCustomer
            ? `${selectedCustomer.name} - ${selectedCustomer.phone}`
            : "Select customer..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search customer by name or phone..." />
          <CommandList>
            <CommandEmpty>No customer found.</CommandEmpty>
            <CommandGroup>
              <CommandItem onSelect={onAddNew} className="cursor-pointer text-brand-pink-DEFAULT">
                 <PlusCircle className="mr-2 h-4 w-4" />
                 Add New Customer
              </CommandItem>
              {customers.map((customer) => (
                <CommandItem
                  key={customer.id}
                  value={`${customer.name} ${customer.phone}`}
                  onSelect={() => {
                    onSelectCustomer(customer);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedCustomer?.id === customer.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div>
                    <p>{customer.name}</p>
                    <p className="text-xs text-muted-foreground">{customer.phone}</p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}