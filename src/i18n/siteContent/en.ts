/** English storefront copy `settings.site_content`; drives the public storefront copy and structure. */
export const SITE_CONTENT_EN = {
  metadata: {
    title: "AREVÉ — Handmade with Warmth and Sunlight",
    description:
      "Discover AREVÉ's handcrafted beaded bags, unique toys, and artisan accessories. Every piece made with love, warmth, and sunlight.",
  },
  announcement: ["100% handmade", "Made in Armenia", "Order via WhatsApp & Telegram"],
  nav: [
    { href: "/products", label: "Shop" },
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
    copyrightSuffix: 'All rights reserved.',
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
      title: "Shop",
      subtitle: "Bags, headpieces, toys and accessories — made entirely by hand.",
    },
    reviews: {
      eyebrow: "Customer Reviews",
      title: "What customers say about AREVÉ",
      subtitle: "Words from people who have already chosen AREVÉ.",
      totalReviewsLabel: "Total Reviews",
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
    hero: {
      eyebrow: "Handmade · Yerevan",
      title: "Bead by bead,",
      titleAccent: "made by hand",
      subtitle:
        "Beaded and crochet bags, headpieces and accessories — crafted entirely by hand in Armenia.",
      primaryCta: { label: "Shop the collection", href: "/products" },
      secondaryCta: { label: "Custom order", href: "/contact" },
    },
    trust: [
      { title: "100% handmade", text: "Every piece is assembled by hand" },
      { title: "Made in Armenia", text: "Created in Yerevan" },
      { title: "Easy ordering", text: "Via WhatsApp or Telegram" },
      { title: "Custom orders", text: "Made especially for you" },
    ],
    categoriesSection: {
      eyebrow: "Categories",
      title: "Find your style",
      allTitle: "Shop all",
      allText: "Every handmade piece in one place",
      countLabel: "items",
    },
    featuredSection: {
      eyebrow: "Favorites",
      title: "Most requested designs",
      viewAllLabel: "Shop all",
    },
    newSection: {
      eyebrow: "New arrivals",
      title: "Latest creations",
      viewAllLabel: "View all",
    },
    storySection: {
      eyebrow: "About AREVÉ",
      title: "Every piece is made by hand",
      paragraphs: [
        "The name AREVÉ comes from arév — the Armenian word for sun. We create beaded and crochet bags, headpieces and accessories with attention to every detail.",
        "Because each piece is made by hand, no two are exactly alike.",
      ],
      points: ["Handmade", "One of a kind", "Quality materials"],
      ctaLabel: "Our story",
      ctaHref: "/about",
    },
    customSection: {
      eyebrow: "Custom orders",
      title: "Looking for something unique?",
      text: "We create custom handmade pieces designed especially for you. Message us and we will talk through your idea together.",
      whatsappLabel: "Message on WhatsApp",
      contactLabel: "Other ways to reach us",
      contactHref: "/contact",
    },
    instagramSection: {
      eyebrow: "Instagram",
      title: "Follow AREVÉ",
      handle: "@areve_collections",
      viewLinkLabel: "Open Instagram",
    },
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
    image: "/images/about-crafting.png",
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
