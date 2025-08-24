import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import api from '@/services/api';
import { useNavigate } from 'react-router-dom';

const CreateListingPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    type: 'room',
    category: 'rent',
    region: '', // expect region id
    amenities: '' as any,
    images: ''
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload: any = {
        title: form.title,
        description: form.description,
        price: Number(form.price),
        type: form.type,
        category: form.category,
        region: form.region,
        amenities: String(form.amenities || '')
          .split(',')
          .map((a) => a.trim().toLowerCase())
          .filter(Boolean),
        images: String(form.images || '')
          .split(',')
          .map((u) => u.trim())
          .filter(Boolean)
          .map((url) => ({ url }))
      };
      await api.createListing(payload);
      navigate('/');
    } catch (err: any) {
      setError(err?.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gray-50">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Post a Listing</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <textarea className="w-full border rounded px-3 py-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <Input placeholder="Price (R)" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <div className="grid grid-cols-2 gap-3">
              <select className="w-full border rounded px-3 py-2" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                <option value="room">Room</option>
                <option value="flat">Flat</option>
                <option value="house">House</option>
                <option value="plot">Plot</option>
                <option value="backroom">Backroom</option>
              </select>
              <select className="w-full border rounded px-3 py-2" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                <option value="rent">For Rent</option>
                <option value="sale">For Sale</option>
              </select>
            </div>
            <Input placeholder="Region ID" value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} />
            <Input placeholder="Amenities (comma separated) e.g. wifi, water" value={form.amenities} onChange={(e) => setForm({ ...form, amenities: e.target.value })} />
            <Input placeholder="Image URLs (comma separated)" value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} />
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Posting...' : 'Post Listing'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateListingPage;

