'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/hooks/use-translation';

export default function AboutPage() {
  const t = useTranslation();

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-card/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            {t('aboutHeroTitle')}
          </h1>
          <p className="text-lg text-muted-foreground text-balance">
            {t('aboutHeroSub')}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 md:py-32 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {/* Introduction */}
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle>{t('aboutWelcomeTitle')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  {t('aboutWelcomeP1')}
                </p>
                <p className="text-muted-foreground">
                  {t('aboutWelcomeP2')}
                </p>
              </CardContent>
            </Card>

            {/* Expertise */}
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">{t('aboutExpertiseTitle')}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  t('aboutExpGrammar'),
                  t('aboutExpConversation'),
                  t('aboutExpWriting'),
                  t('aboutExpPronunciation'),
                  t('aboutExpToefl'),
                  t('aboutExpBusiness')
                ].map((skill) => (
                  <Badge key={skill} variant="secondary" className="py-2 px-4 text-center justify-center">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Credentials */}
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle>{t('aboutCredentialsTitle')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">{t('aboutEduTitle')}</h3>
                  <p className="text-muted-foreground">{t('aboutEdu1')}</p>
                  <p className="text-muted-foreground">{t('aboutEdu2')}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">{t('aboutExpTitle')}</h3>
                  <p className="text-muted-foreground">{t('aboutExp1')}</p>
                  <p className="text-muted-foreground">{t('aboutExp2')}</p>
                </div>
              </CardContent>
            </Card>

            {/* Teaching Philosophy */}
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle>{t('aboutPhilosophyTitle')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  {t('aboutPhilosophyIntro')}
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>{t('aboutPhil1')}</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>{t('aboutPhil2')}</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>{t('aboutPhil3')}</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>{t('aboutPhil4')}</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
