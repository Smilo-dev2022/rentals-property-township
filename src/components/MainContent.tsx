import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Filter, SlidersHorizontal } from 'lucide-react';
import FilterPanel from './FilterPanel';
import ListingsGrid from './ListingsGrid';
import { useListings } from '@/hooks/useListings';

const MainContent: React.FC = () => {
  const { listings, loading, filters, updateFilters, clearFilters } = useListings();
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="flex-1 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Browse Listings</h1>
          <p className="text-gray-600 mt-1">
            {loading ? 'Loading...' : `${listings.length} properties available`}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden"
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters - Desktop */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <FilterPanel
            filters={filters}
            onFiltersChange={updateFilters}
            onClearFilters={clearFilters}
          />
        </div>

        {/* Filters - Mobile */}
        {showFilters && (
          <div className="lg:hidden mb-6">
            <FilterPanel
              filters={filters}
              onFiltersChange={updateFilters}
              onClearFilters={clearFilters}
            />
          </div>
        )}

        {/* Listings Grid */}
        <div className="flex-1">
          <ListingsGrid listings={listings} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default MainContent;