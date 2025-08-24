import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import api from '@/services/api';

const AdminRegionsPage: React.FC = () => {
  const [regions, setRegions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', township: '', city: '', province: 'Gauteng' });

  const fetchRegions = async () => {
    const res = await api.getRegions();
    setRegions(res.regions || []);
  };

  useEffect(() => {
    fetchRegions();
  }, []);

  const createRegion = async () => {
    setLoading(true);
    try {
      await fetch('http://localhost:5000/api/regions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(localStorage.getItem('token') ? { Authorization: `Bearer ${localStorage.getItem('token')}` } : {}) },
        body: JSON.stringify(form),
      });
      await fetchRegions();
      setForm({ name: '', township: '', city: '', province: 'Gauteng' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Regions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {regions.map((r) => (
                <div key={r._id} className="flex items-center justify-between border-b py-2 text-sm">
                  <span>{r.township}, {r.city} ({r.province})</span>
                </div>
              ))}
              {regions.length === 0 && <div className="text-gray-500">No regions yet.</div>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Create Region</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Input placeholder="Township" value={form.township} onChange={(e) => setForm({ ...form, township: e.target.value })} />
              <Input placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              <select className="w-full border rounded px-3 py-2" value={form.province} onChange={(e) => setForm({ ...form, province: e.target.value })}>
                {['Eastern Cape','Free State','Gauteng','KwaZulu-Natal','Limpopo','Mpumalanga','Northern Cape','North West','Western Cape'].map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <Button className="mt-4" onClick={createRegion} disabled={loading}>
              {loading ? 'Saving...' : 'Save Region'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminRegionsPage;

