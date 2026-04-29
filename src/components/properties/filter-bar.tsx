'use client';

import * as React from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Filter, X } from "lucide-react";

import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface FilterBarProps {
  onFilterChange: (filters: any) => void;
}

export function FilterBar({ onFilterChange }: FilterBarProps) {
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const [isPriceOpen, setIsPriceOpen] = React.useState(false);
  const [filters, setFilters] = React.useState({
    type: "Todos",
    priceRange: [0, 5000000],
    beds: "Qualquer",
    petFriendly: false,
    furnished: false,
    parking: "Qualquer",
    suites: "Qualquer",
  });

  const updateFilters = (newFilters: any) => {
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    const defaultFilters = {
      type: "Todos",
      priceRange: [0, 5000000],
      beds: "Qualquer",
      petFriendly: false,
      furnished: false,
      parking: "Qualquer",
      suites: "Qualquer",
    };
    updateFilters(defaultFilters);
  };

  return (
    <div className="sticky top-20 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b py-4 shadow-sm">
      <div className="container mx-auto px-4 flex flex-wrap items-center gap-3">
        
        {/* Tipo de Imóvel */}
        <Select value={filters.type} onValueChange={(v) => updateFilters({ ...filters, type: v })}>
          <SelectTrigger className="w-[160px] h-10 rounded-full">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos">Todos os tipos</SelectItem>
            <SelectItem value="Apartamento">Apartamento</SelectItem>
            <SelectItem value="Casa">Casa</SelectItem>
            <SelectItem value="Cobertura">Cobertura</SelectItem>
            <SelectItem value="Terreno">Terreno</SelectItem>
          </SelectContent>
        </Select>

        {/* Quartos */}
        <Select value={filters.beds} onValueChange={(v) => updateFilters({ ...filters, beds: v })}>
          <SelectTrigger className="w-[140px] h-10 rounded-full">
            <SelectValue placeholder="Quartos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Qualquer">Quartos</SelectItem>
            <SelectItem value="1">1+ Quarto</SelectItem>
            <SelectItem value="2">2+ Quartos</SelectItem>
            <SelectItem value="3">3+ Quartos</SelectItem>
            <SelectItem value="4">4+ Quartos</SelectItem>
          </SelectContent>
        </Select>

        {/* Preço */}
        <Popover open={isPriceOpen} onOpenChange={setIsPriceOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-10 rounded-full px-6">
              Preço: {filters.priceRange[0] === 0 ? "Até" : "De R$"} {new Intl.NumberFormat('pt-BR', { notation: 'compact' }).format(filters.priceRange[1])}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-6 space-y-4">
            <h4 className="font-bold text-lg mb-4">Valor do imóvel</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="min-price" className="text-xs font-bold text-muted-foreground uppercase">Mínimo</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">R$</span>
                  <Input 
                    id="min-price"
                    className="pl-9 h-12 border-primary/20 focus-visible:ring-primary"
                    placeholder="0"
                    type="number"
                    value={filters.priceRange[0] || ""}
                    onChange={(e) => setFilters({ ...filters, priceRange: [Number(e.target.value), filters.priceRange[1]] })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-price" className="text-xs font-bold text-muted-foreground uppercase">Máximo</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">R$</span>
                  <Input 
                    id="max-price"
                    className="pl-9 h-12 border-primary/20 focus-visible:ring-primary"
                    placeholder="20.000.000"
                    type="number"
                    value={filters.priceRange[1] || ""}
                    onChange={(e) => setFilters({ ...filters, priceRange: [filters.priceRange[0], Number(e.target.value)] })}
                  />
                </div>
              </div>
            </div>

            <Button 
              variant="link" 
              className="px-0 text-primary font-bold hover:no-underline"
              onClick={() => {
                onFilterChange(filters);
                setIsPriceOpen(false);
              }}
            >
              Atualizar resultados
            </Button>
          </PopoverContent>
        </Popover>

        {/* Filtros Avançados (Sheet) */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="h-10 rounded-full gap-2">
              <Filter className="h-4 w-4" />
              <span>Mais filtros</span>
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-md">
            <SheetHeader className="mb-8">
              <SheetTitle className="text-2xl">Mais filtros</SheetTitle>
            </SheetHeader>
            
            <div className="space-y-8">
              {/* Vagas */}
              <div className="space-y-4">
                <Label className="text-base">Vagas de garagem</Label>
                <div className="flex gap-2">
                  {["Qualquer", "1", "2", "3"].map((val) => (
                    <Button
                      key={val}
                      variant={filters.parking === val ? "default" : "outline"}
                      onClick={() => setFilters({ ...filters, parking: val })}
                      className="rounded-full flex-1"
                    >
                      {val === "Qualquer" ? "Tanto faz" : `${val}+`}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Suítes */}
              <div className="space-y-4">
                <Label className="text-base">Suítes</Label>
                <div className="flex gap-2">
                  {["Qualquer", "1", "2"].map((val) => (
                    <Button
                      key={val}
                      variant={filters.suites === val ? "default" : "outline"}
                      onClick={() => setFilters({ ...filters, suites: val })}
                      className="rounded-full flex-1"
                    >
                      {val === "Qualquer" ? "Tanto faz" : `${val}+`}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Comodidades */}
              <div className="space-y-4">
                <Label className="text-base">Características</Label>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="pet" 
                      checked={filters.petFriendly} 
                      onCheckedChange={(v) => setFilters({ ...filters, petFriendly: !!v })}
                    />
                    <Label htmlFor="pet">Aceita pets</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="furnished" 
                      checked={filters.furnished} 
                      onCheckedChange={(v) => setFilters({ ...filters, furnished: !!v })}
                    />
                    <Label htmlFor="furnished">Mobiliado</Label>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 bg-background border-t">
              <Button onClick={() => {
                onFilterChange(filters);
                setIsSheetOpen(false);
              }} className="w-full h-12 text-lg">
                Ver resultados
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Reset */}
        <Button variant="ghost" onClick={resetFilters} className="h-10 rounded-full text-muted-foreground hover:text-foreground">
          <X className="mr-2 h-4 w-4" /> Limpar tudo
        </Button>
      </div>
    </div>
  );
}
