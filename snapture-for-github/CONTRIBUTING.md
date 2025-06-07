# Contributing to Snapture

We welcome contributions to Snapture! This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally
3. Create a new branch for your feature or bug fix
4. Make your changes
5. Test your changes thoroughly
6. Submit a pull request

## Development Setup

### Prerequisites
- Node.js 18 or higher
- PostgreSQL database
- Git

### Local Development
```bash
# Clone your fork
git clone https://github.com/yourusername/snapture.git
cd snapture

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your actual values

# Set up database
npm run db:push

# Start development server
npm run dev
```

## Code Style and Standards

### TypeScript
- Use TypeScript for all new code
- Maintain strict type checking
- Document complex functions and interfaces

### React Components
- Use functional components with hooks
- Follow React best practices
- Use proper prop types with TypeScript

### Database
- Use Drizzle ORM for all database operations
- Never write raw SQL unless absolutely necessary
- Follow the existing schema patterns

### API Routes
- Validate all inputs using Zod schemas
- Handle errors gracefully
- Use proper HTTP status codes

## Testing

Before submitting a pull request:

1. Test the complete user flow:
   - Memory generation with all styles
   - Intensity level variations
   - Payment flow (with test cards)
   - Image loading and sharing

2. Verify database operations:
   - Memory storage and retrieval
   - Payment processing
   - Data persistence

3. Check mobile responsiveness:
   - Test on various screen sizes
   - Verify touch interactions

## Pull Request Process

1. **Create a descriptive branch name**:
   - `feature/add-new-style`
   - `fix/memory-loading-issue`
   - `improvement/checkout-flow`

2. **Write a clear PR title and description**:
   - Explain what changes you made
   - Include screenshots for UI changes
   - Reference any related issues

3. **Keep PRs focused**:
   - One feature or bug fix per PR
   - Avoid mixing unrelated changes

4. **Update documentation**:
   - Update README if needed
   - Add comments for complex logic
   - Update API documentation

## Bug Reports

When reporting bugs, please include:

- Steps to reproduce
- Expected behavior
- Actual behavior
- Browser/device information
- Screenshots if applicable

## Feature Requests

For new features:

- Describe the use case
- Explain the expected behavior
- Consider the impact on existing functionality
- Discuss implementation approaches

## Code Review Process

All submissions require review. We look for:

- Code quality and maintainability
- Adherence to project standards
- Proper error handling
- Security considerations
- Performance implications

## Areas for Contribution

### High Priority
- Performance optimizations
- Accessibility improvements
- Mobile app enhancements
- Security hardening

### Medium Priority
- Additional AI styles
- Enhanced user interface
- Analytics and monitoring
- Internationalization

### Documentation
- API documentation
- User guides
- Developer tutorials
- Code examples

## Technical Architecture

### Frontend (React)
- Component-based architecture
- State management with React hooks
- Responsive design with TailwindCSS
- Type-safe API calls with TanStack Query

### Backend (Express)
- RESTful API design
- Database abstraction with Drizzle ORM
- Input validation with Zod
- Payment processing with Stripe

### Database (PostgreSQL)
- Normalized schema design
- Proper indexing for performance
- Migration-based schema updates

## Security Guidelines

- Never commit API keys or secrets
- Validate all user inputs
- Use parameterized queries
- Implement proper authentication
- Follow OWASP guidelines

## Performance Considerations

- Optimize image loading and caching
- Minimize bundle sizes
- Use efficient database queries
- Implement proper error boundaries

## Questions?

If you have questions about contributing:

1. Check existing issues and documentation
2. Create a discussion thread
3. Reach out to maintainers

Thank you for contributing to Snapture!