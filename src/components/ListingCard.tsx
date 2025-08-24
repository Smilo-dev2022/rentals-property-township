import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, MapPin, Phone, Wifi, Zap, Droplets } from 'lucide-react';
import { Listing } from '@/types';

interface ListingCardProps {
  listing: Listing;
  onContact: (listing: Listing) => void;
  onSave: (listingId: string) => void;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing, onContact, onSave }) => {
  const amenityIcons = {
    wifi: Wifi,
    electricity: Zap,
    water: Droplets,
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={listing.images[0] || '/placeholder.svg'}
          alt={listing.title}
          className="w-full h-48 object-cover"
        />
        {listing.isBoosted && (
          <Badge className="absolute top-2 left-2 bg-yellow-500">
            Featured
          </Badge>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white"
          onClick={() => onSave(listing.id)}
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg truncate">{listing.title}</h3>
          <div className="text-right">
            <p className="text-2xl font-bold text-green-600">R{listing.price}</p>
            <p className="text-sm text-gray-500">
              {listing.category === 'rent' ? '/month' : 'once-off'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{listing.region.township}, {listing.region.name}</span>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-3">
          <Badge variant="secondary">{listing.type}</Badge>
          {listing.amenities.slice(0, 3).map((amenity) => (
            <Badge key={amenity} variant="outline" className="text-xs">
              {amenity}
            </Badge>
          ))}
        </div>
        
        <p className="text-sm text-gray-600 line-clamp-2">{listing.description}</p>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={() => onContact(listing)}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          <Phone className="h-4 w-4 mr-2" />
          Contact Landlord
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ListingCard;