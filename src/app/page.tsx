export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-foreground/10">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <nav className="flex items-center justify-between">
            <div className="font-bold text-2xl font-mono">TAKOPI</div>
            <div className="flex items-center gap-6">
              <a href="#features" className="hover:text-foreground/70 transition-colors">
                Features
              </a>
              <a href="#about" className="hover:text-foreground/70 transition-colors">
                About
              </a>
              <a href="#contact" className="hover:text-foreground/70 transition-colors">
                Contact
              </a>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center space-y-8">
          <h1 className="text-6xl sm:text-8xl font-bold font-mono tracking-tight">
            TAKOPI
          </h1>
          <p className="text-xl sm:text-2xl text-foreground/80 max-w-2xl mx-auto">
            Una aplicación moderna construida con Next.js 15, React 19 y TailwindCSS v4
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <button className="bg-foreground text-background px-8 py-3 rounded-lg font-medium hover:bg-foreground/90 transition-colors">
              Comenzar
            </button>
            <button className="border border-foreground/20 px-8 py-3 rounded-lg font-medium hover:bg-foreground/5 transition-colors">
              Saber más
            </button>
          </div>
        </div>

        {/* Features Section */}
        <section id="features" className="py-20">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 border border-foreground/10 rounded-lg">
              <h3 className="font-bold text-xl mb-4">⚡ Rápido</h3>
              <p className="text-foreground/70">
                Construido con Next.js 15 y React 19 para máximo rendimiento
              </p>
            </div>
            <div className="p-6 border border-foreground/10 rounded-lg">
              <h3 className="font-bold text-xl mb-4">🎨 Moderno</h3>
              <p className="text-foreground/70">
                Diseño elegante con TailwindCSS v4 y fuentes Geist
              </p>
            </div>
            <div className="p-6 border border-foreground/10 rounded-lg">
              <h3 className="font-bold text-xl mb-4">🔧 TypeScript</h3>
              <p className="text-foreground/70">
                Totalmente tipado para un desarrollo más seguro
              </p>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 text-center">
          <h2 className="text-4xl font-bold mb-8">Sobre Takopi</h2>
          <p className="text-xl text-foreground/80 max-w-3xl mx-auto">
            Takopi es un proyecto de demostración que muestra las mejores prácticas
            de desarrollo web moderno con tecnologías de vanguardia.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-foreground/10 mt-20">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center text-foreground/60">
            <p>&copy; 2025 Takopi. Construido con Next.js y ❤️</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
