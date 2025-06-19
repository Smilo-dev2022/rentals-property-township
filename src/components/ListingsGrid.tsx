import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import ListingCard from './ListingCard';
import { Listing } from '@/types';
import { toast } from '@/components/ui/use-toast';

interface ListingsGridProps {
  listings: Listing[];
  loading: boolean;
}

const ListingsGrid: React.FC<ListingsGridProps> = ({ listings, loading }) => {
  const handleContact = (listing: Listing) => {
    // Simulate WhatsApp integration
    const message = `Hi ${listing.landlordName}, I'm interested in your listing: ${listing.title}`;
    const whatsappUrl = `https://wa.me/${listing.landlordPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "Opening WhatsApp",
      description: "Redirecting to WhatsApp to contact the landlord.",
    });
  };

  const handleSave = (listingId: string) => {
    // Simulate saving to favorites
    toast({
      title: "Listing Saved",
      description: "Added to your saved listings.",
    });
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-2">No listings found</div>
        <p className="text-gray-400">Try adjusting your filters or search criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <ListingCard
          key={listing.id}
          listing={listing}
          onContact={handleContact}
          onSave={handleSave}
        />
      ))}
    </div>
  );
};

export default ListingsGrid;