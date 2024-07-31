import mongoose from 'mongoose';

// Defines how a user is stored in the database
const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  profile: {
    type: String,
    required: true,
  },
  refreshToken: String,
  refreshTokenExpiry: {
    type: Date,
    required: true,
  },
});

const User = mongoose.model('Users', userSchema);

export default User;
