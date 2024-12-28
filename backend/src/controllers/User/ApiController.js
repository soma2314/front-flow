import { v4 as uuidv4 } from 'uuid'; 
import {Api} from '../../models/api.models.js';
import { User } from '../../models/user.models.js';

async function getApiKeys(req, res) {
  console.log("Function getApiKeys called");

  try {
    // Fetch all API keys associated with the user
    const apiKeys = await Api.find({ userId: req.user.objectId });

    // If no API keys are found, return an empty array
    if (!apiKeys || apiKeys.length === 0) {
      return res.status(200).json({ message: 'No API keys found for this user', apiKeys: [] });
    }

    // Transform the data into the desired format
    const formattedApiKeys = apiKeys.map(apiKey => ({
      keyName: apiKey.keyName,
      apiKey: apiKey.apiKey,
    }));

    // Return the formatted API keys
    res.status(200).json({ apiKeys: formattedApiKeys });
  } catch (err) {
    console.error("Some error while querying:", err);
    res.status(500).json({ message: 'Failed to fetch API keys from the database' });
  }
}


async function generateNewApiKey(req, res) {
  try {
    // Generate a new API key
    const apiKey = `api-key-${uuidv4()}`;

    // Create a new API key entry in the database
    const newApiKey = new Api({
      keyName: req.body.keyName, // Use keyName from request body
      apiKey: apiKey,
      userId: req.user.objectId, // Use userId from req.user
    });

    // Save the new API key to the database
    await newApiKey.save();

    // Respond with the generated API key and keyName
    res.status(200).json({
      message: 'API key generated successfully',
      apiKey: {
        keyName: newApiKey.keyName,
        apiKey: newApiKey.apiKey,
      },
    });
  } catch (error) {
    console.error('Error generating API key:', error);
    res.status(500).json({ message: 'Failed to generate API key' });
  }
}

async function deleteApiKey(req, res) {
  console.log("Came to delete the api key");
  
  try {
    // Check if the API key exists
    const apiKey = await Api.findOne({ apiKey: req.params.apiKey });
    if (!apiKey) {
      return res.status(404).json({ message: 'API key not found' });
    }

    // Delete the API key from the database
    await Api.deleteOne({ apiKey: req.params.apiKey });

    res.status(200).json({ message: 'API key deleted successfully' });
  } catch (error) {
    console.error('Error deleting API key:', error);
    res.status(500).json({ message: 'Failed to delete API key' });
  }
  
}

export { generateNewApiKey, getApiKeys, deleteApiKey };
