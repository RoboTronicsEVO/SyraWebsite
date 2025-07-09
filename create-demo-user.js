const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const uri = 'mongodb://localhost:27017/SyraRobot';

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  image: String,
});
const User = mongoose.model('User', userSchema);

async function createDemoUser() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Demo user creation is disabled in production for security reasons.');
  }
  // Strong password policy: at least 12 chars, upper/lowercase, number, symbol
  const demoPassword = process.env.DEMO_USER_PASSWORD;
  if (!demoPassword) {
    throw new Error('Please set DEMO_USER_PASSWORD environment variable');
  }
  const hashed = await bcrypt.hash(demoPassword, 10);
  const existing = await User.findOne({ email: 'demo@syrarobot.com' });
  if (existing) {
    console.log('Demo user already exists.');
  } else {
    await User.create({
      name: 'Demo User',
      email: 'demo@syrarobot.com',
      password: hashed,
      image: '',
    });
    console.log('Demo user created! Password:', demoPassword);
  }
  await mongoose.disconnect();
}
createDemoUser().catch(e => { console.error(e); process.exit(1); }); 