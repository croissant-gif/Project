import dbConnect from '../../../../utils/dbConnect';
import Account from '../../../../models/Account';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs'; 

export async function POST(req) {
  await dbConnect();

  const { name, lastName, username, password } = await req.json();

  try {
    // Check if the account already exists based on the username
    const existingAccount = await Account.findOne({ username });
    if (existingAccount) {
      return NextResponse.json(
        { message: 'Account with this username already exists' },
        { status: 400 }
      );
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10); // 10 = salt rounds

    const newAccount = new Account({
      name,
      lastName,
      username,
      password: hashedPassword, //Save hashed password
    });

    const savedAccount = await newAccount.save();

    return NextResponse.json(savedAccount, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error creating account', error: error.message },
      { status: 500 }
    );
  }
}
