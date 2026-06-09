import mongoose from 'mongoose';
import Course from './server/models/Course.js';
import User from './server/models/User.js';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
dotenv.config();

async function assign() {
  await mongoose.connect(process.env.MONGO_URI);
  let trainer = await User.findOne({ role: 'trainer', email: 'trainer@test.com' });
  if (!trainer) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    trainer = await User.create({
      name: 'Test Trainer',
      email: 'trainer@test.com',
      password: hashedPassword,
      role: 'trainer'
    });
    console.log('Created test trainer user');
  }
  await Course.updateMany({}, { trainerId: trainer._id });
  console.log('Assigned all courses to test trainer');
  process.exit();
}
assign();
