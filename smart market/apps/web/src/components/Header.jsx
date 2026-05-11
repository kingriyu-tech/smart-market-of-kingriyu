import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useTheme } from '@/contexts/ThemeContext.jsx';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Menu, User, LogOut, BarChart3, Sun, Moon } from 'lucide-react';

const Header = () => {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const getDashboardLink = () => {
    if (!currentUser) return null;
    return currentUser.role === 'admin' ? '/admin' : '/user';
  };

  const NavLinks = ({ mobile = false }) => (
    <>
      <Link
        to="/"
        onClick={() => mobile && setIsMobileMenuOpen(false)}
        className={`text-sm font-medium transition-colors hover:text-primary touch-target md:min-h-0 md:min-w-0 ${
          isActive('/') ? 'text-primary' : 'text-foreground/80'
        }`}
      >
        Home
      </Link>
      {isAuthenticated && (
        <Link
          to={getDashboardLink()}
          onClick={() => mobile && setIsMobileMenuOpen(false)}
          className={`text-sm font-medium transition-colors hover:text-primary touch-target md:min-h-0 md:min-w-0 ${
            isActive(getDashboardLink()) ? 'text-primary' : 'text-foreground/80'
          }`}
        >
          Dashboard
        </Link>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80 touch-target md:min-h-0 md:min-w-0">
            <BarChart3 className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold tracking-tight">Smart Market</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLinks />
          </nav>

          {/* Desktop Auth Section & Theme Toggle */}
          <div className="hidden md:flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full transition-transform hover:scale-110 touch-target"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-yellow-400 transition-all" />
              ) : (
                <Moon className="h-5 w-5 text-slate-700 transition-all" />
              )}
            </Button>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 touch-target">
                    <User className="h-4 w-4" />
                    <span className="max-w-[150px] truncate">{currentUser?.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium">{currentUser?.email}</p>
                      <p className="text-xs text-muted-foreground capitalize">{currentUser?.role}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive cursor-pointer touch-target">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild className="touch-target">
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild className="touch-target">
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button & Theme Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full touch-target"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-yellow-400" />
              ) : (
                <Moon className="h-5 w-5 text-slate-700" />
              )}
            </Button>
            
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="touch-target" aria-label="Open menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] flex flex-col">
                <SheetHeader className="text-left border-b border-border pb-4">
                  <SheetTitle className="flex items-center gap-2">
                    <BarChart3 className="h-6 w-6 text-primary" />
                    Smart Market
                  </SheetTitle>
                </SheetHeader>
                
                <nav className="flex flex-col gap-2 py-6 flex-1">
                  <NavLinks mobile />
                </nav>

                <div className="pt-6 border-t border-border mt-auto">
                  {isAuthenticated ? (
                    <div className="flex flex-col gap-4">
                      <div className="px-2">
                        <p className="text-sm font-medium truncate">{currentUser?.email}</p>
                        <p className="text-xs text-muted-foreground capitalize">{currentUser?.role}</p>
                      </div>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          logout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full justify-start touch-target"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <Button variant="outline" asChild className="w-full touch-target">
                        <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                          Login
                        </Link>
                      </Button>
                      <Button asChild className="w-full touch-target">
                        <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                          Sign Up
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;