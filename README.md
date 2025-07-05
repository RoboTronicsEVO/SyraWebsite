# Skool Clone

A full-stack web application that replicates the core functionality of Skool.com, built with Next.js, NextAuth.js, and Stripe integration.

## Features

- **Authentication**: Google and GitHub OAuth integration with NextAuth.js
- **Community Management**: Create, join, and manage communities
- **Payment Integration**: Stripe-powered subscription system
- **Real-time Features**: Comments, reactions, and community interactions
- **Modern UI**: Built with Tailwind CSS for responsive design

## Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Authentication**: NextAuth.js
- **Payments**: Stripe
- **Database**: (Configure your preferred database)
- **Styling**: Tailwind CSS, PostCSS

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Stripe account
- Google OAuth credentials
- GitHub OAuth credentials

## Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd skool-clone
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory with the following variables:
   ```env
   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret-key

   # Google OAuth
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret

   # GitHub OAuth
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret

   # Stripe Configuration
   STRIPE_SECRET_KEY=your-stripe-secret-key
   STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key

   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## Environment Variables Setup

### NextAuth Configuration
- `NEXTAUTH_URL`: Your application URL (use `http://localhost:3000` for development)
- `NEXTAUTH_SECRET`: A random string for JWT encryption (generate with `openssl rand -base64 32`)

### OAuth Providers
1. **Google OAuth**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add `http://localhost:3000/api/auth/callback/google` to authorized redirect URIs

2. **GitHub OAuth**:
   - Go to [GitHub Developer Settings](https://github.com/settings/developers)
   - Create a new OAuth App
   - Add `http://localhost:3000/api/auth/callback/github` to callback URL

### Stripe Configuration
1. **Create a Stripe account** at [stripe.com](https://stripe.com)
2. **Get your API keys** from the Stripe Dashboard
3. **Set up webhooks**:
   - Go to Stripe Dashboard > Webhooks
   - Add endpoint: `http://localhost:3000/api/stripe/webhooks`
   - Select events: `checkout.session.completed`, `customer.subscription.created`

## Project Structure

```
skoolClone/
├── app/                    # Next.js 13+ app directory
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.html        # Root layout
│   └── page.html          # Home page
├── components/            # Reusable components
│   ├── auth/             # Authentication components
│   ├── shared/           # Shared components
│   └── ui/               # UI components
├── lib/                  # Utility libraries
├── models/               # Data models
├── pages/                # API routes (legacy)
└── styles/               # Additional styles
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms
- **Netlify**: Configure build settings for Next.js
- **Railway**: Connect GitHub repo and add environment variables
- **Heroku**: Use the Next.js buildpack

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please:
1. Check the [Issues](https://github.com/your-username/skool-clone/issues) page
2. Create a new issue with detailed information
3. Include error messages and steps to reproduce

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Authentication powered by [NextAuth.js](https://next-auth.js.org/)
- Payments handled by [Stripe](https://stripe.com/)
- Styling with [Tailwind CSS](https://tailwindcss.com/) 