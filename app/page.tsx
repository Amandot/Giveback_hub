import ScrollReveal from '@/components/scroll-reveal'
import ParticleBackground from '@/components/particle-background'
import { Heart, Shield, Users, Zap, CheckCircle, Sparkles } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center relative overflow-hidden">
      {/* Particle Background */}
      <ParticleBackground />
      
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-200/10 rounded-full blur-3xl"></div>
      </div>

      <div className="text-center max-w-6xl mx-auto p-8 relative z-10">
        {/* Hero Section */}
        <div className="animate-text-focus-in">
          <h1 className="text-6xl font-bold text-gradient mb-6 leading-tight animate-slide-in-blurred-top text-center-justify text-balance">
            Welcome to GiveBack Hub
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up stagger-1 text-center-justify text-readable text-pretty">
            Empowering Communities, Changing Lives through meaningful connections and impactful donations
          </p>
        </div>
        
        {/* Action Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Donor Card */}
          <div className="animate-fade-in-left stagger-1 card-hover glass-effect rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover-tilt">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-float shadow-lg">
              <Heart className="w-9 h-9 text-white" fill="currentColor" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4 text-center-justify text-balance">For Donors</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed text-center-justify text-readable text-pretty">
              Donate items and track your impact. See how your contributions make a real difference in communities.
            </p>
            <a 
              href="/auth/user-login" 
              className="btn-primary w-full text-center block hover-zoom"
            >
              Sign In as Donor
            </a>
          </div>
          
          {/* Admin Card */}
          <div className="animate-fade-in-up stagger-2 card-hover glass-effect rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover-rotate">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse-glow shadow-lg">
              <Shield className="w-9 h-9 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4 text-center-justify text-balance">For Admins</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed text-center-justify text-readable text-pretty">
              Manage donations and operations. Oversee the platform and ensure smooth operations.
            </p>
            <a 
              href="/auth/admin-login" 
              className="btn-primary w-full text-center block hover-zoom"
            >
              Sign In as Admin
            </a>
          </div>
          
          {/* NGO Card */}
          <div className="animate-fade-in-right stagger-3 card-hover glass-effect rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover-tilt">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 morphing-shape shadow-lg">
              <Users className="w-9 h-9 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4 text-center-justify text-balance">For NGOs</h2>
            <p className="text-muted-foreground mb-6 leading-relaxed text-center-justify text-readable text-pretty">
              Register your organization to receive donations and connect with generous donors in your community.
            </p>
            <a 
              href="/admin-signup" 
              className="btn-accent w-full text-center block hover-zoom"
            >
              Register Your NGO
            </a>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="mt-16 animate-fade-in-up stagger-4">
          <div className="glass-effect rounded-2xl p-8 max-w-4xl mx-auto">
            {/* <h3 className="text-2xl font-bold text-foreground mb-4 text-shadow-glow text-center-justify text-balance">Why Choose GiveBack Hub?</h3> */}
            {/* <h3 className="text-2xl font-bold text-blue-400 mb-4 text-shadow-glow text-center-justify text-balance">
  Why Choose GiveBack Hub?
</h3> */}
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <ScrollReveal delay={100}>
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto hover-zoom animate-bounce-in">
                    <Zap className="w-6 h-6 text-blue-600" fill="currentColor" />
                  </div>
                  <h4 className="font-semibold text-foreground text-center-justify text-balance">Fast & Easy</h4>
                  <p className="text-sm text-muted-foreground text-center-justify text-readable text-pretty">Quick setup and seamless user experience</p>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={200}>
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto hover-zoom animate-bounce-in">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-foreground text-center-justify text-balance">Transparent</h4>
                  <p className="text-sm text-muted-foreground text-center-justify text-readable text-pretty">Track every donation and its impact</p>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={300}>
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto hover-zoom animate-bounce-in">
                    <Sparkles className="w-6 h-6 text-purple-600" fill="currentColor" />
                  </div>
                  <h4 className="font-semibold text-foreground text-center-justify text-balance">Impactful</h4>
                  <p className="text-sm text-muted-foreground text-center-justify text-readable text-pretty">Make a real difference in communities</p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>

        {/* AI Feature Highlight */}
        {/* <div className="mt-16 animate-fade-in-up stagger-5">
          <div className="glass-effect rounded-2xl p-8 max-w-4xl mx-auto bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="w-8 h-8 text-blue-600 animate-pulse" />
              <h3 className="text-3xl font-bold text-gradient text-center-justify text-balance">
                NEW: AI-Powered Donations
              </h3>
              <Sparkles className="w-8 h-8 text-purple-600 animate-pulse" />
            </div>
            <p className="text-lg text-muted-foreground mb-6 text-center text-center-justify text-readable text-pretty">
              Upload a photo of your donation item and let our AI do the work! Powered by Google Gemini 1.5 Flash.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a 
                href="/donate" 
                className="btn-primary px-8 py-3 text-lg hover-zoom inline-flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Donate Now (AI-Powered)
              </a>
            </div>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2 justify-center">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-muted-foreground">Auto-identifies items</span>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-muted-foreground">Fills form automatically</span>
              </div>
              <div className="flex items-center gap-2 justify-center">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-muted-foreground">Validates donations</span>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  )
}
