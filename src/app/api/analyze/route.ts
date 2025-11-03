import { NextRequest, NextResponse } from 'next/server';
import { getLesionDataById } from '@/lib/lesion-info';
import config from '@/lib/config';
import axios from 'axios';

// Token management
let apiToken: string | null = null;
let tokenExpiration: number = 0;

// Function to fetch a new API token
async function fetchToken() {
  try {
    console.log("Fetching new API token...");

    const response = await axios.post(config.TOKEN_URL, {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      audience: config.AUDIENCE,
      grant_type: "client_credentials",
    }, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString("base64")}`
      }
    });

    const { access_token, expires_in } = response.data;
    
    apiToken = access_token;
    tokenExpiration = Date.now() + expires_in * 1000; // Convert expiration to timestamp
    console.log("Token obtained successfully: " + apiToken);
  } catch (error) {
    console.error("Error fetching token:", axios.isAxiosError(error) ? error.response?.data : error);
    throw error;
  }
}

// Middleware to ensure a valid token
async function ensureToken() {
  if (!apiToken || Date.now() >= tokenExpiration) {
    await fetchToken();
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    // Validate file type and size
    if (!image.type.match(/^image\/(png|jpeg|jpg)$/)) {
      return NextResponse.json(
        { error: 'Only .png and .jpg images smaller than 10MB are supported' },
        { status: 400 }
      );
    }

    if (image.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Only .png and .jpg images smaller than 10MB are supported' },
        { status: 400 }
      );
    }

    // Call the VisualDx API
    const analysisResult = await analyzeImage(image);
    
    //console.log('Analysis result:', analysisResult);
    
    // Extract the top finding (highest confidence)
    const findings = analysisResult?.data?.findings || [];
    
    if (findings.length === 0) {
      return NextResponse.json({
        lesionName: "I'm not sure what the condition of your skin is",
        therapyMessage: "Just to be safe, get this checked out by a dermatologist."
      });
    }
    
    // Sort by confidence (highest first) and get the top finding
    const topFinding = findings.sort((a: any, b: any) => b.confidence - a.confidence)[0];
    console.log('Top finding:', topFinding);
    
    // Get lesion data based on the finding ID
    const lesionData = getLesionDataById(topFinding.id);

    console.log('Lesion data:', lesionData);
    return NextResponse.json({
      lesionName: lesionData.name,
      lesionMessage: lesionData.lesionMessage,
      therapyMessage: lesionData.therapyMessage
    });  } catch (error) {
    console.error('Analysis error:', error);
    
    if (error instanceof Error && error.message.includes('permission')) {
      return NextResponse.json(
        { error: 'This account lacks permission to analyze images' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to analyze image' },
      { status: 500 }
    );
  }
}

async function analyzeImage(image: File) {
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('API configuration missing - CLIENT_ID and CLIENT_SECRET required');
  }

  // Ensure we have a valid token before making the request
  await ensureToken();

  // Construct the URL with audience parameter
  const apiUrl = `${config.API_BASE_URL}/inferences/${config.AUDIENCE}/image`;
  console.log('Making request to:', apiUrl);

  // Convert File to Buffer for axios
  const arrayBuffer = await image.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
    const response = await axios.post(apiUrl, buffer, {
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': image.type, // Use the actual image MIME type (image/jpeg or image/png)
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 403) {
        throw new Error('This account lacks permission to analyze images');
      }
      if (error.response?.status === 401) {
        // Token might be invalid, clear it and try again
        apiToken = null;
        throw new Error('Authentication failed');
      }
      console.error('API request failed:', error.response?.data || error.message);
    }
    throw new Error('API request failed');
  }
}