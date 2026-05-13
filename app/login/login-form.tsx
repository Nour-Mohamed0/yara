'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

function LoginFormFields() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || data.error || 'Login failed. Please try again.');
        setLoading(false);
        return;
      }

      router.push(from);
    } catch {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Card className="glass-effect neon-glow-cyan p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Admin <span className="text-primary neon-text-cyan">Access</span>
        </h1>
        <p className="text-muted-foreground">Sign in to manage your portfolio</p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 rounded-lg bg-destructive/10 border border-destructive text-destructive text-sm"
        >
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
            Email Address
          </label>
          <Input
            id="email"
            type="email"
            placeholder="admin@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
            Password
          </label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </Button>
      </form>

      <div className="mt-6 p-4 rounded-lg bg-muted/30 border border-border">
        <p className="text-xs font-medium text-muted-foreground mb-2">Demo Credentials:</p>
        <p className="text-xs text-muted-foreground">Email: admin@example.com</p>
        <p className="text-xs text-muted-foreground">Password: admin123</p>
      </div>

      <div className="mt-6 text-center">
        <Link href="/" className="text-sm text-primary hover:underline">
          Back to Home
        </Link>
      </div>
    </Card>
  );
}

export function LoginForm() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <Suspense
        fallback={
          <Card className="glass-effect neon-glow-cyan p-8 flex justify-center py-16">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </Card>
        }
      >
        <LoginFormFields />
      </Suspense>
    </motion.div>
  );
}
