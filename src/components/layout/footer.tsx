
import { Facebook, Instagram, Twitter, Phone, MessageSquare, Camera } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';

export function Footer() {
  return (
    <footer className="border-t border-primary/20 bg-black text-gray-300">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          
          <div className="mb-6 md:mb-0">
            <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
              <Camera className="h-6 w-6 text-primary" />
              <span className="font-bold font-headline text-lg">प्रदीप फिल्म्स स्टूडियो</span>
            </div>
            <p className="text-muted-foreground">चांदापुर, महाराजगंज, रायबरेली</p>
          </div>

          <div>
             <h3 className="font-headline text-lg mb-4 text-white">क्विक लिंक्स</h3>
             <ul className="space-y-2">
                <li><Link href="/services" className="text-muted-foreground hover:text-primary">सेवाएं</Link></li>
                <li><Link href="/gallery" className="text-muted-foreground hover:text-primary">गैलरी</Link></li>
                <li><Link href="/booking" className="text-muted-foreground hover:text-primary">बुक करें</Link></li>
             </ul>
          </div>
          
          <div className="flex flex-col items-center md:items-start space-y-4">
             <Button asChild variant="outline" className="bg-transparent border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                <a href="tel:8175817540">
                    <Phone className="h-4 w-4 mr-2"/>
                    <span>अभी कॉल करें</span>
                </a>
             </Button>
             <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                <a href="https://wa.me/918175817540" target="_blank" rel="noopener noreferrer">
                    <MessageSquare className="h-4 w-4 mr-2"/>
                    <span>व्हाट्सएप पर संदेश भेजें</span>
                </a>
             </Button>
          </div>

        </div>
        <div className="mt-8 pt-8 border-t border-primary/20 flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} प्रदीप फिल्म्स स्टूडियो. सर्वाधिकार सुरक्षित।</p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Twitter /></Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Facebook /></Link>
            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Instagram /></Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
