import mongoose from 'mongoose';

interface IUser extends mongoose.Document {
	username: string;
	email: string;
	password: string;
}

const UserSchema = new mongoose.Schema<IUser>({
	username: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
});

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
