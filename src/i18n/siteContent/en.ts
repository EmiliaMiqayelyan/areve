/** English storefront copy `settings.site_content`; drives the public storefront copy and structure. */
export const SITE_CONTENT_EN = {
  metadata: {
    title: "AREVÉ — Handmade with Warmth and Sunlight",
    description:
      "Discover AREVÉ's handcrafted beaded bags, unique toys, and artisan accessories. Every piece made with love, warmth, and sunlight.",
  },
  nav: [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/gallery", label: "Gallery" },
    { href: "/about", label: "About" },
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "Contact" },
  ],
  footer: {
    explore: [
      ["/", "Home"],
      ["/products", "Products"],
      ["/gallery", "Gallery"],
      ["/about", "Our Story"],
    ] as [string, string][],
    support: [
      ["/faq", "FAQ"],
      ["/contact", "Contact Us"],
      ["/contact", "Custom Orders"],
      ["/faq", "Care Guide"],
      ["/faq", "Shipping"],
    ] as [string, string][],
    copyrightSuffix: "All rights reserved. Made with ☀️ and love.",
  },
  productCategoryLabels: {
    all: "All",
    bags: "Beaded Bags",
    toys: "Handmade Toys",
    accessories: "Accessories",
  },
  pages: {
    shop: {
      eyebrow: "Handmade Collection",
      title: "Your Next Bag",
      subtitle: 'Create something unique for yourself',
    },
    reviews: {
      eyebrow: "Customer Reviews",
      title: "What Our Community Says",
      subtitle: "Real words from real people who love handmade things.",
      avgRating: "5.0",
      avgRatingLabel: "Average Rating",
      totalReviewsLabel: "Total Reviews",
      fiveStarValue: "100%",
      fiveStarLabel: "5-Star Reviews",
      featuredQuote: "You can feel the love in every stitch. Worth every penny.",
      featuredAuthor: "— Sophie Laurent, Paris",
    },
    gallery: {
      eyebrow: "AREVÉ",
      title: "The Full\nCreative Journey",
      subtitle: "Craft • Style • Sunlight",
    },
    faq: {
      eyebrow: "· FAQ",
      title: "Frequently Asked Questions",
      subtitle: "Everything you need to know about AREVÉ",
    },
    checkout: {
      title: "Checkout",
      subtitle: "Complete your order",
    },
  },
  home: {
    collectionsSection: {
      eyebrow: "Categories",
      title: "Discover the world of Arevé",
      subtitle: "Handcrafted collections made to help you stand out.",
    },
    hero: {
      image: "/images/hero-light.png",
      eyebrow: "New Collection · 2026",
      title: "Style crafted",
      titleAccent: "from the sun",
      subtitle:
        "Unique design, quality materials and handcrafted work — for everyday moments and special occasions.",
      trustLine: "100% handmade • Made in Armenia",
      badgePrefix: "New Collection",
      titleLine1: "Style crafted",
      titleGold1: "from the sun",
      conjunction: "",
      titleGold2: "",
      stats: [
        { value: "500+", label: "Pieces Crafted" },
        { value: "200+", label: "Happy Clients" },
        { value: "100%", label: "Handmade" },
      ],
      primaryCta: { label: "Shop Now", href: "/products" },
      secondaryCta: { label: "View Collection", href: "/gallery" },
    },
    featuredSection: {
      eyebrow: "Favorites",
      title: "Most requested designs",
      viewAllLabel: "Shop All",
    },
    storySection: {
      image: "/images/about-light.png",
      floatingStatValue: "",
      floatingStatLabel: "",
      eyebrow: "AREVÉ",
      titleLine1: "Created",
      titleItalic: "for you",
      titleLine2: "",
      paragraphs: [
        "We create handmade bags that bring together style, quality and individuality.",
        "AREVÉ — made to stand out.",
      ],
      pillars: [
        { icon: "✦", label: "Handmade" },
        { icon: "☀️", label: "Unique" },
        { icon: "♡", label: "Quality" },
      ],
      ctaLabel: "Learn More",
      ctaHref: "/about",
    },
    testimonialsSection: {
      eyebrow: "Reviews",
      title: "Customer Reviews",
      subtitle: "What those who have already chosen AREVÉ have to say",
      readAllLabel: "All Reviews",
    },
    instagramSection: {
      eyebrow: "@areve.handmade",
      title: "Follow us",
      subtitle: "",
      viewLinkLabel: "Instagram →",
    },
    ctaSection: {
      emoji: "☀️",
      titleLine1: "Make it",
      titleItalic: "unique",
      paragraph: "Custom orders created just for you",
      buttonLabel: "Order Custom",
      buttonHref: "/contact",
    },
    collectionCards: [
      {
        title: "Beaded Bags",
        img: "/images/prod-bag-a.png",
        href: "/products?category=bags",
      },
      {
        title: "Handmade Toys",
        img: "/images/prod-toy-a.png",
        href: "/products?category=toys",
      },
      {
        title: "Accessories",
        img: "/images/prod-acc-a.png",
        href: "/products?category=accessories",
      },
    ],
  },
  about: {
    hero: {
      emoji: "☀️",
      eyebrow: "AREVÉ · sun",
      titleLine1: "Created from the",
      titleItalic: "sun",
      intro: "Made in Armenia",
    },
    beginning: {
      eyebrow: "The Beginning",
      title: "AREVÉ",
      paragraphs: [
        "The name AREVÉ comes from the word arév — the idea of light that highlights beauty.",
        "Today we create handmade bags and accessories with simple design and high quality.",
      ],
      image: "/images/about-light.png",
    },
    values: {
      eyebrow: "What We Believe",
      title: "Our Values",
      subtitle: "The principles behind every piece we create.",
      items: [
        {
          icon: "✦",
          bg: "#C7D3C0",
          title: "Handmade",
          desc: "Every item crafted entirely by hand. No machines, no shortcuts — only patient hands and careful attention.",
        },
        {
          icon: "☀️",
          bg: "#E6C97A",
          title: "Unique",
          desc: "Because every piece is made by hand, no two are exactly the same. You carry something truly one-of-a-kind.",
        },
        {
          icon: "♡",
          bg: "#E8CFCB",
          title: "High Quality",
          desc: "We source only the finest beads, natural fabrics, and threads. We will not put our name on anything less.",
        },
        {
          icon: "🌿",
          bg: "#EDE6DF",
          title: "Sustainable",
          desc: "Natural materials, small batches, zero-waste packaging. Beautiful should not cost the earth.",
        },
      ],
    },
    process: {
      eyebrow: "How We Work",
      title: "Behind the Scenes",
      subtitle: "From first sketch to your hands — the journey of every AREVÉ piece.",
      steps: [
        {
          n: "01",
          title: "Design & Dream",
          desc: "Every collection begins with a sketch and a feeling — a color seen in morning light, a pattern from an old textile.",
        },
        {
          n: "02",
          title: "Select Materials",
          desc: "We handpick every bead, fabric, and thread. Quality is felt before it is seen.",
        },
        {
          n: "03",
          title: "Bead by Bead",
          desc: "Each bead placed with intention. A single bag can take 40+ hours of careful, meditative work.",
        },
        {
          n: "04",
          title: "Final Love",
          desc: "Before shipping, every piece is inspected, wrapped with care, and sent with a little note.",
        },
      ],
    },
    bannerImages: ["/images/gallery-light-3.png", "/images/gallery-light-4.png", "/images/gallery-light-1.png"],
    closing: {
      title: "Keep searching for yours",
      subtitle: "Browse our handmade collections — each one is waiting",
      ctaLabel: "Shop the Collection",
      ctaHref: "/products",
    },
  },
  contact: {
    hero: {
      eyebrow: "CONTACT",
      title: "Let's create together",
      subtitle:
        "Questions, custom orders or collaborations? We're always happy to hear from you.",
      ctaLabel: "Contact us",
    },
    imageCaption: "Every handmade piece begins with a conversation.",
    customOrder: {
      title: "Need something unique?",
      subtitle: "We create custom handmade pieces designed especially for you.",
      ctaLabel: "Start Custom Order",
    },
    social: {
      title: "Follow AREVÉ",
    },
    closing: {
      quote: "Handmade with love. Created to be treasured.",
    },
    image: "/images/prod-bag-a.png",
    card1: {
      title: "General Inquiry",
      subtitle: "For general questions and collaborations.",
      emailLabel: "Email Us",
      whatsappLabel: "WhatsApp",
    },
    card2: {
      title: "Direct Ordering",
      subtitle: "The fastest way to custom order or get product advice in real-time.",
      buttonLabel: "CHAT ON WHATSAPP",
    },
    card3: {
      title: "Boutique Feed",
      subtitle: "Follow us on Instagram for new arrivals, daily stories, and custom requests.",
      buttonLabel: "VISIT BOUTIQUE",
    },
    studio: {
      image: "/images/gallery-light-3.png",
      eyebrow: "At the Studio",
      quote: "Each one is a little sun",
    },
  },
} as const;
