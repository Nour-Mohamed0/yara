import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Social Links | Admin',
  description: 'Manage social media links',
};

export default function SocialLinksPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Social Links</h1>
          <p className="text-muted-foreground mt-2">Manage your social media links</p>
        </div>
        <Button>Add Link</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Social Media</CardTitle>
          <CardDescription>Your social links</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No links yet. Add your social media profiles!</p>
        </CardContent>
      </Card>
    </div>
  );
}
