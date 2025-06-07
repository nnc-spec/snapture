# Snapture iOS App - App Store Deployment Guide

## Prerequisites

1. **Apple Developer Account** ($99/year)
   - Sign up at: https://developer.apple.com/programs/
   - Complete payment and verification (1-2 days)

2. **Install Required Tools**
   ```bash
   npm install -g @expo/cli
   npm install -g eas-cli
   ```

3. **Xcode** (Mac required for iOS builds)
   - Download from Mac App Store
   - Install iOS simulator

## Setup Steps

### 1. Install Dependencies
```bash
cd mobile-app
npm install
```

### 2. Configure EAS
```bash
eas login
eas build:configure
```

### 3. Update Configuration
Edit `eas.json` and replace:
- `your-apple-id@email.com` with your Apple ID
- `your-team-id` with your Apple Developer Team ID
- `your-app-store-connect-app-id` with your App Store Connect app ID

### 4. Update Server URL
In `App.tsx`, replace:
```typescript
const API_BASE_URL = 'https://your-server-url.replit.app';
```
With your actual deployed server URL.

### 5. Create App Store Connect App
1. Go to https://appstoreconnect.apple.com
2. Create new app:
   - Name: "Snapture"
   - Bundle ID: "com.snapture.app"
   - Language: Primary language
   - SKU: "snapture-app-1"

### 6. Build for iOS
```bash
eas build --platform ios --profile production
```

### 7. Submit to App Store
```bash
eas submit --platform ios --profile production
```

## App Store Metadata Required

### Basic Information
- **App Name**: Snapture
- **Subtitle**: Transform moments into AI art
- **Keywords**: AI, art, memories, photos, creative, artificial intelligence
- **Description**: 
  ```
  Transform your daily moments into stunning AI-generated artwork with Snapture. 
  
  Simply write about a moment from your day, choose an artistic style, and watch 
  as AI creates a unique visual representation of your memory.
  
  Features:
  • AI-powered image generation
  • Multiple artistic styles (Nostalgic, Funny, Absurd, Poetic)
  • Adjustable creativity intensity
  • Share your visual memories
  • Beautiful, intuitive interface
  
  Turn ordinary moments into extraordinary art with Snapture.
  ```

### Screenshots Required
- iPhone 6.7" Display (1290x2796): 3-10 screenshots
- iPhone 6.5" Display (1242x2688): 3-10 screenshots
- iPhone 5.5" Display (1242x2208): 3-10 screenshots

### App Icons Required
- 1024x1024px PNG (App Store)
- Various sizes for device (generated automatically)

### Privacy Information
You'll need to declare:
- Data collection practices
- Privacy policy URL
- Data usage purposes

## Build Process Timeline

1. **Development**: 2-3 weeks
2. **Apple Developer Setup**: 1-2 days
3. **App Store Connect Setup**: 1 day
4. **Build & Upload**: 1-2 hours
5. **App Review**: 1-7 days
6. **Release**: Same day after approval

## Cost Breakdown

- Apple Developer Program: $99/year
- Development time: 2-3 weeks
- No additional hosting costs (using existing server)

## Next Steps After Approval

1. Monitor app performance in App Store Connect
2. Respond to user reviews
3. Plan feature updates
4. Consider Android version with React Native

## Important Notes

- iOS builds require a Mac computer
- App review can take 1-7 business days
- Apple may request changes during review
- Test thoroughly before submission
- Keep app description under 4000 characters