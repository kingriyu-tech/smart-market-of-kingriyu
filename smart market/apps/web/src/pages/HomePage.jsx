import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, BarChart3, Zap, Shield } from 'lucide-react';
import Header from '@/components/Header.jsx';

const HomePage = () => {
  const features = [
    {
      icon: <TrendingUp className="h-8 w-8 text-primary" />,
      title: 'Real-time tracking',
      description: 'Monitor vegetable market prices with up-to-date data and historical trends'
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-primary" />,
      title: 'Trend analysis',
      description: 'Visualize price movements over time with interactive charts and graphs'
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: 'Price predictions',
      description: 'Get 7-day price forecasts using advanced linear regression algorithms'
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: 'Role-based access',
      description: 'Secure admin controls for data management and public dashboards for users'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Smart Market Price Monitoring System</title>
        <meta name="description" content="Track vegetable market prices, analyze trends, and predict future prices with our intelligent monitoring system" />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        {/* Hero Section */}
        <section className="relative min-h-[100dvh] flex items-center overflow-hidden -mt-16 pt-16">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1585555571866-98ebc2787685"
              alt="Fresh vegetables at market"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/80" />
          </div>

          {/* Content */}
          <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
            <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4 sm:mb-6 tracking-tight">
                  Smart market price monitoring
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed max-w-2xl">
                  Track vegetable prices, analyze market trends, and predict future movements with data-driven insights
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" asChild className="text-base w-full sm:w-auto touch-target">
                    <Link to="/signup">Get started</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="text-base w-full sm:w-auto touch-target">
                    <Link to="/login">Sign in</Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 sm:py-24 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12 sm:mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
                Everything you need to track market prices
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                Powerful tools for administrators and insightful analytics for users
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 border-border/50">
                    <CardContent className="p-6">
                      <div className="mb-4 p-3 bg-primary/10 inline-block rounded-xl">{feature.icon}</div>
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 sm:mb-6 tracking-tight">
                Ready to start tracking prices?
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground mb-8">
                Join our platform today and gain access to real-time market data and predictive analytics
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button size="lg" asChild className="w-full sm:w-auto touch-target">
                  <Link to="/signup">Create account</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="w-full sm:w-auto touch-target">
                  <Link to="/login">Sign in</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border bg-muted/30 mt-auto">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
              <p className="text-sm text-muted-foreground">
                © 2026 Smart Market. All rights reserved.
              </p>
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                <Link to="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors touch-target sm:min-h-0 sm:min-w-0">
                  Privacy Policy
                </Link>
                <Link to="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors touch-target sm:min-h-0 sm:min-w-0">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default HomePage;