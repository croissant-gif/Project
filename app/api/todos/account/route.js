import dbConnect from '../../../../utils/dbConnect';
import Account from '../../../../models/Account';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

 
export async function POST(req) {
  await dbConnect();
  const { name, lastName, username, password } = await req.json();

  try {
    const existingAccount = await Account.findOne({ username });
    if (existingAccount) {
      return NextResponse.json({ message: 'Username already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAccount = new Account({ name, lastName, username, password: hashedPassword });
    const savedAccount = await newAccount.save();

    return NextResponse.json(savedAccount, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating account', error: error.message }, { status: 500 });
  }
}
 
export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username');

  if (!username) return NextResponse.json({ message: 'Username is required' }, { status: 400 });

  try {
    const account = await Account.findOne({ username }).select('-password');
    if (!account) return NextResponse.json({ message: 'User not found' }, { status: 404 });

    return NextResponse.json(account, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching account', error: error.message }, { status: 500 });
  }
}

 
export async function PUT(req) {
  await dbConnect();
  const { currentUsername, newUsername, name, lastName } = await req.json();

  if (!currentUsername) {
    return NextResponse.json({ message: 'Current username required' }, { status: 400 });
  }

  try {
    const updateData = {};
    if (newUsername) updateData.username = newUsername;
    if (name) updateData.name = name;
    if (lastName) updateData.lastName = lastName;

    const updatedAccount = await Account.findOneAndUpdate(
      { username: currentUsername },
      updateData,
      { new: true }
    ).select('-password');

    if (!updatedAccount) {
      return NextResponse.json({ message: 'Account not found' }, { status: 404 });
    }

    return NextResponse.json(updatedAccount, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error updating account', error: error.message }, { status: 500 });
  }
}
 
export async function PATCH(req) {
  await dbConnect();
  const { username, currentPassword, newPassword } = await req.json();

  if (!username || !currentPassword || !newPassword) {
    return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
  }

  try {
    const account = await Account.findOne({ username });
    if (!account) return NextResponse.json({ message: 'Account not found' }, { status: 404 });

    const isMatch = await bcrypt.compare(currentPassword, account.password);
    if (!isMatch) return NextResponse.json({ message: 'Current password incorrect' }, { status: 401 });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    account.password = hashedPassword;
    await account.save();

    return NextResponse.json({ message: 'Password updated successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error updating password', error: error.message }, { status: 500 });
  }
}

 
export async function DELETE(req) {
  await dbConnect();
  const { username } = await req.json();

  if (!username) return NextResponse.json({ message: 'Username is required' }, { status: 400 });

  try {
    const deletedAccount = await Account.findOneAndDelete({ username });

    if (!deletedAccount) {
      return NextResponse.json({ message: 'Account not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Account deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting account', error: error.message }, { status: 500 });
  }
}
