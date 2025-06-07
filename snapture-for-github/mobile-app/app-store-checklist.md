# App Store Deployment Checklist

## Pre-Deployment Requirements

### 1. Apple Developer Account Setup
- [ ] Create Apple Developer account ($99/year)
- [ ] Wait for approval (1-2 business days)
- [ ] Note your Team ID from Apple Developer portal

### 2. App Store Connect Setup
- [ ] Create new app in App Store Connect
- [ ] Bundle ID: `com.snapture.app`
- [ ] App Name: `Snapture`
- [ ] Primary Language: English
- [ ] SKU: `snapture-app-1`

### 3. Required Assets

#### App Icons (1024x1024px)
- [ ] Main app icon - high resolution PNG
- [ ] No transparency, rounded corners handled by iOS
- [ ] Represents the AI art transformation concept

#### Screenshots (Required for each device size)
**iPhone 6.7" (iPhone 14 Pro Max, 15 Pro Max)**
- [ ] 1290 x 2796 pixels
- [ ] 3-10 screenshots showing key features

**iPhone 6.5" (iPhone 14 Plus, 15 Plus)**
- [ ] 1242 x 2688 pixels  
- [ ] 3-10 screenshots showing key features

**iPhone 5.5" (iPhone 8 Plus)**
- [ ] 1242 x 2208 pixels
- [ ] 3-10 screenshots showing key features

#### Required Screenshot Content
1. Main interface with moment input
2. Style selection screen
3. AI transformation intensity
4. Generated artwork example
5. Sharing functionality

### 4. App Metadata

#### Basic Information
- [ ] App Name: "Snapture"
- [ ] Subtitle: "Transform moments into AI art" (max 30 characters)
- [ ] Keywords: "AI,art,memories,creative,photos,artificial intelligence,moments,visual" (max 100 characters)

#### Description (max 4000 characters)
```
Transform your daily moments into stunning AI-generated artwork with Snapture.

KEY FEATURES:
• Write about any moment from your day
• Choose from 4 artistic styles: Nostalgic, Funny, Absurd, Poetic  
• Adjust AI creativity intensity (5 levels)
• Generate unique visual representations
• Share your visual memories instantly

HOW IT WORKS:
1. Describe a moment from your day in text
2. Select your preferred artistic style
3. Choose creativity intensity level
4. Watch AI transform your words into art
5. Share your unique visual memory

ARTISTIC STYLES:
• Nostalgic: Warm, sentimental artwork
• Funny: Humorous and playful visuals  
• Absurd: Surreal and imaginative art
• Poetic: Artistic and lyrical representations

Perfect for capturing and reimagining your daily experiences as beautiful, shareable artwork. Turn ordinary moments into extraordinary visual memories with advanced AI technology.
```

#### Categories
- [ ] Primary: Photography
- [ ] Secondary: Entertainment

### 5. Privacy Information

#### Data Types Collected
- [ ] User Content (text descriptions of moments)
- [ ] Usage Data (app analytics)
- [ ] Diagnostics (crash reports)

#### Data Use Purposes
- [ ] App Functionality (generating AI artwork)
- [ ] Analytics (improving user experience)
- [ ] Product Personalization (better AI responses)

#### Privacy Policy
- [ ] Create privacy policy URL
- [ ] Host on accessible web server
- [ ] Include data collection practices
- [ ] Include third-party services (OpenAI, image generation APIs)

### 6. Age Rating
- [ ] Select "4+" (suitable for all ages)
- [ ] No objectionable content
- [ ] User-generated content with moderation

### 7. Review Information
- [ ] Demo account credentials (if needed)
- [ ] Review notes explaining AI functionality
- [ ] Contact information for reviewer questions

## Technical Deployment Steps

### 1. Environment Setup
```bash
# Install required tools
npm install -g @expo/cli eas-cli

# Login to Expo
eas login

# Configure build
cd mobile-app
eas build:configure
```

### 2. Update Configuration Files

#### Update `eas.json`
- [ ] Replace placeholder Apple ID with your Apple ID
- [ ] Replace placeholder Team ID with your Apple Developer Team ID
- [ ] Replace App Store Connect app ID

#### Update `App.tsx`
- [ ] Replace `API_BASE_URL` with your deployed server URL
- [ ] Test API connectivity
- [ ] Verify image generation works

### 3. Build Process
```bash
# Build for iOS production
eas build --platform ios --profile production

# Submit to App Store
eas submit --platform ios --profile production
```

### 4. App Store Connect Final Steps
- [ ] Upload app binary via EAS
- [ ] Add all screenshots
- [ ] Complete app information
- [ ] Set pricing (Free)
- [ ] Submit for review

## Expected Timeline

- **Apple Developer Account**: 1-2 days
- **Asset Creation**: 1-2 days  
- **App Store Connect Setup**: 4-6 hours
- **Build & Upload**: 2-3 hours
- **Apple Review Process**: 1-7 days
- **Total Time to Launch**: 5-12 days

## Common Review Issues to Avoid

- [ ] Ensure all screenshots are current and accurate
- [ ] Test app thoroughly before submission
- [ ] Verify privacy policy is accessible and complete
- [ ] Ensure app works without internet (graceful error handling)
- [ ] Include proper error messages for failed AI generation
- [ ] Test on multiple device sizes

## Post-Launch Tasks

- [ ] Monitor App Store Connect for user reviews
- [ ] Track download and usage analytics
- [ ] Plan version updates based on user feedback
- [ ] Consider Android version development
- [ ] Marketing and user acquisition strategy

## Support Information

**Developer Contact**: Your email address
**Support URL**: Your support website
**Marketing URL**: Your app website

## Notes
- iOS builds require Mac computer with Xcode
- Keep app description under 4000 characters
- All text must be in English for initial submission
- Consider localizing for other markets post-launch