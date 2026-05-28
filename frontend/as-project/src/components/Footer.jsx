import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-200 py-4 mt-auto">
            <div className="max-w-7xl mx-auto px-4 text-center text-xs text-gray-500">
                &copy; {new Date().getFullYear()} HackApp. Built for the Hackathon.
            </div>
        </footer>
    );
};

export default Footer;