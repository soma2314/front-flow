import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { Copy, Plus, Key, Trash2 } from "lucide-react";
import 'react-toastify/dist/ReactToastify.css';

const baseurl = import.meta.env.VITE_BASE_URL;

function ApiEndpoints() {
  const [apiKeys, setApiKeys] = useState([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchApiKeys = async () => {
      try {
        const response = await axios.get(`${baseurl}/getApiKeys`, {
          withCredentials: true
        });
        setApiKeys(response.data.apiKeys);
      } catch (error) {
        toast.error("Failed to fetch API keys.");
      }
    };
    fetchApiKeys();
  }, []);

  const handleCopy = (apiKey) => {
    navigator.clipboard.writeText(apiKey)
      .then(() => toast.success("API key copied!"))
      .catch(() => toast.error("Failed to copy API key."));
  };

  const handleDelete = async (apiKey) => {
    if (window.confirm("Are you sure you want to delete this API key? This action cannot be undone.")) {
      setIsDeleting(true);
      try {
        await axios.delete(`${baseurl}/deleteApiKey/${apiKey}`, {
          withCredentials: true
        });
        setApiKeys(prev => prev.filter(key => key.apiKey !== apiKey));
        toast.success("API key deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete API key.");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleGenerateApiKey = async () => {
    if (!newKeyName) {
      toast.error("Please provide a key name!");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await axios.post(
        `${baseurl}/generateNewApiKey`,
        { keyName: newKeyName },
        { withCredentials: true }
      );
      setApiKeys(prev => [...prev, response.data.apiKey]);
      setNewKeyName("");
      toast.success("New API key generated!");
    } catch (error) {
      toast.error("Failed to generate API key.");
    } finally {
      setIsGenerating(false);
    }
  };

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
      <div className="relative z-10 px-6 py-16 mx-auto max-w-6xl text-white">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            API Key Management
          </h1>
          <p className="text-xl text-gray-300">
            Generate and manage your API keys for accessing our services
          </p>
        </div>

        {/* Generate Key Section */}
        <div className="mb-12 max-w-xl mx-auto">
          <div className="backdrop-blur-sm bg-white/10 rounded-lg p-6">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Enter key name"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg bg-black/30 border border-white/20 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleGenerateApiKey}
                disabled={isGenerating}
                className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                {isGenerating ? "Generating..." : "Generate"}
              </button>
            </div>
          </div>
        </div>

        {/* API Keys List */}
        <div className="grid gap-4">
          {apiKeys.length > 0 ? (
            apiKeys.map((apiKey) => (
              <div 
                key={apiKey._id}
                className="backdrop-blur-sm bg-white/10 p-6 rounded-lg flex items-center justify-between hover:bg-white/20 transition-all"
              >
                <div className="flex items-center gap-4">
                  <Key className="h-5 w-5 text-blue-400" />
                  <div>
                    <h3 className="font-semibold">{apiKey.keyName}</h3>
                    <p className="text-sm text-gray-400 font-mono">{apiKey.apiKey}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(apiKey.apiKey)}
                    className="p-2 rounded-lg hover:bg-black/30 transition-colors"
                    title="Copy API key"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(apiKey.apiKey)}
                    disabled={isDeleting}
                    className="p-2 rounded-lg hover:bg-black/30 transition-colors text-red-400 hover:text-red-300"
                    title="Delete API key"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 backdrop-blur-sm bg-white/10 p-8 rounded-lg">
              No API keys found. Generate one to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ApiEndpoints;