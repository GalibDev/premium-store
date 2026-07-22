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
  ['Canva Pro 1 Year', 'photo-1561070791-2526d30994b5', 'Design & Creative', 'Personal Account', 'Instant', 365, 1240, true],
  ['CapCut Pro 6 Months', 'photo-1574717024653-61fd2cf4d44d', 'Design & Creative', 'Personal Account', 'Instant', 180, 1186, true],
  ['ChatGPT Plus 1 Month', 'photo-1677442136019-21780ecad995', 'AI Tools', 'Shared Access', 'Instant', 30, 1110, true],
  ['Netflix Premium 1 Month', 'photo-1574375927938-d5a98e8ffe85', 'Streaming', 'Shared Access', 'Instant', 30, 1042, true],
  ['Microsoft 365 Family', 'photo-1633419461186-7d40a38105ec', 'Productivity', 'License Key', 'Instant', 365, 996, true],
  ['Adobe Creative Cloud', 'photo-1558655146-9f40138edfeb', 'Design & Creative', 'License Key', 'Manual', 30, 930, false],
  ['Spotify Premium', 'photo-1516280440614-37939bbacd81', 'Streaming', 'Personal Account', 'Instant', 90, 884, false],
  ['NordVPN 1 Year', 'photo-1563013544-824ae1b704d3', 'Security', 'License Key', 'Instant', 365, 810, false],
  ['LinkedIn Learning', 'photo-1522202176988-66273c2fd55f', 'Education', 'Shared Access', 'Manual', 180, 752, false],
  ['Notion Template Pack', 'photo-1516321318423-f06f85e504b3', 'Templates', 'Download', 'Instant', 365, 695, false],
  ['GitHub Copilot', 'photo-1555066931-4365d14bab8c', 'Developer Tools', 'Personal Account', 'Manual', 30, 642, false],
  ['Google One 2TB', 'photo-1614064641938-3bbee52942c7', 'Cloud Storage', 'Personal Account', 'Manual', 365, 588, false],
  ['Envato Elements', 'photo-1559028012-481c04fa702d', 'Design & Creative', 'Shared Access', 'Instant', 30, 520, false],
  ['Udemy Business', 'photo-1523240795612-9a054b0db644', 'Education', 'Shared Access', 'Manual', 180, 476, false],
  ['Windows 11 Pro Key', 'photo-1624571409108-e9a41746af53', 'Software', 'License Key', 'Instant', 365, 444, false],
  ['Figma Professional', 'photo-1559028012-d74eadee55f', 'Design & Creative', 'Personal Account', 'Scheduled', 365, 390, false],
] as const;

  await Recipe.bulkWrite(
    seeds.map(([recipeName, imageId, category, cuisineType, difficultyLevel, preparationTime, likesCount, isFeatured], index) => {
      const author = index % 5 === 0 ? rafi : chef;

      return {
        updateOne: {
          filter: { recipeName },
          update: {
            $set: {
              recipeName,
              recipeImage: `https://images.unsplash.com/${imageId}?auto=format&fit=crop&w=1000&q=85`,
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
              status: index === 15 ? 'hidden' : 'published',
              price: index % 4 === 0 ? 3.99 : 2.99,
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
