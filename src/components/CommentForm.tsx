import { useState } from 'react';

type CommentFormProps = {
  onSubmit: (author: string, content: string) => void;
  initialAuthor?: string;
  placeholder?: string;
  buttonText?: string;
  isReply?: boolean;
};

export default function CommentForm({
  onSubmit,
  initialAuthor = '',
  placeholder = 'Share your thoughts...',
  buttonText = 'Post Comment',
  isReply = false
}: CommentFormProps) {
  const [author, setAuthor] = useState(initialAuthor);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!author.trim() || !content.trim()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      onSubmit(author, content);
      // Clear content but keep author name
      setContent('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`${isReply ? 'mt-3' : 'bg-gray-50 p-4 rounded-lg'}`}>
      {!isReply && <h3 className="text-lg font-medium mb-3">Add a comment</h3>}
      
      <div className="mb-3">
        <label htmlFor={`author-${isReply ? 'reply' : 'comment'}`} className="block text-sm font-medium text-gray-700 mb-1">
          Your Name
        </label>
        <input
          type="text"
          id={`author-${isReply ? 'reply' : 'comment'}`}
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Your name"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="mb-3">
        <label htmlFor={`content-${isReply ? 'reply' : 'comment'}`} className="block text-sm font-medium text-gray-700 mb-1">
          {isReply ? 'Your Reply' : 'Your Comment'}
        </label>
        <textarea
          id={`content-${isReply ? 'reply' : 'comment'}`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          required
          rows={isReply ? 2 : 3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <button
        type="submit"
        disabled={isSubmitting || !author.trim() || !content.trim()}
        className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 
          ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isSubmitting ? 'Posting...' : buttonText}
      </button>
    </form>
  );
}