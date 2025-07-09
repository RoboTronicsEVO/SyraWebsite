const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const uri = 'mongodb://localhost:27017/SyraRobot';

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  image: String,
});
const User = mongoose.model('User', userSchema);

async function createDemoUser() {
  await mongoose.connect(uri);
  const hashed = await bcrypt.hash('password123', 10);
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
    console.log('Demo user created!');
  }
  await mongoose.disconnect();
}

createDemoUser().catch(e => { console.error(e); process.exit(1); }); 