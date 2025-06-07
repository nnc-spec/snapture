# Snapture - AI Visual Memory Creator

Transform your daily moments into stunning AI-generated visual memories with Snapture, an innovative single-page application that leverages cutting-edge AI technology to create beautiful, stylized artwork from your text descriptions.

![Snapture Demo](https://via.placeholder.com/800x400/6366f1/ffffff?text=Snapture+AI+Visual+Memory+Creator)

## ✨ Features

### Core Functionality
- **AI-Powered Transformation**: Convert text descriptions into creative visual prompts using OpenRouter GPT-3.5
- **Free Image Generation**: Generate stunning images using Pollinations.ai API (completely free)
- **Multiple Art Styles**: Choose from Nostalgic, Funny, Absurd, and Poetic styles
- **Intensity Control**: 5-level transformation slider with emoji indicators
- **Real-time Processing**: Live progress indicators showing the two-step AI process

### Premium Features
- **Enhanced Image Quality**: Upgrade to premium for higher resolution outputs
- **Stripe Integration**: Secure payment processing for premium upgrades
- **Memory Persistence**: All generated memories are saved to your account

### Technical Highlights
- **TypeScript Frontend**: Modern React with TypeScript for type safety
- **Serverless Backend**: Express.js with PostgreSQL database
- **Responsive Design**: Mobile-first design with dark/light mode support
- **Performance Optimized**: Efficient caching and state management

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- OpenRouter API key
- Stripe account (for premium features)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/snapture.git
cd snapture
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Fill in your environment variables:
```env
DATABASE_URL=your_postgresql_connection_string
OPENROUTER_API_KEY=your_openrouter_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

4. **Initialize the database**
```bash
npm run db:push
```

5. **Start the development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## 🏗️ Architecture

### Frontend (`/client`)
- **React 18** with TypeScript
- **Tailwind CSS** for styling with shadcn/ui components
- **TanStack Query** for server state management
- **Wouter** for lightweight routing
- **Framer Motion** for smooth animations

### Backend (`/server`)
- **Express.js** with TypeScript
- **Drizzle ORM** for database operations
- **Zod** for request validation
- **OpenRouter API** for text transformation
- **Stripe** for payment processing

### Mobile App (`/mobile-app`)
- **React Native** implementation
- Shared components with web version
- Native mobile optimization

## 📱 Mobile App

The project includes a React Native mobile application in the `/mobile-app` directory:

```bash
cd mobile-app
npm install
npx expo start
```

## 🎨 Styling System

Snapture uses a sophisticated design system with:
- **Custom Color Palette**: Purple-based gradient theme
- **Dark/Light Mode**: Automatic theme switching
- **Responsive Design**: Mobile-first approach
- **Smooth Animations**: Framer Motion integration

### Key Colors
```css
--primary: 262 83% 58%     /* Purple */
--secondary: 220 14% 96%   /* Light Gray */
--accent: 262 83% 58%      /* Purple Accent */
```

## 🔧 API Endpoints

### Memory Generation
```http
POST /api/memories/generate
Content-Type: application/json

{
  "momentText": "Walking through autumn leaves",
  "style": "nostalgic",
  "transformationIntensity": 3
}
```

### Premium Upgrade
```http
POST /api/stripe/create-checkout-session
Content-Type: application/json

{
  "memoryId": 123
}
```

## 🗃️ Database Schema

### Memories Table
```sql
CREATE TABLE memories (
  id SERIAL PRIMARY KEY,
  moment_text TEXT NOT NULL,
  style VARCHAR(20) NOT NULL,
  transformation_intensity INTEGER NOT NULL,
  generated_memory TEXT NOT NULL,
  image_url TEXT,
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Purchases Table
```sql
CREATE TABLE purchases (
  id SERIAL PRIMARY KEY,
  memory_id INTEGER REFERENCES memories(id),
  stripe_session_id TEXT NOT NULL,
  amount INTEGER NOT NULL,
  status VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🚀 Deployment

### Replit Deployment (Recommended)
1. Import the project to Replit
2. Set environment variables in Replit Secrets
3. Run `npm run dev`
4. Use Replit's deployment feature

### Manual Deployment
1. **Build the project**
```bash
npm run build
```

2. **Deploy to your preferred platform**
- Vercel, Netlify, or Railway for frontend
- Railway, Heroku, or DigitalOcean for backend

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Test the API endpoints:
```bash
# Test memory generation
curl -X POST http://localhost:5000/api/memories/generate \
  -H "Content-Type: application/json" \
  -d '{"momentText":"test","style":"nostalgic","transformationIntensity":3}'
```

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🔗 Links

- **Live Demo**: [https://snapture.replit.app](https://snapture.replit.app)
- **Documentation**: [Full API Documentation](./docs/api.md)
- **Contributing**: [Contributing Guidelines](./CONTRIBUTING.md)
- **Deployment**: [Deployment Guide](./DEPLOYMENT.md)

## 💡 Inspiration

Snapture was built to bridge the gap between everyday moments and artistic expression, using AI to help people see the beauty in their daily experiences through a creative lens.

---

**Built with ❤️ using AI-powered technology**

*Transform your moments, create your memories.*