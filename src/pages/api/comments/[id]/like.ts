import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/mongodb';
import CommentModel from '@/models/Comment';
import { isValidObjectId } from 'mongoose';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST method for liking comments
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  await dbConnect();

  try {
    const { id } = req.query;

    // Validate comment ID
    if (!id || typeof id !== 'string' || !isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid comment ID' });
    }

    // Find the comment and increment like count
    const comment = await CommentModel.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    return res.status(200).json({ success: true, comment });
  } catch (error) {
    console.error('Error liking comment:', error);
    return res.status(500).json({ error: 'Failed to like comment' });
  }
}