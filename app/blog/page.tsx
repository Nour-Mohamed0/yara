import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Calendar, User } from 'lucide-react';

export const metadata = {
  title: 'Blog | English Teacher Portfolio',
  description: 'Read articles about English learning, grammar tips, and educational insights.',
};

const blogPosts = [
  {
    id: 1,
    slug: 'mastering-english-grammar',
    title: 'Mastering English Grammar: Essential Tips',
    description: 'Learn the fundamental rules of English grammar and common mistakes to avoid.',
    date: '2024-05-10',
    author: 'Teacher',
    category: 'Grammar',
  },
  {
    id: 2,
    slug: 'improve-your-pronunciation',
    title: 'How to Improve Your English Pronunciation',
    description: 'Practical techniques to develop clear and confident English pronunciation.',
    date: '2024-05-05',
    author: 'Teacher',
    category: 'Speaking',
  },
  {
    id: 3,
    slug: 'essential-vocabulary-building',
    title: 'Essential Vocabulary Building Strategies',
    description: 'Effective methods to expand your English vocabulary quickly and retain it.',
    date: '2024-04-28',
    author: 'Teacher',
    category: 'Vocabulary',
  },
  {
    id: 4,
    slug: 'advanced-writing-techniques',
    title: 'Advanced Writing Techniques for Fluency',
    description: 'Master the art of writing compelling essays and professional correspondence.',
    date: '2024-04-20',
    author: 'Teacher',
    category: 'Writing',
  },
  {
    id: 5,
    slug: 'idioms-and-phrases',
    title: 'Understanding English Idioms and Phrases',
    description: 'Explore commonly used idioms and how to use them naturally in conversation.',
    date: '2024-04-15',
    author: 'Teacher',
    category: 'Idioms',
  },
  {
    id: 6,
    slug: 'listening-comprehension-tips',
    title: 'Listening Comprehension Tips for Learners',
    description: 'Strategies to improve your listening skills and understand native speakers.',
    date: '2024-04-10',
    author: 'Teacher',
    category: 'Listening',
  },
];

export default function BlogPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-card/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Blog & Resources
          </h1>
          <p className="text-lg text-muted-foreground text-balance">
            Tips, insights, and guides for English learners
          </p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-20 md:py-32 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {blogPosts.map((post) => {
              const postDate = new Date(post.date);
              const formattedDate = postDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              });

              return (
                <Card key={post.id} className="border-border/40 hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <Link href={`/blog/${post.slug}`}>
                      <CardTitle className="hover:text-primary transition-colors">
                        {post.title}
                      </CardTitle>
                    </Link>
                    <CardDescription>{post.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formattedDate}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {post.author}
                      </div>
                      <div className="px-2 py-1 bg-primary/10 rounded text-primary">
                        {post.category}
                      </div>
                    </div>
                    <Link href={`/blog/${post.slug}`}>
                      <Button variant="ghost" className="gap-2">
                        Read Article <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
