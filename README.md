# Chef Survey Web Application

This is an interactive web application that allows users to participate in a chef survey where they must assign one of three roles to three famous chefs.

## Features

- Public-facing survey form with role assignment interface
- Confirmation screen to review choices before submitting
- Ability to change or reset selections
- Results dashboard with data visualization
- Basic authentication for accessing results
- CSV export for survey data
- Mobile-responsive design

## Tech Stack

- Next.js
- React
- TypeScript
- TailwindCSS
- Chart.js
- NextAuth.js for authentication

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn

### Installation

1. Clone the repository
   ```
   git clone <repository-url>
   cd chef-survey
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following content:
   ```
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here
   ```

4. Adding Chef Images
   
   For the chef images, you need to add them to the `/public/uploads/` directory:
   
   - `/public/uploads/assaf-granit.jpg`
   - `/public/uploads/yossi-shitrit.jpg`
   - `/public/uploads/moshik-roth.jpg`
   
   The application will look for these specific filenames. If the images are not available, the app will display a placeholder.

5. Run the development server
   ```
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application

## Usage

### Taking the Survey

1. Visit the homepage
2. Enter your name (and optionally your email)
3. Assign one role to each chef (Ski/Hang With, Cook Dinners, Kill)
4. Review your choices on the confirmation screen
5. Submit your responses

### Viewing Results

1. Navigate to the `/results` page
2. Log in with the admin credentials:
   - Username: `admin`
   - Password: `surveyresults2024`
3. View charts showing role distributions for each chef
4. Access the complete data table with all submissions
5. Export results as CSV if needed

## Project Structure

- `/src/pages` - Next.js pages including API routes
- `/src/components` - Reusable React components
- `/src/utils` - Utility functions and type definitions
- `/src/styles` - Global styles and TailwindCSS configuration
- `/data` - JSON data storage for survey responses
- `/public/uploads` - Chef images

## Deployment

The application can be deployed to any platform that supports Next.js, such as Vercel or Netlify.

```
npm run build
npm run start
```