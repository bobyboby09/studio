
import { Facebook, Instagram, Twitter, Phone, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '../icons';

export function Footer() {
  return (
    <footer className="border-t border-border/40">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
              <Logo className="h-6 w-6 text-primary" />
              <span className="font-bold font-headline text-lg">Pradeep film's studio and mixing lab</span>
            </div>
            <p className="text-muted-foreground">Chandapur, Maharajganj, Raebareli</p>
          </div>
          <div className="flex flex-col items-center md:items-end mb-6 md:mb-0">
             <div className="flex items-center space-x-2 mb-2">
                <Phone className="h-4 w-4 text-muted-foreground"/>
                <span className="text-muted-foreground">8175817540</span>
             </div>
             <div className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground"/>
                <span className="text-muted-foreground">WhatsApp: 8175817540</span>
             </div>
          </div>
          <div className="flex space-x-4">
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Twitter /></Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Facebook /></Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Instagram /></Link>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Pradeep film's studio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
