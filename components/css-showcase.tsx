"use client"

import ScrollReveal from './scroll-reveal'

export default function CSSShowcase() {
  return (
    <div className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-8">
        <h2 className="text-4xl font-bold text-center mb-12 text-gradient text-center-justify text-balance">
          CSS Effects Showcase
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Glass Effect */}
          <ScrollReveal delay={100}>
            <div className="glass-effect rounded-2xl p-6 text-center">
              <h3 className="text-xl font-bold mb-4 text-center-justify text-balance">Glass Effect</h3>
              <p className="text-muted-foreground text-center-justify text-readable text-pretty">Beautiful frosted glass appearance</p>
            </div>
          </ScrollReveal>

          {/* Morphing Shape */}
          <ScrollReveal delay={200}>
            <div className="morphing-shape w-32 h-32 mx-auto mb-4"></div>
            <div className="text-center">
              <h3 className="text-xl font-bold mb-2">Morphing Shape</h3>
              <p className="text-muted-foreground">Continuously changing border radius</p>
            </div>
          </ScrollReveal>

          {/* Neon Glow */}
          <ScrollReveal delay={300}>
            <div className="bg-blue-600 text-white p-6 rounded-lg neon-glow text-center">
              <h3 className="text-xl font-bold mb-4">Neon Glow</h3>
              <p>Glowing text effect</p>
            </div>
          </ScrollReveal>

          {/* Gradient Border */}
          <ScrollReveal delay={400}>
            <div className="gradient-border p-6 text-center">
              <h3 className="text-xl font-bold mb-4">Gradient Border</h3>
              <p className="text-muted-foreground">Animated gradient border</p>
            </div>
          </ScrollReveal>

          {/* Hover Effects */}
          <ScrollReveal delay={500}>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center hover-rotate">
              <h3 className="text-xl font-bold mb-4">Hover Rotate</h3>
              <p className="text-muted-foreground">Hover to see rotation effect</p>
            </div>
          </ScrollReveal>

          {/* Shimmer Effect */}
          <ScrollReveal delay={600}>
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-lg text-white text-center animate-shimmer">
              <h3 className="text-xl font-bold mb-4">Shimmer Effect</h3>
              <p>Animated shimmer background</p>
            </div>
          </ScrollReveal>
        </div>

        {/* Animation Examples */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center mb-8">Animation Examples</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4 animate-float"></div>
              <p className="text-sm text-muted-foreground">Float Animation</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 animate-pulse-glow"></div>
              <p className="text-sm text-muted-foreground">Pulse Glow</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full mx-auto mb-4 animate-bounce-in"></div>
              <p className="text-sm text-muted-foreground">Bounce In</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-full mx-auto mb-4 animate-spin"></div>
              <p className="text-sm text-muted-foreground">Spin</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
