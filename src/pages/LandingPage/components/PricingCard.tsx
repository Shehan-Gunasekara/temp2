import { Check } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { cn } from '../../../utils/classNames';
import { LucideIcon } from 'lucide-react';

interface Props {
  title: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  onClick: () => void;
  highlighted?: boolean;
  icon: LucideIcon;
}

export function PricingCard({ 
  title, 
  price, 
  description, 
  features, 
  buttonText, 
  onClick,
  highlighted = false,
  icon: Icon
}: Props) {
  return (
    <Card className={cn(
      "p-8 transition-all duration-300",
      highlighted ? "ring-2 ring-black scale-105" : undefined
    )}>
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-2xl bg-black/5 flex items-center justify-center mx-auto mb-6">
          <Icon className="h-6 w-6 text-black/60" />
        </div>
        <h3 className="text-2xl font-medium mb-2">{title}</h3>
        <div className="text-4xl font-semibold mb-2">{price}</div>
        <p className="text-black/60">{description}</p>
      </div>
      
      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <Check className="h-5 w-5 mr-3 text-black/40" />
            <span className="text-black/80">{feature}</span>
          </li>
        ))}
      </ul>
      
      <Button 
        variant={highlighted ? 'primary' : 'secondary'}
        className="w-full"
        onClick={onClick}
      >
        {buttonText}
      </Button>
    </Card>
  );
}