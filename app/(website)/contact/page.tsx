import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="py-16 px-4 md:px-8 max-w-7xl mx-auto min-h-[60vh]">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-4">Contact Us</h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
          Have a question or feedback? We'd love to hear from you. Fill out the form below or reach out to us directly through our contact details.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-24">
        {/* Contact Info */}
        <div className="space-y-10">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-8">Get in Touch</h2>
          
          <div className="flex items-start gap-5">
            <div className="w-14 h-14 bg-teal-50 dark:bg-teal-900/30 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border border-teal-100 dark:border-teal-800/50">
              <MapPin className="text-teal-500 w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg mb-1.5">Our Location</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">123 Artisan Valley,<br />Craft City, CC 12345</p>
            </div>
          </div>

          <div className="flex items-start gap-5">
            <div className="w-14 h-14 bg-teal-50 dark:bg-teal-900/30 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border border-teal-100 dark:border-teal-800/50">
              <Mail className="text-teal-500 w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg mb-1.5">Email Us</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">support@artisianconnect.com<br />info@artisianconnect.com</p>
            </div>
          </div>

          <div className="flex items-start gap-5">
            <div className="w-14 h-14 bg-teal-50 dark:bg-teal-900/30 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border border-teal-100 dark:border-teal-800/50">
              <Phone className="text-teal-500 w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg mb-1.5">Call Us</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">+1 (555) 123-4567<br />Mon-Fri, 9am - 6pm</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white dark:bg-muted/30 p-8 md:p-10 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-border">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">Send a Message</h3>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">First Name</label>
                <input 
                  type="text" 
                  placeholder="John"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-border bg-gray-50/50 dark:bg-muted/50 focus:bg-white dark:focus:bg-transparent focus:ring-2 focus:ring-teal-500 outline-none transition-all dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Last Name</label>
                <input 
                  type="text" 
                  placeholder="Doe"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-border bg-gray-50/50 dark:bg-muted/50 focus:bg-white dark:focus:bg-transparent focus:ring-2 focus:ring-teal-500 outline-none transition-all dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email Address</label>
              <input 
                type="email" 
                placeholder="john@example.com"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-border bg-gray-50/50 dark:bg-muted/50 focus:bg-white dark:focus:bg-transparent focus:ring-2 focus:ring-teal-500 outline-none transition-all dark:text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Message</label>
              <textarea 
                rows={5}
                placeholder="How can we help you?"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-border bg-gray-50/50 dark:bg-muted/50 focus:bg-white dark:focus:bg-transparent focus:ring-2 focus:ring-teal-500 outline-none transition-all resize-none dark:text-white"
              ></textarea>
            </div>

            <button 
              type="button"
              className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold tracking-wide py-3.5 rounded-lg transition-colors shadow-lg shadow-teal-500/30 hover:shadow-teal-500/40"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
