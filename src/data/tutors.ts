import { Tutor } from "@/types/tutors";

export const tutors: Tutor[] = [
  {
    id: 2,
    name: "Marang Ngewa",
    avatar: "/lovable-uploads/9408bb8a-f37b-4b73-ba9c-2121211ec896.png",
    subjects: ["Physics"],
    rating: 4.7,
    reviews: 92,
    hourlyRate: 42,
    education: "Ph.D. in Physics, University of Cape Town",
    availability: "Weekdays, Evenings",
    description: "Passionate physics educator dedicated to breaking down complex scientific concepts. I use interactive demonstrations and real-world applications to make physics engaging and accessible."
  },
  {
    id: 3,
    name: "Katlego Darula",
    avatar: "https://randomuser.me/api/portraits/women/33.jpg",
    subjects: ["Chemistry"],
    rating: 4.6,
    reviews: 82,
    hourlyRate: 35,
    education: "Ph.D. in Chemistry, University of Pretoria",
    availability: "Weekdays, Mornings",
    description: "Passionate chemistry educator with a focus on making complex chemical concepts accessible and engaging. I use interactive teaching methods to help students understand and excel."
  },
  {
    id: 4,
    name: "Priya Patel",
    avatar: "https://randomuser.me/api/portraits/women/67.jpg",
    subjects: ["English Literature", "Essay Writing"],
    rating: 4.9,
    reviews: 112,
    hourlyRate: 32,
    education: "M.A. in English Literature, Columbia",
    availability: "Flexible Schedule",
    description: "Helping students find their voice through writing. Specializing in essay structure, analysis, and critical thinking."
  },
  {
    id: 5,
    name: "David Wilson",
    avatar: "https://randomuser.me/api/portraits/men/52.jpg",
    subjects: ["History", "Political Science"],
    rating: 4.6,
    reviews: 75,
    hourlyRate: 28,
    education: "Ph.D. in History, Yale",
    availability: "Weekends, Afternoons",
    description: "Passionate about connecting historical events to modern contexts. I focus on critical analysis and research methods."
  },
  {
    id: 6,
    name: "Jasmine Williams",
    avatar: "https://randomuser.me/api/portraits/women/28.jpg",
    subjects: ["Spanish", "French"],
    rating: 4.8,
    reviews: 93,
    hourlyRate: 34,
    education: "B.A. in Linguistics, NYU",
    availability: "Weekdays, Evenings",
    description: "Conversational language tutor with immersive teaching methods. I make learning new languages fun and practical."
  },
  {
    id: 7,
    name: "Gift Tshekiso",
    avatar: "https://randomuser.me/api/portraits/men/77.jpg",
    subjects: ["Mathematics", "Calculus", "Statistics"],
    rating: 4.7,
    reviews: 89,
    hourlyRate: 38,
    education: "M.Sc. in Mathematics, University of Johannesburg",
    availability: "Weekdays, Afternoons",
    description: "Dedicated mathematics educator with a passion for helping students excel in complex mathematical concepts. I break down challenging topics into understandable segments."
  }
];

export const subjects = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "Computer Science",
  "English Literature",
  "Essay Writing",
  "History",
  "Political Science",
  "Spanish",
  "French",
  "Statistics",
  "Calculus"
];
