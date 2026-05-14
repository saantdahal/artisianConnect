"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Placeholder data
const blogPosts = [
  {
    id: 1,
    title: "Fidelyo minimal chair",
    category: "Inspiration",
    date: "May 15, 2019", // Matching screenshot date style/era
    image: "https://picsum.photos/id/116/800/800", // Modern Chair/Interior
  },
  {
    id: 2,
    title: "Redox minimal chair",
    category: "Decoration",
    date: "May 15, 2019",
    image: "https://picsum.photos/id/117/800/800", // Minimal White Chair
  },
  {
    id: 3,
    title: "Fidelyo center table",
    category: "Inspiration",
    date: "May 15, 2019",
    image: "https://picsum.photos/id/169/800/800", // Coffee Table
  },
];

const BlogSection = () => {
  return (
    <div className="w-full bg-white py-20">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col mb-12">
          <div className="flex justify-between items-end">
            <div className="flex flex-col items-start">
              <h2 className="text-4xl font-bold text-[#1a202c] font-serif mb-2">
                Our Blog
              </h2>
              <p className="text-gray-500 text-sm">
                Read our latest news and events.
              </p>
            </div>
            <div className="flex space-x-2">
              {/* Decorative dots or navigation if functional */}
              <div className="w-2 h-2 rounded-full bg-teal-400"></div>
              <div className="w-2 h-2 rounded-full bg-gray-300"></div>
              <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <div key={post.id} className="group cursor-pointer">
              <div className="relative w-full h-[250px] overflow-hidden mb-6">
                {/* Placeholder Image */}
                <div className="w-full h-full bg-gray-200">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute top-4 left-4 bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider text-gray-900">
                  {post.category}
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <Link
                  href="#"
                  className="text-xl font-bold text-gray-900 group-hover:text-teal-400 transition-colors"
                >
                  {post.title}
                </Link>
                <div className="flex items-center text-gray-400 text-xs font-medium space-x-2">
                  <span>
                    By <span className="text-teal-400">Artisian Connect</span>
                  </span>
                  <span>•</span>
                  <span>{post.date}</span>
                </div>
                <div className="pt-2">
                  <Link
                    href="#"
                    className="inline-flex items-center text-xs font-bold uppercase text-gray-900 hover:text-teal-400 transition-colors"
                  >
                    Read More <ArrowRight className="w-3 h-3 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogSection;
