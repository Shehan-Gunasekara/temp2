import { Card } from '../../../components/ui/Card';

interface Props {
  quote: string;
  author: string;
  role: string;
  avatar: string;
}

export function TestimonialCard({ quote, author, role, avatar }: Props) {
  return (
    <Card className="p-6">
      <p className="text-lg mb-6">{quote}</p>
      <div className="flex items-center">
        <img 
          src={avatar} 
          alt={author}
          className="w-12 h-12 rounded-full object-cover mr-4"
        />
        <div>
          <div className="font-medium">{author}</div>
          <div className="text-sm text-black/60">{role}</div>
        </div>
      </div>
    </Card>
  );
}