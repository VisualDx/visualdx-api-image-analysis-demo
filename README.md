# VisualDx API - Lesion Analysis Demo

A Next.js application that demonstrates the VisualDx API's ability to analyze skin images and provide cosmetic product recommendations.

## Features

- Image upload form for PNG and JPG files
- Real-time validation (PNG/JPG files under 10MB)
- Automatic OAuth2 token management for API access
- Progress spinner during analysis
- Error handling for various API states
- Responsive design
- Results display with lesion identification and therapy recommendations
- **Product recommendations with images** - Display therapy-recommended skincare products with thumbnails
## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- VisualDx API credentials with sandbox permissions

### Installation

1. Clone the repository:
```bash
git clone https://github.com/VisualDx/visualdx-api-image-analysis-demo.git
cd visualdx-api-image-analysis-demo
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory and add your VisualDx API credentials:
```env
CLIENT_ID=your_client_id_here
CLIENT_SECRET=your_client_secret_here
API_BASE_URL=https://api-dev.visualdx.com/v1
TOKEN_URL=https://api-dev.visualdx.com/v1/auth/token
AUDIENCE=consumer
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Navigate to the home page
2. Select a skin image file (PNG or JPG, under 10MB)
3. Click "Analyze Image" to submit
4. Wait for the analysis to complete
5. View the results with lesion identification and therapy recommendations

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts          # API endpoint for image analysis
│   ├── layout.tsx                # Root layout component
│   ├── page.tsx                  # Home page component
│   └── page.module.css           # Styles for home page
└── lib/
    ├── config.ts                 # Centralized environment configuration
    ├── lesion-info.ts            # Lesion lookup helpers
    └── lesions-data.ts           # Lesion database and therapy messages
```

## API Integration

The application integrates with the VisualDx API through a secure backend endpoint that:

- Handles authentication automatically using stored API keys
- Validates uploaded images (type, size)
- Processes API responses and maps them to lesion data
- Handles error states gracefully

## Error Handling

The application handles various error states:

- **Permission errors**: "This account lacks permission to analyze images"
- **File validation**: "Only .png and .jpg images smaller than 10MB are supported"
- **Network errors**: Generic error messages for connection issues
- **Unknown lesions**: Default response for unrecognized conditions

## Customization

### Adding New Lesions

Update the entries in `src/lib/lesions-data.ts` (and regenerate any helpers in `src/lib/lesion-info.ts` if needed) to add new lesion types and their corresponding therapy messages.

### Adding New Products

1. Add product entry to `src/lib/products-data.ts`
2. Add product image to `public/images/products/` as `product-{id}.jpg`
   
### Result Messaging

Known lesions render as:

```html
<p>It looks like you might have [lesionName].</p>
<p>[Therapy Message]</p>
```

Unknown lesions fall back to:

```html
<p>I'm not sure what the condition of your skin is</p>
<p>Just to be safe, get this checked out by a dermatologist.</p>
```

### Styling

Modify `src/app/page.module.css` to customize the appearance of the application.

## Deployment

This application can be deployed to any platform that supports Next.js:

- Vercel
- Netlify
- Heroku
- AWS
- Google Cloud Platform

Make sure to set your environment variables in your deployment platform.

## Security Notes

- API keys are stored securely as environment variables
- Keys are never exposed to the client-side code
- All API requests are proxied through the backend
- File uploads are validated on both client and server

## License

This project is licensed under the MIT License.