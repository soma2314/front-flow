import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Workflow } from 'lucide-react';

export default function Home() {
  const isAuth = useSelector((state) => state.user.isAuthenticated);
  const features = [
    { title: 'API Collection', description: 'Curated list of APIs for faster learning' },
    { title: 'Documentation', description: 'Clear guides to accelerate development' },
    { title: 'Example Projects', description: 'Real-world implementations to learn from' }
  ];

  return (
    <div className="min-h-screen relative">
      {/* Background with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 py-24 mx-auto max-w-6xl text-white">
        {/* Hero Section */}
        <div className="text-center mb-20">
          {/* Added Logo and Brand Name */}
          <div className="flex items-center justify-center mb-8">
            <Workflow className="h-10 w-10 text-blue-400 mr-3" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
              FrontFlow
            </h1>
          </div>
          
          <h2 className="text-3xl font-bold mb-6 text-white">
            Where Frontend Development Flows Seamlessly
          </h2>
          <p className="text-xl mb-8 text-gray-300">
            Your one-stop resource for frontend development learning with practical examples
          </p>
          <Link 
            to={isAuth ? '/docs' : '/register'}
            className="inline-block px-8 py-3 text-lg font-medium rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Get Started
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="p-6 rounded-lg backdrop-blur-sm bg-white/10 hover:bg-white/20 transition-all"
            >
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Building?</h2>
          <p className="mb-6 text-gray-300">
            Access our collection of APIs and resources to supercharge your development journey
          </p> 
        </div>
      </div>
    </div>
  );
}