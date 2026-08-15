# 🚀 Setup Instructions for ConversAI

Follow these steps to get your ConversAI application up and running!

## Step 1: Get Your Clerk Publishable Key

1. **Sign up for Clerk** (if you haven't already):
   - Go to [https://clerk.com](https://clerk.com)
   - Click "Sign Up" and create your account
   - Verify your email address

2. **Create a New Application**:
   - After logging in, click "Add application"
   - Name your app (e.g., "ConversAI")
   - Select "React" as your framework
   - Click "Create application"

3. **Copy Your Publishable Key**:
   - On the application dashboard, you'll see your keys
   - Copy the **Publishable Key** (starts with `pk_test_`)
   - Do NOT copy the Secret Key (keep it private)

4. **Update Your Environment File**:
   - Open `.env.local` in your project
   - Replace `pk_test_your_key_here` with your actual key:
   ```bash
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_actual_key_here
   ```

## Step 2: Run the Application

```bash
# Install dependencies (if not done)
npm install

# Start development server
npm run dev

# In another terminal, start Convex
npx convex dev
```

## Step 3: Test the Application

1. Open your browser to `http://localhost:5173`
2. You should see the ConversAI landing page
3. Click "Get Started Free" to test authentication
4. Choose a character and start your first conversation!

## 🔧 Troubleshooting

### "Clerk is not configured" error
- Make sure your `.env.local` file has the correct Clerk key
- Restart your development server after updating environment variables
- Check that the key starts with `pk_test_`

### "Convex is not ready" error
- Make sure `npx convex dev` is running in a separate terminal
- Check that your Convex deployment is active
- The database will auto-seed with character and quiz data

### 3D Avatar not loading
- This is expected - the avatar requires additional setup
- The conversation interface will still work without 3D graphics
- Focus on testing the core functionality first

## 🎉 Success!

Once you see the landing page and can sign up/login, you're ready to go! The application will automatically:
- Create your user profile
- Seed character and quiz data
- Track your conversation progress
- Save your scores and analytics

## 📞 Need Help?

If you encounter any issues:
1. Check that all environment variables are set correctly
2. Ensure both `npm run dev` and `npx convex dev` are running
3. Clear your browser cache and cookies
4. Check the browser console for specific error messages

Happy training! 🦾💚🐾