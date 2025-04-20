
import { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import ChatMessage from './ChatMessage';
import { toast } from 'sonner';

type ChatInterfaceProps = {
  recipientId: string;
  recipientName: string;
};

const ChatInterface = ({ recipientId, recipientName }: ChatInterfaceProps) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: true });

      if (error) {
        toast.error('Error fetching messages');
        return;
      }

      if (data) {
        setMessages(data);
      }
    };

    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel('messages_channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=eq.${user?.id},receiver_id=eq.${user?.id}`,
        },
        (payload) => {
          setMessages((current) => [...current, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, recipientId]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newMessage.trim()) return;

    setLoading(true);
    const { error } = await supabase.from('messages').insert({
      content: newMessage.trim(),
      sender_id: user.id,
      receiver_id: recipientId,
    });

    if (error) {
      toast.error('Failed to send message');
    } else {
      setNewMessage('');
    }
    setLoading(false);
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle>Chat with {recipientName}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto flex flex-col">
        <div className="flex-1 space-y-4">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              content={message.content}
              timestamp={message.created_at}
              isOwn={message.sender_id === user?.id}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={sendMessage} className="mt-4 flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={loading}
          />
          <Button type="submit" disabled={loading || !newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ChatInterface;
