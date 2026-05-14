import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 md:px-8 max-w-7xl mx-auto min-h-[60vh]">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-6">About Us</h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed">
          At Artisian Connect, we bridge the gap between talented artisans and passionate customers. Our platform is dedicated to promoting unique, handcrafted products while supporting local communities and sustainable practices.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="relative h-[300px] md:h-[450px] w-full rounded-2xl overflow-hidden shadow-2xl group">
          <Image
            src="https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=2000&auto=format&fit=crop"
            alt="Artisan crafting"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-700"></div>
        </div>
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Our Mission</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
            We believe that every handcrafted item tells a story—a story of tradition, skill, and passion. Our mission is to provide a platform where these stories can be shared with the world, empowering artisans to earn a fair living doing what they love. By bringing their creations directly to you, we help preserve cultural heritage and foster sustainable entrepreneurship.
          </p>
          <div className="grid grid-cols-2 gap-8 pt-6 border-t border-gray-100 dark:border-border">
            <div>
              <h3 className="text-3xl font-black text-teal-500 mb-2">10k+</h3>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Artisans Supported</p>
            </div>
            <div>
              <h3 className="text-3xl font-black text-teal-500 mb-2">50k+</h3>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Happy Customers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
