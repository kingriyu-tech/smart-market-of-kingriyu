import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';
import Header from '@/components/Header.jsx';

const SignupPage = () => {
  const { signup } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    role: 'user'
  });
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setEmailError('');

    if (formData.password !== formData.passwordConfirm) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const result = await signup(
        formData.email,
        formData.password,
        formData.passwordConfirm,
        formData.role
      );
      
      if (!result.success) {
        const pbError = result.originalError;
        
        // Check for PocketBase specific validation errors on the email field
        if (pbError?.response?.data?.email) {
          setEmailError('This email is already registered. Please use a different email or try logging in.');
        } else {
          setError(result.error || 'Failed to create account. Please try again.');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Sign Up - Smart Market</title>
        <meta name="description" content="Create your Smart Market account to start tracking vegetable prices and market trends" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <BarChart3 className="h-12 w-12 text-primary" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Create your account</h1>
              <p className="text-muted-foreground">Get started with Smart Market today</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Sign up</CardTitle>
                <CardDescription>Fill in your details to create an account</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                      <p className="text-sm text-destructive">{error}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (emailError) setEmailError('');
                      }}
                      className={`text-foreground ${emailError ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                      required
                    />
                    {emailError && (
                      <p className="text-sm font-medium text-destructive mt-1">
                        {emailError}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="At least 8 characters"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="text-foreground"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="passwordConfirm">Confirm Password</Label>
                    <Input
                      id="passwordConfirm"
                      type="password"
                      placeholder="Re-enter your password"
                      value={formData.passwordConfirm}
                      onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
                      className="text-foreground"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Account Type</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) => setFormData({ ...formData, role: value })}
                    >
                      <SelectTrigger id="role" className="text-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User (View prices and predictions)</SelectItem>
                        <SelectItem value="admin">Admin (Manage prices and data)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Creating account...' : 'Create account'}
                  </Button>

                  <div className="text-center text-sm">
                    <span className="text-muted-foreground">Already have an account? </span>
                    <Link to="/login" className="text-primary hover:underline font-medium">
                      Sign in
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

export default SignupPage;