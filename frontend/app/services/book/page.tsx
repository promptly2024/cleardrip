"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, Clock, Loader2, Shield } from 'lucide-react';
import { LoadingSpinner } from '@/components/core/Loader';
import { UnauthorizedAccess } from '@/components/core/UnauthorizedAccess';
import { ServicesClass } from '@/lib/httpClient/services';
import { BookServiceForm } from '@/lib/types/services';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';


export default function BookServicePage() {
    const { authenticated, authLoading, isUser, isAdmin, isSuperAdmin } = useAuth();
    const [form, setForm] = useState<BookServiceForm>({
        type: 'AMC',
        scheduledDate: '',
        beforeImageUrl: '',
        afterImageUrl: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const router = useRouter();
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
          console.log("Booking service with details:", form);
          await ServicesClass.bookService(form);
          setSuccess(true);
          setTimeout(() => router.push('/services'), 2000);
        } 
        catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } 
        finally {
            setLoading(false);
        }
    };
    
    // Show loading spinner while checking authentication
    if (authLoading) {
        return <LoadingSpinner />;
    }
    
    // Show unauthorized if not logged in or doesn't have required role
    if (!authenticated) {
        return <UnauthorizedAccess />;
    }

    return (
        <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Book a Service
          </CardTitle>
          <CardDescription>
            Schedule a new service appointment
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="mb-4">
              <AlertDescription>Service booked successfully! Redirecting...</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="type">Service Type</Label>
              <Select value={form.type} onValueChange={(value: 'AMC' | 'URGENT') => setForm({ ...form, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select service type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AMC">AMC (Annual Maintenance Contract)</SelectItem>
                  <SelectItem value="URGENT">Urgent Service</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduledDate">Scheduled Date</Label>
              <Input
                id="scheduledDate"
                type="datetime-local"
                value={form.scheduledDate}
                onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="beforeImageUrl">Before Image URL (Optional)</Label>
              <Input
                id="beforeImageUrl"
                type="url"
                value={form.beforeImageUrl}
                onChange={(e) => setForm({ ...form, beforeImageUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="afterImageUrl">After Image URL (Optional)</Label>
              <Input
                id="afterImageUrl"
                type="url"
                value={form.afterImageUrl}
                onChange={(e) => setForm({ ...form, afterImageUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Booking...
                  </>
                ) : (
                  'Book Service'
                )}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push('/services')}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}