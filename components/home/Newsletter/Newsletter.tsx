"use client";

import { Button } from "@/components/ui/button";

const Newsletter = () => {
    return (
        <div className="w-full bg-white dark:bg-background py-20 pb-40 border-t border-gray-100 dark:border-border">
            <div className="container mx-auto px-4 max-w-2xl text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 font-serif">Newsletter</h2>
                <div className="flex justify-center mb-8">
                    <div className="flex space-x-2">
                        <div className="w-2 h-2 rounded-full bg-teal-400"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                    </div>
                </div>

                <form className="flex flex-col sm:flex-row items-center gap-4">
                    <input
                        type="email"
                        placeholder="Enter your email address..."
                        className="flex-1 w-full bg-[#F9F9F9] dark:bg-muted dark:text-gray-100 border-none px-6 py-4 rounded-full text-gray-500 focus:ring-2 focus:ring-teal-400 focus:outline-none"
                    />
                    <Button className="rounded-full bg-gray-900 dark:bg-gray-100 dark:text-gray-900 text-white hover:bg-teal-400 dark:hover:bg-teal-500 px-8 py-6 uppercase font-bold tracking-wider transition-colors w-full sm:w-auto">
                        Subscribe
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default Newsletter;
