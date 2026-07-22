import 'dotenv/config';
import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/premiumstore';

const products = [
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
];

const officialDomains = [
  'openai.com', 'netflix.com', 'canva.com', 'capcut.com', 'youtube.com', 'microsoft.com',
  'grammarly.com', 'adobe.com', 'spotify.com', 'nordvpn.com', 'linkedin.com', 'notion.so',
  'github.com', 'one.google.com', 'envato.com', 'microsoft.com', 'figma.com', 'primevideo.com',
];

await mongoose.connect(uri);
const db = mongoose.connection.db;
if (!db) throw new Error('Database connection unavailable');

const users = db.collection('users');
const recipes = db.collection('recipes');
const [admin, seller] = await Promise.all([
  users.findOne({ role: 'admin' }),
  users.findOne({ role: { $ne: 'admin' } }),
]);
const owner = seller || admin;
if (!owner) throw new Error('Seed at least one user before importing products.');

await Promise.all([
  db.collection('favorites').deleteMany({}),
  db.collection('reports').deleteMany({}),
  db.collection('payments').deleteMany({ recipeId: { $ne: null } }),
]);
await recipes.deleteMany({});

const now = new Date();
await recipes.insertMany(products.map(([name, background, accent, category, deliveryType, deliverySpeed, duration, price, likes, featured], index) => ({
  recipeName: name,
  recipeImage: `https://www.google.com/s2/favicons?domain_url=https://${officialDomains[index]}&sz=256`,
  category,
  cuisineType: deliveryType,
  difficultyLevel: deliverySpeed,
  preparationTime: duration,
  ingredients: ['Verified premium access', 'Setup assistance', 'Replacement warranty', 'Secure delivery'],
  instructions: ['Complete checkout.', 'Receive access details securely.', 'Follow the included activation guide.'],
  authorId: owner._id,
  authorName: owner.name || 'PremiumStore',
  authorEmail: owner.email,
  likedBy: [],
  likesCount: likes,
  isFeatured: featured,
  status: 'published',
  price,
  ratingAverage: 4.6 + (index % 4) * 0.1,
  ratingCount: 28 + index * 7,
  createdAt: now,
  updatedAt: now,
})));

console.log(`PremiumStore migration complete: ${products.length} products inserted.`);
await mongoose.disconnect();
