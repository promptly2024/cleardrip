import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';

export const UnauthorizedAccess = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-600">
          <Shield className="w-5 h-5" />
          Access Denied
        </CardTitle>
        <CardDescription>
          You need to be logged in to access this page.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={() => window.location.href = '/user/signin'} className="w-full">
          Go to Login
        </Button>
      </CardContent>
    </Card>
  </div>
);