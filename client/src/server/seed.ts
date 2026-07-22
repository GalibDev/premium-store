import { config } from 'dotenv';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

config({ path: '.env.local', quiet: true });

async function main() {
  const { connectDatabase } = await import('./config/db');
  const { Favorite, Payment, Recipe, Report, User } = await import('./models');

  await connectDatabase();

  const userPasswordHash = await bcrypt.hash('Recipe123', 12);
  const adminPasswordHash = await bcrypt.hash('Admin123', 12);

  await User.bulkWrite([
  {
    updateOne: {
      filter: { email: 'admin@recipehub.dev' },
      update: {
        $set: {
          name: 'Admin User',
          email: 'admin@recipehub.dev',
          passwordHash: adminPasswordHash,
          role: 'admin',
          isPremium: true,
          isBlocked: false,
          image: 'https://i.pravatar.cc/200?img=12',
        },
      },
      upsert: true,
    },
  },
  {
    updateOne: {
      filter: { email: 'chef@recipehub.dev' },
      update: {
        $set: {
          name: 'Sarah Johnson',
          email: 'chef@recipehub.dev',
          passwordHash: userPasswordHash,
          role: 'user',
          isPremium: true,
          isBlocked: false,
          image: 'https://i.pravatar.cc/200?img=47',
        },
      },
      upsert: true,
    },
  },
  {
    updateOne: {
      filter: { email: 'rafi@recipehub.dev' },
      update: {
        $set: {
          name: 'Rafi Ahmed',
          email: 'rafi@recipehub.dev',
          passwordHash: userPasswordHash,
          role: 'user',
          isPremium: false,
          isBlocked: false,
          image: 'https://i.pravatar.cc/200?img=15',
        },
      },
      upsert: true,
    },
  },
  ]);

  const [admin, chef, rafi] = await Promise.all([
    User.findOne({ email: 'admin@recipehub.dev' }).orFail(),
    User.findOne({ email: 'chef@recipehub.dev' }).orFail(),
    User.findOne({ email: 'rafi@recipehub.dev' }).orFail(),
  ]);

  const seeds = [
  ['ChatGPT Plus 1 Month', '0F172A', '10A37F', 'AI Tools', 'Personal Account', 'Instant', 30, 1899, 1110, true],
  ['Netflix Premium 1 Month', '111827', 'E50914', 'Streaming', 'Shared Access', 'Instant', 30, 499, 1042, true],
  ['Canva Pro 1 Year', '312E81', '8B5CF6', 'Design & Creative', 'Personal Account', 'Instant', 365, 1199, 1240, true],
  ['CapCut Pro 6 Months', '020617', '38BDF8', 'Design & Creative', 'Personal Account', 'Instant', 180, 899, 1186, true],
  ['YouTube Premium 3 Months', '18181B', 'FF0000', 'Streaming', 'Personal Account', 'Manual', 90, 599, 1080, true],
  ['Microsoft 365 Family', '0F3B5D', 'F97316', 'Productivity', 'License Key', 'Instant', 365, 2499, 996, true],
  ['Grammarly Premium 1 Year', '052E2B', '15C39A', 'Productivity', 'Personal Account', 'Manual', 365, 1499, 930, false],
  ['Adobe Creative Cloud 1 Month', '3F0A0A', 'FF0000', 'Design & Creative', 'License Key', 'Manual', 30, 1299, 884, false],
  ['Spotify Premium 3 Months', '052E16', '1DB954', 'Streaming', 'Personal Account', 'Instant', 90, 549, 810, false],
  ['NordVPN 1 Year', '172554', '4687FF', 'Security', 'License Key', 'Instant', 365, 1799, 752, false],
  ['LinkedIn Learning 6 Months', '0C4A6E', '0A66C2', 'Education', 'Shared Access', 'Manual', 180, 999, 695, false],
  ['Notion Premium Template Pack', '18181B', 'FFFFFF', 'Templates', 'Download', 'Instant', 365, 399, 642, false],
  ['GitHub Copilot 1 Month', '0D1117', 'A371F7', 'Developer Tools', 'Personal Account', 'Manual', 30, 1099, 588, false],
  ['Google One 2TB 1 Year', '1E3A8A', '4285F4', 'Cloud Storage', 'Personal Account', 'Manual', 365, 2999, 520, false],
  ['Envato Elements 1 Month', '3F6212', '82B440', 'Design & Creative', 'Shared Access', 'Instant', 30, 749, 476, false],
  ['Windows 11 Pro Key', '082F49', '38BDF8', 'Software', 'License Key', 'Instant', 365, 1299, 444, false],
  ['Figma Professional 1 Year', '312E81', 'F24E1E', 'Design & Creative', 'Personal Account', 'Scheduled', 365, 2199, 390, false],
  ['Amazon Prime Video 3 Months', '0C4A6E', '00A8E1', 'Streaming', 'Shared Access', 'Instant', 90, 449, 370, false],
] as const;

  const officialDomains = [
    'openai.com', 'netflix.com', 'canva.com', 'capcut.com', 'youtube.com', 'microsoft.com',
    'grammarly.com', 'adobe.com', 'spotify.com', 'nordvpn.com', 'linkedin.com', 'notion.so',
    'github.com', 'one.google.com', 'envato.com', 'microsoft.com', 'figma.com', 'primevideo.com',
  ];

  await Recipe.deleteMany({ recipeName: { $nin: seeds.map(([name]) => name) } });

  await Recipe.bulkWrite(
    seeds.map(([recipeName, background, accent, category, cuisineType, difficultyLevel, preparationTime, price, likesCount, isFeatured], index) => {
      const author = index % 5 === 0 ? rafi : chef;

      return {
        updateOne: {
          filter: { recipeName },
          update: {
            $set: {
              recipeName,
              recipeImage: `https://www.google.com/s2/favicons?domain_url=https://${officialDomains[index]}&sz=256`,
              category,
              cuisineType,
              difficultyLevel,
              preparationTime,
              ingredients: ['Verified access', 'Setup support', 'Replacement warranty', 'Secure delivery'],
              instructions: ['Complete checkout.', 'Receive access details securely.', 'Follow the activation guide.'],
              authorId: author._id,
              authorName: author.name,
              authorEmail: author.email,
              likedBy: [admin._id, rafi._id],
              likesCount,
              isFeatured,
              status: 'published',
              price,
            },
          },
          upsert: true,
        },
      };
    })
  );

  const butterChicken = await Recipe.findOne({ recipeName: 'Netflix Premium 1 Month' }).orFail();
  const spicyRamen = await Recipe.findOne({ recipeName: 'GitHub Copilot' }).orFail();

  await Favorite.updateOne(
    { userId: rafi._id, recipeId: butterChicken._id },
    { $set: { userEmail: rafi.email, userId: rafi._id, recipeId: butterChicken._id, addedAt: new Date() } },
    { upsert: true }
  );

  await Report.updateOne(
    { recipeId: spicyRamen._id, reporterEmail: rafi.email, status: 'pending' },
    { $set: { recipeId: spicyRamen._id, reporterEmail: rafi.email, reason: 'Spam', status: 'pending' } },
    { upsert: true }
  );

  await Payment.updateOne(
    { checkoutSessionId: 'cs_test_recipehub_seed_premium_rafi' },
    {
      $set: {
        userEmail: rafi.email,
        userId: rafi._id,
        amount: 9.99,
        recipeId: null,
        checkoutSessionId: 'cs_test_recipehub_seed_premium_rafi',
        transactionId: 'pi_test_recipehub_seed_premium_rafi',
        type: 'premium',
        paymentStatus: 'paid',
        paidAt: new Date(),
      },
    },
    { upsert: true }
  );

  console.log('Seed complete');
  console.log('Admin login: admin@recipehub.dev / Admin123');
  console.log('User login: rafi@recipehub.dev / Recipe123');
  console.log('Premium chef login: chef@recipehub.dev / Recipe123');

  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
