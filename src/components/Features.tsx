
import { Search, Calendar, GraduationCap, MessageSquare } from "lucide-react";

const features = [
  {
    icon: <Search className="h-10 w-10 text-primary" />,
    title: "Find Your Perfect Match",
    description: "Browse our network of qualified tutors and filter by subject, price, and availability to find your ideal learning partner."
  },
  {
    icon: <Calendar className="h-10 w-10 text-primary" />,
    title: "Schedule Flexibly",
    description: "Book sessions for when it suits you. Our scheduling tool makes it easy to find times that work with your busy life."
  },
  {
    icon: <GraduationCap className="h-10 w-10 text-primary" />,
    title: "Learn From Experts",
    description: "All our tutors are qualified professionals with verified credentials and experience in their teaching subjects."
  },
  {
    icon: <MessageSquare className="h-10 w-10 text-primary" />,
    title: "Communicate Easily",
    description: "Our integrated messaging system helps you stay in touch with your tutor before, during, and after your learning journey."
  }
];

const Features = () => {
  return (
    <section className="py-16 bg-secondary">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How Dawnbell Academy Works</h2>
          <p className="text-muted-foreground text-lg">
            Our simple process helps you find and connect with tutors who can help you achieve your learning goals.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
