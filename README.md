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

## Security Best Practices

- **Never commit real secrets or API keys to the repository.** Use environment variables and ensure `.env.local` and similar files are gitignored.
- **Enforce strong password policies** for all users, including demo/test users.
- **Do not use demo or legacy authentication/database code in production.** Only use the NextAuth and MongoDB/Mongoose setup for live deployments.
- **Enable rate limiting** for all authentication and registration endpoints to prevent brute-force attacks.
- **Integrate error monitoring** (e.g., Sentry) and review logs for suspicious activity.
- **Validate all environment variables at startup** to avoid misconfiguration.
- **Keep dependencies up to date** and monitor for vulnerabilities.
- **Use HTTPS** in production to protect user data in transit.
- **Restrict CORS** to trusted domains only.
- **Regularly review user roles and permissions.**

## Deployment Checklist

- [ ] All environment variables are set and valid (`npm run build` will fail if not).
- [ ] No demo/test users or legacy code is enabled in production.
- [ ] Sentry (or another error monitoring service) is configured for production.
- [ ] Rate limiting is enabled and uses a distributed backend (e.g., Redis).
- [ ] HTTPS is enforced and certificates are valid.
- [ ] Database access is restricted to trusted IPs/services.
- [ ] All third-party API keys are set to production values.
- [ ] CORS is restricted to your production domain(s).
- [ ] All dependencies are up to date and free of known vulnerabilities.
- [ ] A backup and recovery plan is in place for the database.
- [ ] Security best practices (above) are reviewed and followed.

## Error Monitoring (Sentry)

To enable error monitoring in production, set the `SENTRY_DSN` environment variable in your deployment environment. You can get your DSN from your Sentry project settings.

- Add `SENTRY_DSN=your-sentry-dsn-here` to your `.env.local` or production environment.
- All server and client errors will be reported to Sentry automatically.

## Uptime Monitoring

To ensure your site is always available, set up uptime monitoring with a service like [UptimeRobot](https://uptimerobot.com/) or [Better Uptime](https://betteruptime.com/):

- Sign up for a free account.
- Add your production site URL (e.g., https://yourdomain.com).
- Set up email or Slack alerts for downtime.
- Optionally, add a public status page for your users.

## API Documentation

This project exposes several REST API endpoints under `/api/` (see the `app/api/` directory). Example endpoints:

- `POST /api/register` — Register a new user or school
- `POST /api/auth/[...nextauth]` — Authentication (NextAuth.js)
- `GET /api/competitions` — List competitions
- `GET /api/teams` — List teams
- `GET /api/schools` — List schools

All endpoints return JSON. For more details, see the code in the `app/api/` directory or contact the development team.

## Developer Onboarding

- Clone the repo and run `npm install`.
- Copy `.env.example` to `.env.local` and fill in your secrets.
- Run `npm run dev` to start the development server.
- Run `npm test` to execute unit tests.
- Run `npm run lint` to check for code and accessibility issues.

For questions, see the [Support](#support) section or open an issue.
