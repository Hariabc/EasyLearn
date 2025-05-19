import React, { useState, useEffect, useContext } from 'react';
import api from '../axios';
import { Card, CardBody, CardHeader, Typography, Button, Input } from '@material-tailwind/react';
import { AuthContext } from '../context/AuthContext';

const Discussion = () => {
  const { user, authToken } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch messages on component mount
  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get('/api/discussions', {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      if (response.data) {
        setMessages(response.data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      if (error.response) {
        setError(`Error: ${error.response.data.message || 'Failed to load messages'}`);
      } else if (error.request) {
        setError('No response from server. Please check your connection.');
      } else {
        setError('Error loading messages. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setLoading(true);
    setError(null);
    try {
      if (!authToken) {
        throw new Error('Please log in to post messages');
      }

      const response = await api.post(
        '/api/discussions',
        { message: newMessage },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      if (response.data) {
        setNewMessage('');
        await fetchMessages(); // Refresh messages after posting
      }
    } catch (error) {
      console.error('Error posting message:', error);
      if (error.response) {
        setError(error.response.data.message || 'Failed to post message');
      } else if (error.request) {
        setError('No response from server. Please check your connection.');
      } else {
        setError('Error posting message. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <Typography variant="h4" color="blue-gray">
          Discussion Board
        </Typography>
      </CardHeader>
      <CardBody>
        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        {/* Message Form */}
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-2">
            <Input
              type="text"
              label="Type your message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1"
              disabled={!user || loading}
            />
            <Button type="submit" disabled={loading || !user}>
              {loading ? 'Posting...' : 'Post'}
            </Button>
          </div>
        </form>

        {/* Messages List */}
        {isLoading ? (
          <div className="text-center py-4">
            <Typography>Loading messages...</Typography>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-4">
            <Typography>No messages yet. Be the first to post!</Typography>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <Card key={message._id} className="p-4">
                <div className="flex justify-between items-start">
                  <Typography variant="small" color="blue-gray" className="font-medium">
                    {message.userEmail}
                  </Typography>
                  <Typography variant="small" color="gray">
                    {new Date(message.timestamp).toLocaleString()}
                  </Typography>
                </div>
                <Typography className="mt-2">{message.message}</Typography>
              </Card>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default Discussion; 