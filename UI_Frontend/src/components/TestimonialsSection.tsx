
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StarIcon } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Health Enthusiast",
    avatar: "SJ",
    comment: "MyDietDiary completely changed my approach to nutrition. The personalized recommendations actually work with my lifestyle!",
    rating: 5
  },
  {
    name: "Michael Chen",
    role: "Fitness Coach",
    avatar: "MC",
    comment: "I recommend MyDietDiary to all my clients. The balance of AI suggestions and professional oversight creates truly effective plans.",
    rating: 5
  },
  {
    name: "Emma Peters",
    role: "Busy Professional",
    avatar: "EP",
    comment: "Finally found a nutrition app that understands my hectic schedule and dietary restrictions. The recommendations are practical and easy to follow.",
    rating: 4
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Users Say</h2>
          <p className="text-lg text-muted-foreground">
            Hear from people who have transformed their nutrition with MyDietDiary
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex flex-col h-full">
                  <div className="flex items-center mb-4">
                    <Avatar className="h-10 w-10 mr-4">
                      <AvatarFallback className="bg-dietGreen text-white">
                        {testimonial.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  
                  <p className="italic text-muted-foreground flex-grow mb-4">"{testimonial.comment}"</p>
                  
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon 
                        key={i} 
                        className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
