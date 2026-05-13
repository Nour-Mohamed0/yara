import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const metadata = {
  title: 'Courses | English Teacher Portfolio',
  description: 'Browse our comprehensive English courses for all levels.',
};

const courses = [
  {
    id: 1,
    title: 'English Fundamentals',
    description: 'Start your English journey with basics.',
    level: 'Beginner',
    duration: '8 weeks',
    students: 256,
  },
  {
    id: 2,
    title: 'Intermediate Conversations',
    description: 'Improve your speaking and listening skills.',
    level: 'Intermediate',
    duration: '10 weeks',
    students: 189,
  },
  {
    id: 3,
    title: 'Advanced Writing',
    description: 'Master written English for academic and professional use.',
    level: 'Advanced',
    duration: '12 weeks',
    students: 142,
  },
  {
    id: 4,
    title: 'Business English',
    description: 'English for professional and corporate environments.',
    level: 'Intermediate',
    duration: '10 weeks',
    students: 178,
  },
  {
    id: 5,
    title: 'IELTS Preparation',
    description: 'Comprehensive preparation for the IELTS exam.',
    level: 'Advanced',
    duration: '8 weeks',
    students: 203,
  },
  {
    id: 6,
    title: 'TOEFL Mastery',
    description: 'Master the TOEFL exam with expert guidance.',
    level: 'Advanced',
    duration: '10 weeks',
    students: '165',
  },
];

const levelColors = {
  'Beginner': 'bg-blue-500/20 text-blue-700 dark:text-blue-400',
  'Intermediate': 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
  'Advanced': 'bg-green-500/20 text-green-700 dark:text-green-400',
};

export default function CoursesPage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-card/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Our Courses
          </h1>
          <p className="text-lg text-muted-foreground text-balance">
            Choose from our comprehensive selection of English courses
          </p>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-20 md:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="border-border/40 hover:shadow-lg transition-shadow flex flex-col">
                <div className="h-32 bg-gradient-to-br from-primary/20 to-accent/20" />
                <CardHeader>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <Badge className={levelColors[course.level as keyof typeof levelColors]}>
                      {course.level}
                    </Badge>
                  </div>
                  <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <div>📅 {course.duration}</div>
                    <div>👥 {course.students} students</div>
                  </div>
                  <Button className="w-full">Enroll Now</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
