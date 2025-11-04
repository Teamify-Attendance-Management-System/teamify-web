import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { QrCode, Users, BarChart3, Shield, Clock, Zap } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10"></div>
        
        <div className="container mx-auto px-4 py-24 relative">
          <div className="text-center max-w-4xl mx-auto animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Modern Workforce Management</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent leading-tight">
              Attendance Made
              <br />
              Simple & Smart
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Track employee attendance with QR codes, real-time monitoring, and powerful analytics. 
              Perfect for modern businesses of any size.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 shadow-large hover:shadow-glow transition-all">
                <Link to="/auth">Get Started Free</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8">
                <Link to="/auth">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-transparent to-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything You Need</h2>
            <p className="text-xl text-muted-foreground">Powerful features for complete attendance management</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <FeatureCard
              icon={<QrCode className="w-8 h-8" />}
              title="QR Code Check-In"
              description="Instant check-in/out with secure QR codes. Fast, contactless, and accurate."
            />
            <FeatureCard
              icon={<Users className="w-8 h-8" />}
              title="User Management"
              description="Manage employees, departments, and roles with ease from one dashboard."
            />
            <FeatureCard
              icon={<BarChart3 className="w-8 h-8" />}
              title="Real-Time Analytics"
              description="Monitor attendance patterns with live data and interactive reports."
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8" />}
              title="Secure & Compliant"
              description="Enterprise-grade security with role-based access control."
            />
            <FeatureCard
              icon={<Clock className="w-8 h-8" />}
              title="Shift Management"
              description="Flexible scheduling with support for multiple shifts and locations."
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8" />}
              title="Mobile First"
              description="Native mobile apps for iOS and Android with offline support."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gradient-card rounded-3xl p-12 shadow-large border border-border/50 text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join hundreds of businesses already using AttendHub
            </p>
            <Button size="lg" className="text-lg px-8 shadow-glow">
              <Link to="/auth">Start Free Trial</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <div className="group relative bg-card rounded-2xl p-8 shadow-soft hover:shadow-medium transition-all duration-300 border border-border/50 hover:border-primary/30">
      <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity"></div>
      <div className="relative">
        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

export default Index;
