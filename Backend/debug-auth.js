import 'dotenv/config';
import mongoose from 'mongoose';
import User from './src/models/user.model.js';

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const email = 'MixedCaseUser@Example.com';
    const password = 'secret123';
    await User.deleteOne({ email: email.toLowerCase() });

    const created = await User.create({ fullName: 'Temp User', email, password });
    const found = await User.findOne({ email: String(email).trim().toLowerCase() });
    const correct = !!found && await found.isPasswordCorrect(password);

    const result = {
      createdEmail: created.email,
      foundEmail: found ? found.email : null,
      passwordMatch: correct,
      envLoaded: !!process.env.JWT_SECRET,
    };

    await import('node:fs/promises').then((fs) => fs.writeFile('debug-auth-result.json', JSON.stringify(result, null, 2)));
    console.log('AUTH_DEBUG_OK');
  } catch (error) {
    await import('node:fs/promises').then((fs) => fs.writeFile('debug-auth-result.json', JSON.stringify({ error: error.message }, null, 2)));
    console.log('AUTH_DEBUG_ERR');
    console.error(error);
  } finally {
    await mongoose.disconnect();
  }
};

run();
