import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-purple-500/20 mt-20 bg-black/20 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-bold text-xl">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                TAKOPI
              </span>
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              The future of creative digital commerce. Where innovation meets community.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Explore</h4>
            <div className="flex flex-col gap-2">
              <Link href="/feed" className="text-gray-300 hover:text-purple-400 transition-colors">
                Feed
              </Link>
              <Link href="/explore" className="text-gray-300 hover:text-purple-400 transition-colors">
                Discover
              </Link>
              <Link href="/trending" className="text-gray-300 hover:text-purple-400 transition-colors">
                Trending
              </Link>
            </div>
          </div>

          {/* Tools */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Tools</h4>
            <div className="flex flex-col gap-2">
              <Link href="/cultural-map" className="text-gray-300 hover:text-purple-400 transition-colors">
                Cultural Map
              </Link>
              <Link href="/chatbot" className="text-gray-300 hover:text-purple-400 transition-colors">
                AI Assistant
              </Link>
              <Link href="/upload" className="text-gray-300 hover:text-purple-400 transition-colors">
                Upload Content
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Support</h4>
            <div className="flex flex-col gap-2">
              <Link href="/help" className="text-gray-300 hover:text-purple-400 transition-colors">
                Help Center
              </Link>
              <Link href="/privacy" className="text-gray-300 hover:text-purple-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-300 hover:text-purple-400 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-purple-500/20 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Takopi. Revolutionizing creative digital commerce.</p>
        </div>
      </div>
    </footer>
  );
}