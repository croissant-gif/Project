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

    //  Compare hashed password
    const isMatch = await bcrypt.compare(password, account.password);

    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 });
    }

    return NextResponse.json({
      message: 'Login successful',
      accountId: account._id,
      name: account.name,
    }, { status: 200 });
    
  } catch (error) {
    return NextResponse.json({ message: 'Server error', error: error.message }, { status: 500 });
  }
}
