import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/mongodb';
import CommentModel from '@/models/Comment';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  // GET method - retrieve all comments
  if (req.method === 'GET') {
    try {
      // Fetch all root comments (no parentId) with their replies populated
      const comments = await CommentModel.find({ parentId: null })
        .sort({ createdAt: -1 })
        .populate({
          path: 'replies',
          options: { sort: { createdAt: 1 } }
        });

      return res.status(200).json({ success: true, comments });
    } catch (error) {
      console.error('Error fetching comments:', error);
      return res.status(500).json({ error: 'Failed to fetch comments' });
    }
  }

  // POST method - create a new comment
  if (req.method === 'POST') {
    try {
      const { author, content, parentId } = req.body;

      // Validate required fields
      if (!author || !content) {
        return res.status(400).json({ error: 'Author and content are required' });
      }

      // Create and save the new comment
      const newComment = await CommentModel.create({
        author,
        content,
        parentId: parentId || null,
      });

      // If this is a reply, make sure to populate it
      if (parentId) {
        await newComment.populate('replies');
      }

      return res.status(201).json({ success: true, comment: newComment });
    } catch (error) {
      console.error('Error creating comment:', error);
      return res.status(500).json({ error: 'Failed to create comment' });
    }
  }

  // If method is not supported
  return res.status(405).json({ error: 'Method not allowed' });
}