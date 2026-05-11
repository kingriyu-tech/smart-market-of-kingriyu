
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const navigate = useNavigate();

  // Check authentication on mount
  useEffect(() => {
    if (pb.authStore.isValid && pb.authStore.model) {
      setCurrentUser(pb.authStore.model);
      setIsAuthenticated(true);
    }
    setInitialLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const authData = await pb.collection('users').authWithPassword(email, password, { $autoCancel: false });
      setCurrentUser(authData.record);
      setIsAuthenticated(true);
      
      // Redirect based on role
      if (authData.record.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/user');
      }
      
      return { success: true, user: authData.record };
    } catch (error) {
      console.error('Login error:', error);
      
      let errorType = 'AUTH_FAILED';
      let errorMessage = 'Invalid email or password.';

      // Parse PocketBase specific validation errors to distinguish failure reasons
      const respData = error.response?.data || {};
      const errMsg = error.message?.toLowerCase() || '';
      const respMsg = error.response?.message?.toLowerCase() || '';

      if (respData.identity) {
        errorType = 'USER_NOT_FOUND';
        errorMessage = 'Email/username not found.';
      } else if (respData.password) {
        errorType = 'WRONG_PASSWORD';
        errorMessage = 'Incorrect password.';
      } else if (errMsg.includes('not found') || respMsg.includes('identity')) {
        errorType = 'USER_NOT_FOUND';
      } else if (errMsg.includes('password') || respMsg.includes('password')) {
        errorType = 'WRONG_PASSWORD';
      } else if (respMsg === 'failed to authenticate.') {
        // PocketBase returns a generic error when credentials don't match 
        // to prevent user enumeration. We assign a generic type.
        errorType = 'GENERIC_AUTH_FAILED';
      }

      return { 
        success: false, 
        type: errorType,
        error: errorMessage, 
        originalError: error 
      };
    }
  };

  const signup = async (email, password, passwordConfirm, role) => {
    try {
      // Admin account limit validation
      if (role === 'admin') {
        try {
          const adminList = await pb.collection('users').getList(1, 1, {
            filter: 'role="admin"',
            $autoCancel: false
          });
          
          if (adminList.totalItems >= 2) {
            return { 
              success: false, 
              type: 'ADMIN_LIMIT_REACHED', 
              error: 'Maximum 2 admin accounts allowed' 
            };
          }
        } catch (checkError) {
          console.warn('Could not verify admin count prior to creation:', checkError);
          // If the query fails due to listRule permissions for guests, we log it and proceed.
          // PocketBase backend rules or hooks would be the ultimate enforcer.
        }
      }

      const userData = {
        email,
        password,
        passwordConfirm,
        role,
        emailVisibility: true
      };

      const user = await pb.collection('users').create(userData, { $autoCancel: false });
      
      // Auto-login after signup
      const authData = await pb.collection('users').authWithPassword(email, password, { $autoCancel: false });
      setCurrentUser(authData.record);
      setIsAuthenticated(true);
      
      // Redirect based on role
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/user');
      }
      
      return { success: true, user };
    } catch (error) {
      console.error('Signup error:', error);
      return { 
        success: false, 
        type: 'SIGNUP_FAILED',
        error: error.message || 'Signup failed', 
        originalError: error 
      };
    }
  };

  const logout = () => {
    pb.authStore.clear();
    setCurrentUser(null);
    setIsAuthenticated(false);
    navigate('/');
  };

  const value = {
    currentUser,
    isAuthenticated,
    login,
    signup,
    logout,
    initialLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
