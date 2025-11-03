# OAuth2 Authentication Implementation

## Overview
The application now uses OAuth2 client credentials flow for authentication with the VisualDx API, replacing the previous API key authentication.

## Architecture

### Configuration (`src/lib/config.ts`)
Centralized configuration file that manages:
- API Base URL
- Token URL  
- Audience (consumer/clinical)
- Cache TTL settings

### Token Management (`src/app/api/analyze/route.ts`)
Implements automatic token lifecycle management:

#### Token State
- `apiToken`: Stores the current access token
- `tokenExpiration`: Tracks when the token expires

#### Key Functions

**`fetchToken()`**
- Requests a new access token from the OAuth2 endpoint
- Uses Basic Auth with CLIENT_ID and CLIENT_SECRET
- Stores the token and calculates expiration time
- Handles errors gracefully with detailed logging

**`ensureToken()`**
- Middleware function that checks token validity
- Automatically refreshes expired tokens
- Called before each API request

**`analyzeImage()`**
- Updated to use the token-based authentication
- Calls `ensureToken()` before making requests
- Uses the `config.API_BASE_URL` for the image analysis endpoint
- Handles 401 errors by clearing the token for retry

## Environment Variables

Required in `.env.local`:
```env
CLIENT_ID=your_client_id_here
CLIENT_SECRET=your_client_secret_here
```

Optional (have defaults):
```env
API_BASE_URL=https://api-dev.visualdx.com/v1
TOKEN_URL=https://api-dev.visualdx.com/v1/auth/token
AUDIENCE=consumer
CACHE_TTL=259200
```

## Authentication Flow

1. Client uploads image via the web form
2. Request arrives at `/api/analyze` endpoint
3. `ensureToken()` checks if token is valid
4. If token is missing or expired:
   - Calls `fetchToken()`
   - Requests new token with client credentials
   - Stores token and expiration
5. Image analysis request is made with Bearer token
6. Response is processed and returned to client

## Benefits

- **Automatic token refresh**: No manual token management needed
- **Secure**: Client credentials never exposed to frontend
- **Efficient**: Tokens are reused until expiration
- **Resilient**: Handles token expiration and auth failures gracefully
- **Configurable**: Easy to switch between dev/prod environments

## Error Handling

The implementation handles various error scenarios:

- **Missing credentials**: Returns clear error message
- **Token fetch failure**: Logs error and throws exception
- **Authentication failure (401)**: Clears token and allows retry
- **Permission errors (403)**: Returns user-friendly message
- **API failures**: Generic error handling with logging

## Security Considerations

- Client credentials stored in environment variables (`.env.local`)
- `.env.local` excluded from git via `.gitignore`
- Token stored in memory only (not persisted)
- Basic Auth header properly encoded
- HTTPS required for all API communications

## Migration Notes

**Old Authentication (API Key)**
```typescript
headers: {
  'Authorization': `Bearer ${apiKey}`
}
```

**New Authentication (OAuth2)**
```typescript
await ensureToken(); // Ensures valid token
headers: {
  'Authorization': `Bearer ${apiToken}`
}
```

## Testing

To test the authentication:

1. Set up `.env.local` with valid CLIENT_ID and CLIENT_SECRET
2. Start the development server: `npm run dev`
3. Upload an image through the UI
4. Check server logs for "Fetching new API token..." and "Token obtained successfully"
5. Subsequent requests should reuse the token until expiration
