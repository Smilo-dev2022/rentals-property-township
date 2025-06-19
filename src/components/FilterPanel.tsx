import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Filter } from '@/types';

interface FilterPanelProps {
  filters: Filter;
  onFiltersChange: (filters: Filter) => void;
  onClearFilters: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFiltersChange, onClearFilters }) => {
  const townships = [
    'Soweto', 'Katlehong', 'Tembisa', 'Mamelodi', 'Soshanguve',
    'Umlazi', 'KwaMashu', 'Nyanga', 'Gugulethu', 'Langa'
  ];

  const amenities = ['WiFi', 'Electricity', 'Water', 'Parking', 'Security'];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Filter Listings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="priceMin">Min Price (R)</Label>
            <Input
              id="priceMin"
              type="number"
              placeholder="500"
              value={filters.priceMin || ''}
              onChange={(e) => onFiltersChange({
                ...filters,
                priceMin: e.target.value ? Number(e.target.value) : undefined
              })}
            />
          </div>
          <div>
            <Label htmlFor="priceMax">Max Price (R)</Label>
            <Input
              id="priceMax"
              type="number"
              placeholder="5000"
              value={filters.priceMax || ''}
              onChange={(e) => onFiltersChange({
                ...filters,
                priceMax: e.target.value ? Number(e.target.value) : undefined
              })}
            />
          </div>
        </div>

        <div>
          <Label>Property Type</Label>
          <Select
            value={filters.type || ''}
            onValueChange={(value) => onFiltersChange({
              ...filters,
              type: value || undefined
            })}
          >
            <SelectTrigger>
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="room">Room</SelectItem>
              <SelectItem value="flat">Flat</SelectItem>
              <SelectItem value="house">House</SelectItem>
              <SelectItem value="plot">Plot</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Township</Label>
          <Select
            value={filters.township || ''}
            onValueChange={(value) => onFiltersChange({
              ...filters,
              township: value || undefined
            })}
          >
            <SelectTrigger>
              <SelectValue placeholder="All townships" />
            </SelectTrigger>
            <SelectContent>
              {townships.map((township) => (
                <SelectItem key={township} value={township}>
                  {township}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-base font-medium">Amenities</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {amenities.map((amenity) => (
              <div key={amenity} className="flex items-center space-x-2">
                <Checkbox
                  id={amenity}
                  checked={filters.amenities?.includes(amenity) || false}
                  onCheckedChange={(checked) => {
                    const currentAmenities = filters.amenities || [];
                    const newAmenities = checked
                      ? [...currentAmenities, amenity]
                      : currentAmenities.filter(a => a !== amenity);
                    onFiltersChange({
                      ...filters,
                      amenities: newAmenities.length > 0 ? newAmenities : undefined
                    });
                  }}
                />
                <Label htmlFor={amenity} className="text-sm">{amenity}</Label>
              </div>
            ))}
          </div>
        </div>

        <Button 
          variant="outline" 
          onClick={onClearFilters}
          className="w-full"
        >
          Clear Filters
        </Button>
      </CardContent>
    </Card>
  );
};

export default FilterPanel;