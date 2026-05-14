"use client";
import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  CreditCard,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#F8F8F8] dark:bg-muted py-20 pb-10 border-t border-gray-100 dark:border-border">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Column 1: Brand & Contact */}
          <div className="flex flex-col space-y-6">
            <Link
              href="/"
              className="text-3xl font-bold font-serif text-gray-900 dark:text-foreground"
            >
              Artisian Connect.
            </Link>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              Minimalist furniture and home decor for the modern living space.
              Quality craftsmanship meets contemporary design.
            </p>
            <div className="flex space-x-4 pt-2">
              <Link
                href="#"
                className="text-gray-400 hover:text-teal-400 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-teal-400 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-teal-400 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-teal-400 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Column 2: My Account */}
          <div className="flex flex-col space-y-6">
            <h4 className="text-gray-900 dark:text-gray-100 font-bold text-lg font-serif">
              My Account
            </h4>
            <ul className="flex flex-col space-y-4">
              {[
                "My Account",
                "Checkout",
                "Cart",
                "Wishlist",
                "Order Tracking",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-gray-500 text-sm hover:text-teal-400 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Our Company */}
          <div className="flex flex-col space-y-6">
            <h4 className="text-gray-900 dark:text-gray-100 font-bold text-lg font-serif">
              Our Company
            </h4>
            <ul className="flex flex-col space-y-4">
              {[
                "About Us",
                "Contact Us",
                "Careers",
                "Terms & Conditions",
                "Privacy Policy",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-gray-500 text-sm hover:text-teal-400 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div className="flex flex-col space-y-6">
            <h4 className="text-gray-900 dark:text-gray-100 font-bold text-lg font-serif">
              Contact Info
            </h4>
            <div className="space-y-4 text-gray-500 dark:text-gray-400 text-sm">
              <p>123 Street Name, City, United States</p>
              <p>+1 234 567 890</p>
              <p>support@Artisian Connect.com</p>
            </div>
            <div className="pt-4">
              <div className="flex space-x-2 grayscale opacity-50">
                {/* Payment Icons Placeholder */}
                <div className="w-8 h-5 bg-gray-300 rounded"></div>
                <div className="w-8 h-5 bg-gray-300 rounded"></div>
                <div className="w-8 h-5 bg-gray-300 rounded"></div>
                <div className="w-8 h-5 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-border pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 dark:text-gray-500 text-xs">
            © 2019 Artisian Connect. All Rights Reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              href="#"
              className="text-gray-400 dark:text-gray-500 text-xs hover:text-teal-400 dark:hover:text-teal-500"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-gray-400 dark:text-gray-500 text-xs hover:text-teal-400 dark:hover:text-teal-500"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
