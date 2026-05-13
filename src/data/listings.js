export const agents = [
  {
    id: "a1",
    name: "Chidi Okafor",
    avatar: "https://i.pravatar.cc/150?img=11",
    rating: 4.8,
    reviews: 34,
    bio: "Top-rated agent in Lagos with 6+ years of experience in residential and commercial properties.",
    phone: "+2348123456789",
  },
  {
    id: "a2",
    name: "Amaka Nwosu",
    avatar: "https://i.pravatar.cc/150?img=47",
    rating: 4.5,
    reviews: 21,
    bio: "Specializing in luxury apartments and short-let properties across Abuja.",
    phone: "+2348234567890",
  },
  {
    id: "a3",
    name: "Emeka Eze",
    avatar: "https://i.pravatar.cc/150?img=15",
    rating: 4.2,
    reviews: 18,
    bio: "Affordable housing expert helping first-time renters find their perfect home.",
    phone: "+2348345678901",
  },
];

export const agentReviews = {
  a1: [
    {
      id: "r1",
      author: "Tunde B.",
      avatar: "https://i.pravatar.cc/150?img=3",
      rating: 5,
      comment:
        "Chidi was incredibly professional and helped me find my apartment within a week. Highly recommend!",
      date: "Apr 2026",
    },
    {
      id: "r2",
      author: "Ngozi A.",
      avatar: "https://i.pravatar.cc/150?img=25",
      rating: 5,
      comment:
        "Very responsive and honest about property conditions. No hidden surprises.",
      date: "Mar 2026",
    },
    {
      id: "r3",
      author: "Seun M.",
      avatar: "https://i.pravatar.cc/150?img=8",
      rating: 4,
      comment:
        "Great experience overall. The process was smooth and he kept me updated throughout.",
      date: "Feb 2026",
    },
  ],
  a2: [
    {
      id: "r4",
      author: "Kemi O.",
      avatar: "https://i.pravatar.cc/150?img=32",
      rating: 5,
      comment:
        "Amaka found us a stunning duplex in Maitama. She really understands luxury properties.",
      date: "Apr 2026",
    },
    {
      id: "r5",
      author: "Bola F.",
      avatar: "https://i.pravatar.cc/150?img=19",
      rating: 4,
      comment:
        "Professional and knowledgeable. Took time to understand exactly what we needed.",
      date: "Jan 2026",
    },
  ],
  a3: [
    {
      id: "r6",
      author: "Dami L.",
      avatar: "https://i.pravatar.cc/150?img=44",
      rating: 4,
      comment:
        "Emeka helped me find an affordable place close to my office. Very patient agent.",
      date: "Mar 2026",
    },
    {
      id: "r7",
      author: "Femi K.",
      avatar: "https://i.pravatar.cc/150?img=57",
      rating: 4,
      comment:
        "Good communication and fair pricing. Would use his services again.",
      date: "Feb 2026",
    },
  ],
};

export const listings = [
  {
    id: "p1",
    agentId: "a1",
    title: "2 Bedroom Apartment in Lekki",
    paymentType: "yearly",
    firstPaymentAmount: null,
    yearlyRentAmount: 350000,
    location: "Lekki Phase 1, Lagos",
    description:
      "A beautifully finished 2-bedroom apartment with modern fittings, 24/7 power supply, and secure parking. Located in the heart of Lekki Phase 1, close to major roads and amenities.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=1422&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=1422&fit=crop&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=1422&fit=crop&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=1422&fit=crop&q=80",
    ],
    beds: 2,
    baths: 2,
    sqft: 1100,
    status: "available",
    views: 142,
    rating: 4.7,
  },
  {
    id: "p2",
    agentId: "a2",
    title: "3 Bedroom Duplex in Maitama",
    paymentType: "yearly",
    firstPaymentAmount: null,
    yearlyRentAmount: 2500000,
    location: "Maitama, Abuja",
    description:
      "Spacious 3-bedroom duplex in the prestigious Maitama district. Features a large living area, fitted kitchen, boys' quarters, and a private garden.",
    image:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    ],
    beds: 3,
    baths: 3,
    sqft: 2200,
    status: "available",
    views: 98,
    rating: 4.5,
  },
  {
    id: "p3",
    agentId: "a3",
    title: "Self-Contain Studio in Yaba",
    paymentType: "yearly",
    firstPaymentAmount: null,
    yearlyRentAmount: 180000,
    location: "Yaba, Lagos",
    description:
      "Cozy self-contain studio apartment ideal for young professionals. Close to UNILAG, tech hubs, and public transport. Water and security included.",
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
    ],
    beds: 1,
    baths: 1,
    sqft: 450,
    status: "taken",
    views: 210,
    rating: 4.1,
  },
  {
    id: "p4",
    agentId: "a1",
    title: "4 Bedroom Terrace in Ikeja GRA",
    paymentType: "yearly",
    firstPaymentAmount: null,
    yearlyRentAmount: 4000000,
    location: "Ikeja GRA, Lagos",
    description:
      "Premium 4-bedroom terrace in the serene Ikeja GRA. Comes with a swimming pool, gym access, and 24/7 security. Perfect for families.",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    ],
    beds: 4,
    baths: 4,
    sqft: 3100,
    status: "available",
    views: 76,
    rating: 4.9,
  },
  {
    id: "p5",
    agentId: "a2",
    title: "1 Bedroom Flat in Wuse 2",
    paymentType: "yearly",
    firstPaymentAmount: null,
    yearlyRentAmount: 600000,
    location: "Wuse 2, Abuja",
    description:
      "Modern 1-bedroom flat in the vibrant Wuse 2 area. Fully tiled, with fitted wardrobes, constant water supply, and a secure compound.",
    image:
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
    ],
    beds: 1,
    baths: 1,
    sqft: 650,
    status: "available",
    views: 55,
    rating: 4.3,
  },
];
