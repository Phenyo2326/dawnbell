
import { format } from 'date-fns';

type ChatMessageProps = {
  content: string;
  timestamp: string;
  isOwn: boolean;
};

const ChatMessage = ({ content, timestamp, isOwn }: ChatMessageProps) => {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`rounded-lg p-3 max-w-[70%] ${
        isOwn ? 'bg-primary text-primary-foreground' : 'bg-muted'
      }`}>
        <p className="break-words">{content}</p>
        <p className="text-xs mt-1 opacity-70">
          {format(new Date(timestamp), 'PPp')}
        </p>
      </div>
    </div>
  );
};

export default ChatMessage;
