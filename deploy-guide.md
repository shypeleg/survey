# Deployment Guide for Chef Survey Application

This guide provides instructions for deploying your Chef Survey application to various platforms.

## Option 1: Deploy to Vercel (Recommended)

Vercel is the easiest and most seamless way to deploy Next.js applications.

### Prerequisites
- GitHub, GitLab, or Bitbucket account for hosting your repository
- Vercel account (can be created for free at [vercel.com](https://vercel.com))

### Steps

1. **Push your code to a Git repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Import your repository in Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up or log in
   - Click "New Project"
   - Import your Git repository
   - Configure project settings (you can mostly use the defaults)
   - Add the following environment variables:
     - `NEXTAUTH_URL`: The full URL of your deployed app (e.g., https://your-app.vercel.app)
     - `NEXTAUTH_SECRET`: A secret key for JWT encryption (run `openssl rand -base64 32` to generate one)

3. **Deploy the project**
   - Click "Deploy"
   - Vercel will build and deploy your application
   - When complete, you'll get a production URL

### Notes
- Vercel automatically handles your Next.js application, including server-side rendering and API routes
- You can connect a custom domain in the Vercel dashboard
- Each time you push to your main branch, Vercel will automatically redeploy

## Option 2: Deploy to Netlify

Netlify is another great option for hosting Next.js applications.

### Prerequisites
- GitHub, GitLab, or Bitbucket account
- Netlify account (can be created for free at [netlify.com](https://netlify.com))

### Steps

1. **Push your code to a Git repository** (same as for Vercel)

2. **Import your repository in Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Sign up or log in
   - Click "New site from Git"
   - Select your Git provider and repository
   - Configure build settings:
     - Build command: `npm run build`
     - Publish directory: `.next`
   - Add the environment variables (same as for Vercel)

3. **Deploy the project**
   - Click "Deploy site"
   - Netlify will build and deploy your application

### Notes
- You'll need to configure redirects for API routes, as they use server-side functionality

## Option 3: Self-hosting on a VPS or Server

For more control, you can deploy to your own server.

### Prerequisites
- A VPS from providers like DigitalOcean, Linode, AWS EC2, etc.
- Node.js installed on your server
- PM2 or similar process manager

### Steps

1. **Build your application locally**
   ```bash
   npm run build
   ```

2. **Transfer files to your server**
   ```bash
   rsync -avz --exclude node_modules --exclude .git ./ user@your-server:/path/to/app
   ```

3. **Install dependencies on the server**
   ```bash
   ssh user@your-server "cd /path/to/app && npm install --production"
   ```

4. **Set environment variables**
   ```bash
   ssh user@your-server "cd /path/to/app && echo 'NEXTAUTH_URL=https://yourdomain.com' >> .env.local && echo 'NEXTAUTH_SECRET=your-secret' >> .env.local"
   ```

5. **Start the application with PM2**
   ```bash
   ssh user@your-server "cd /path/to/app && pm2 start npm --name 'chef-survey' -- start"
   ```

6. **Set up a reverse proxy with Nginx**
   Configure Nginx to proxy requests to your Node.js application.

### Notes
- You'll need to set up a domain, SSL, and proper security measures
- This approach requires more maintenance but offers the most control

## Important Deployment Considerations

1. **Data persistence**: The current application stores data in a JSON file. In a production environment, consider using a database like MongoDB, PostgreSQL, or a managed service.

2. **Environment variables**: Make sure to set these securely in your hosting platform and never commit them to your repository.

3. **Authentication security**: The current admin/password method is simple. For a production application, consider stronger authentication methods.

4. **Backups**: Implement a backup strategy for your survey data if it's critical.

5. **Monitoring**: Set up monitoring to track application health and performance.

## Updating the Deployed Application

Whenever you make changes:

1. For Vercel/Netlify: Push your changes to your Git repository, and they will automatically redeploy
2. For self-hosting: Rebuild, transfer files, and restart the application

## Additional Resources

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)