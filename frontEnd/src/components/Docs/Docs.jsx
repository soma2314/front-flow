import React, { useState } from 'react';
import { Copy, CheckCircle2, Code2, Book, AlertTriangle, Grid, Info } from 'lucide-react';


const baseUrl = import.meta.env.VITE_BASE_URL;

export default function Docs(){
  const [copiedText, setCopiedText] = useState('');
  const [activeTab, setActiveTab] = useState('getting-started');

  const categories = {
    "Electronics": ["Smartphones", "Laptops", "Tablets", "Smartwatches", "Headphones"],
    "Fashion": ["Men's Clothing", "Women's Clothing", "Kids' Clothing", "Shoes", "Accessories"],
    "Home & Living": ["Furniture", "Kitchen Appliances", "Home Decor", "Bedding", "Storage"],
    "Toys & Games": ["Educational Toys", "Board Games", "Outdoor Toys", "Action Figures", "Building Sets"],
    "Books": ["Fiction", "Non-Fiction", "Children's Books", "Academic", "Comics"],
    "Sports": ["Exercise Equipment", "Sports Gear", "Outdoor Sports", "Indoor Sports", "Fitness Accessories"]
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(''), 2000);
  };

  const CodeBlock = ({ code, showCopy = true }) => (
    <div className="relative bg-base-300 rounded-xl p-6 my-4 group">
      <pre className="text-sm overflow-x-auto font-mono">
        <code>{code}</code>
      </pre>
      {showCopy && (
        <button
          className={`absolute top-4 right-4 p-2 rounded-lg transition-all
            ${copiedText === code 
              ? 'bg-success/20 text-success' 
              : 'bg-base-200 opacity-0 group-hover:opacity-100 hover:bg-base-100'}`}
          onClick={() => copyToClipboard(code)}
        >
          {copiedText === code ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </button>
      )}
    </div>
  );

  const TabButton = ({ icon: Icon, label, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all
        ${isActive 
          ? 'bg-primary text-primary-content shadow-lg' 
          : 'hover:bg-base-200'}`}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </button>
  );

  const EndpointCard = ({ title, endpoint, response, note }) => (
    <div className="card bg-base-200">
      <div className="card-body">
        <h3 className="card-title text-xl">{title}</h3>
        
        {note && (
          <div className="bg-info/10 border border-info/20 rounded-lg p-4 flex gap-2 items-start">
            <Info className="h-5 w-5 text-info mt-0.5" />
            <p className="text-sm">{note}</p>
          </div>
        )}
        
        <CodeBlock code={endpoint} />
        {response && (
          <>
            <h4 className="font-semibold mt-4">Example Response:</h4>
            <CodeBlock code={JSON.stringify(response, null, 2)} />
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-base-200 py-8">
      <div className="max-w-6xl mx-auto p-4">
        {/* Hero Section */}
        <div className="card bg-gradient-to-r from-primary to-secondary text-primary-content shadow-xl mb-8 p-8">
          <h1 className="text-4xl font-bold mb-4">E-commerce API Documentation</h1>
          <p className="text-xl opacity-90">Build powerful e-commerce experiences with our comprehensive API</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar Navigation */}
          <div className="col-span-12 md:col-span-3">
            <div className="flex flex-col gap-2 sticky top-4">
              <TabButton
                icon={Code2}
                label="Getting Started"
                isActive={activeTab === 'getting-started'}
                onClick={() => setActiveTab('getting-started')}
              />
              <TabButton
                icon={Book}
                label="Endpoints"
                isActive={activeTab === 'endpoints'}
                onClick={() => setActiveTab('endpoints')}
              />
              <TabButton
                icon={Grid}
                label="Categories"
                isActive={activeTab === 'categories'}
                onClick={() => setActiveTab('categories')}
              />
              <TabButton
                icon={AlertTriangle}
                label="Error Handling"
                isActive={activeTab === 'errors'}
                onClick={() => setActiveTab('errors')}
              />
            </div>
          </div>

          {/* Content Area */}
          <div className="col-span-12 md:col-span-9">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                {activeTab === 'getting-started' && (
                  <div className="space-y-6">
                    <section>
                      <h2 className="text-2xl font-bold mb-4">Authentication</h2>
                      <div className="steps steps-vertical">
                        <div className="step step-primary">Create an account</div>
                        <div className="step step-primary">Generate API key</div>
                        <div className="step step-primary">Include in requests</div>
                      </div>
                    </section>
                    
                    <section>
                      <h2 className="text-2xl font-bold mb-4">Base URL</h2>
                      <CodeBlock code={baseUrl} />
                    </section>
                  </div>
                )}

                {activeTab === 'endpoints' && (
                  <div className="space-y-8">
                     <EndpointCard
                        title="Get All Products"
                        endpoint={`GET ${baseUrl}/<yourApiKey>/getProducts/getAllProducts`}
                        note="Retrieves all products from the catalog. No additional parameters needed."
                        response={{
                          status: "success",
                          products: [{
                            title: 'Apple iPhone 15 (128 GB) - Black',
                            price: 66100,
                            category: 'Electronics',
                          }]
                        }}
                      />

                    <EndpointCard
                      title="Get Products by Category"
                      endpoint={`GET ${baseUrl}/<yourApiKey>/getProducts/category/category`}
                      note="Replace 'category' at the end with one of: Electronics, Fashion, Home & Living, Toys & Games, Books, or Sports"
                    />
        
                    <EndpointCard
                      title="Get Products by Subcategory"
                      endpoint={`GET ${baseUrl}/<yourApiKey>/getProducts/subcategory/subcategory`}
                      note="Replace 'subcategory' at the end with a specific subcategory like 'Smartphones' or 'Laptops'. See the Categories tab for all available subcategories."
                    />      
                  </div>
                )}

                {activeTab === 'categories' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Info className="h-5 w-5 text-info mt-0.5" />
                    <p className="text-sm">"Just click on the copy, the whole url will be copied, later just replace "yourApiKey" with generated api key"</p>
                    {Object.entries(categories).map(([category, subcategories]) => (
                      <div key={category} className="card bg-base-200 hover:shadow-lg transition-shadow">
                        <div className="card-body">
                          <div className="flex items-center justify-between">
                            <h3 className="card-title text-lg">{category}</h3>
                            <button
                              className="btn btn-ghost btn-sm"
                              onClick={() => copyToClipboard(`${baseUrl}/<yourApiKey>/getProducts/category/${category}`)}
                            >
                              {copiedText === `${baseUrl}/<yourApiKey>/getProducts/category/${category}` 
                                ? <CheckCircle2 className="h-4 w-4 text-success" />
                                : <Copy className="h-4 w-4" />
                              }
                            </button>
                          </div>
                          <div className="divider my-2"></div>
                          <ul className="space-y-2">
                            {subcategories.map(sub => (
                              <li key={sub} className="flex items-center justify-between p-2 rounded-lg hover:bg-base-300">
                                <span>{sub}</span>
                                <button
                                  className="btn btn-ghost btn-sm"
                                  onClick={() => copyToClipboard(`${baseUrl}/<yourApiKey>/getProducts/subcategory/${sub}`)}
                                >
                                  {copiedText === `${baseUrl}/<yourApiKey>/getProducts/subcategory/${sub}` 
                                    ? <CheckCircle2 className="h-4 w-4 text-success" />
                                    : <Copy className="h-4 w-4" />
                                  }
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'errors' && (
                  <div className="space-y-8">
                    {[
                      {
                        title: "Invalid Route",
                        error: {
                          status: "error",
                          message: "Invalid route. Please check the documentation for valid endpoints."
                        }
                      },
                      {
                        title: "Invalid API Key",
                        error: {
                          status: "error",
                          message: "Invalid API key. Please provide a valid API key."
                        }
                      }
                    ].map((error, index) => (
                      <div key={index} className="card bg-error/5 border border-error/20">
                        <div className="card-body">
                          <h3 className="card-title text-xl text-error">{error.title}</h3>
                          <CodeBlock code={JSON.stringify(error.error, null, 2)} />
                        </div>
                      </div>
                    ))}
                    
                    <div className="card bg-warning/5 border border-warning/20">
                      <div className="card-body">
                        <h3 className="card-title text-xl text-warning">Rate Limiting</h3>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                          <li>1000 requests per hour per API key</li>
                          <li>429 Too Many Requests response after limit exceeded</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 