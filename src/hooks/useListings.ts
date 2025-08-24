import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { Listing, Filter } from '../types';

export const useListings = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filter>({
    priceMin: undefined,
    priceMax: undefined,
    type: undefined,
    township: undefined,
    amenities: undefined
  });

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch from API, fallback to mock data
      try {
        const response = await apiService.getListings({
          type: filters.type,
          township: filters.township,
          minPrice: filters.priceMin,
          maxPrice: filters.priceMax,
          amenities: filters.amenities?.map(a => a.toLowerCase()).join(',')
        });
        const normalized = (response.listings || []).map((l: any) => ({
          id: l._id,
          title: l.title,
          description: l.description,
          price: l.price,
          type: l.type,
          category: l.category,
          images: (l.images || []).map((img: any) => img.url || img),
          region: l.region ? {
            id: l.region._id || l.region.id || '',
            name: l.region.name,
            township: l.region.township,
            city: l.region.city,
            province: l.region.province,
          } : { id: '', name: '', township: '', city: '', province: '' },
          owner: l.owner ? {
            id: l.owner._id || l.owner.id || '',
            name: l.owner.name,
            email: l.owner.email,
            phone: l.owner.phone,
          } : { id: '', name: '', email: '' },
          amenities: l.amenities || [],
          contactInfo: l.contactInfo,
          deposit: l.deposit,
          isAvailable: l.isAvailable,
          isBoosted: l.isFeatured,
          isVerified: l.owner?.isVerified || false,
          createdAt: l.createdAt,
        }));
        setListings(normalized);
      } catch (apiError) {
        console.warn('API not available, using mock data:', apiError);
        // Fallback to mock data
        const mockListings: Listing[] = [
          {
            id: '1',
            title: 'Cozy Room in Soweto',
            description: 'Nice room with WiFi and electricity included',
            price: 1500,
            type: 'room',
            category: 'rent',
            images: ['/placeholder.svg'],
            region: {
              id: '1',
              name: 'Orlando East',
              township: 'Soweto',
              city: 'Johannesburg',
              province: 'Gauteng'
            },
            owner: {
              id: '1',
              name: 'John Doe',
              email: 'john@example.com',
              phone: '0123456789'
            },
            amenities: ['wifi', 'electricity'],
            contactInfo: {
              phone: '0123456789',
              whatsapp: '27123456789'
            },
            isAvailable: true,
            createdAt: new Date().toISOString()
          },
          {
            id: '2',
            title: 'Modern Flat in Katlehong',
            description: 'Two bedroom flat with parking',
            price: 3500,
            type: 'flat',
            category: 'rent',
            images: ['/placeholder.svg'],
            region: {
              id: '2',
              name: 'Katlehong Central',
              township: 'Katlehong',
              city: 'Germiston',
              province: 'Gauteng'
            },
            owner: {
              id: '2',
              name: 'Jane Smith',
              email: 'jane@example.com',
              phone: '0987654321'
            },
            amenities: ['parking', 'water'],
            contactInfo: {
              phone: '0987654321',
              whatsapp: '27987654321'
            },
            isAvailable: true,
            createdAt: new Date().toISOString()
          }
        ];
        setListings(mockListings);
      }
    } catch (err) {
      setError('Failed to fetch listings');
      console.error('Fetch listings error:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (newFilters: Filter) => {
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({
      priceMin: undefined,
      priceMax: undefined,
      type: undefined,
      township: undefined,
      amenities: undefined
    });
  };

  useEffect(() => {
    fetchListings();
  }, [JSON.stringify(filters)]);

  return {
    listings,
    loading,
    error,
    filters,
    updateFilters,
    clearFilters,
    refetch: fetchListings
  };
};