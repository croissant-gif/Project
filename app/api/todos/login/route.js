import dbConnect from '../../../../utils/dbConnect';
import Account from '../../../../models/Account';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs'; 

export async function POST(req) {
  await dbConnect();

  const { username, password } = await req.json();

  try {
    const account = await Account.findOne({ username });

    if (!account) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(password, account.password);

    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 });
    }

    // Convert to plain object and remove password before sending
    const accountData = account.toObject();
    delete accountData.password;

  return NextResponse.json({
  message: 'Login successful',
  name: account.name,
  lastName: account.lastName
});
  } catch (error) {
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}
