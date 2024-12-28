import React from 'react';
import { Workflow } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-base-300 border-t border-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info with New Logo */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Workflow className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                FrontFlow
              </span>
            </div>
            <div>
              <p className="text-gray-300 font-semibold">FrontFlow</p>
              <p className="text-gray-400 text-sm">Providing reliable tech since 2024</p>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h6 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
              Services
            </h6>
            <ul className="space-y-2">
              <li>
                <a className="text-gray-400 hover:text-gray-300 transition-colors text-sm cursor-pointer">
                  Branding
                </a>
              </li>
              <li>
                <a className="text-gray-400 hover:text-gray-300 transition-colors text-sm cursor-pointer">
                  Design
                </a>
              </li>
              <li>
                <a className="text-gray-400 hover:text-gray-300 transition-colors text-sm cursor-pointer">
                  Marketing
                </a>
              </li>
              <li>
                <a className="text-gray-400 hover:text-gray-300 transition-colors text-sm cursor-pointer">
                  Advertisement
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h6 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
              Company
            </h6>
            <ul className="space-y-2">
              <li>
                <a className="text-gray-400 hover:text-gray-300 transition-colors text-sm cursor-pointer">
                  About us
                </a>
              </li>
              <li>
                <a className="text-gray-400 hover:text-gray-300 transition-colors text-sm cursor-pointer">
                  Contact
                </a>
              </li>
              <li>
                <a className="text-gray-400 hover:text-gray-300 transition-colors text-sm cursor-pointer">
                  Jobs
                </a>
              </li>
              <li>
                <a className="text-gray-400 hover:text-gray-300 transition-colors text-sm cursor-pointer">
                  Press kit
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h6 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
              Legal
            </h6>
            <ul className="space-y-2">
              <li>
                <a className="text-gray-400 hover:text-gray-300 transition-colors text-sm cursor-pointer">
                  Terms of use
                </a>
              </li>
              <li>
                <a className="text-gray-400 hover:text-gray-300 transition-colors text-sm cursor-pointer">
                  Privacy policy
                </a>
              </li>
              <li>
                <a className="text-gray-400 hover:text-gray-300 transition-colors text-sm cursor-pointer">
                  Cookie policy
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;