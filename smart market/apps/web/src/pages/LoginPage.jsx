
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';
import Header from '@/components/Header.jsx';

const LoginPage = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      if (!result.success) {
        // Display specific error messages based on the error type returned from AuthContext
        if (result.type === 'USER_NOT_FOUND') {
          setError('Email/username not found. Please check and try again.');
        } else if (result.type === 'WRONG_PASSWORD') {
          setError('Incorrect password. Please try again.');
        } else if (result.type === 'GENERIC_AUTH_FAILED') {
          // If PocketBase obfuscates the error, we provide a compound message
          setError('Email/username not found or incorrect password. Please try again.');
        } else {
          setError(result.error || 'Login failed. Please try again.');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear errors when the user starts typing
    if (error) {
      setError('');
    }
  };

  return (
    <>
      <Helmet>
        <title>Login - Smart Market</title>
        <meta name="description" content="Sign in to your Smart Market account to access price tracking and analytics" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <BarChart3 className="h-12 w-12 text-primary" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
              <p className="text-muted-foreground">Sign in to your account to continue</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Enter your credentials to access your dashboard</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 transition-all duration-200">
                      <p className="text-sm font-medium text-destructive">{error}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`text-foreground ${error ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className={`text-foreground ${error ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full touch-target mt-2" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign in'}
                  </Button>

                  <div className="text-center text-sm mt-4">
                    <span className="text-muted-foreground">Don't have an account? </span>
                    <Link to="/signup" className="text-primary hover:underline font-medium touch-target sm:min-h-0 sm:min-w-0 inline-flex">
                      Sign up
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
