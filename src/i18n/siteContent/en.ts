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
    { href: "/reviews", label: "Reviews" },
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "Contact" },
  ],
  footer: {
    explore: [
      ["/", "Home"],
      ["/products", "Products"],
      ["/gallery", "Gallery"],
      ["/about", "Our Story"],
      ["/reviews", "Reviews"],
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
      eyebrow: "Shop AREVÉ",
      title: "Our Collection",
      subtitle: "Every piece is handmade — no two are exactly the same. Find what speaks to you.",
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
      eyebrow: "Visual Stories",
      title: "The Gallery",
      subtitle: "A window into the world of AREVÉ — products, process, and the beauty of handmade.",
    },
    faq: {
      eyebrow: "Help Center",
      title: "Frequently Asked Questions",
      subtitle: "Everything you need to know about AREVÉ — answered with care.",
    },
    checkout: {
      title: "Checkout",
      subtitle: "Complete your order",
    },
  },
  home: {
    collectionsSection: {
      eyebrow: "Our Collections",
      title: "Made for Every Moment",
      subtitle:
        "Three collections, one soul — each crafted with the same dedication to beauty and authenticity.",
    },
    hero: {
      image: "/images/hero-light.png",
      badgePrefix: "New Collection",
      titleLine1: "Handmade with",
      titleGold1: "warmth",
      conjunction: "&",
      titleGold2: "sunlight",
      subtitle:
        "Each piece from AREVÉ carries the warmth of hands that care — beaded bags, heartfelt toys, and accessories that tell your story.",
      stats: [
        { value: "500+", label: "Pieces Crafted" },
        { value: "200+", label: "Happy Clients" },
        { value: "100%", label: "Handmade" },
      ],
      primaryCta: { label: "Shop Now", href: "/products" },
      secondaryCta: { label: "Explore Collection", href: "/gallery" },
    },
    featuredSection: {
      eyebrow: "Featured",
      title: "New Collection",
      viewAllLabel: "View All",
    },
    storySection: {
      image: "/images/about-light.png",
      floatingStatValue: "40+",
      floatingStatLabel: "Hours per bag",
      eyebrow: "Our Story",
      titleLine1: "Born from",
      titleItalic: "passion,",
      titleLine2: "made with hands",
      paragraphs: [
        "AREVÉ was born from a deep love of handcraft and the belief that everyday objects can carry extraordinary meaning. Every bead we place is an act of love.",
        "Our name reflects sunlight — the warmth of creation. We pour that warmth into each piece so you can carry it with you.",
      ],
      pillars: [
        { icon: "✦", label: "Handmade" },
        { icon: "☀️", label: "Unique" },
        { icon: "♡", label: "Quality" },
      ],
      ctaLabel: "Read Our Story",
      ctaHref: "/about",
    },
    testimonialsSection: {
      eyebrow: "Testimonials",
      title: "Words from Hearts",
      subtitle: "The most meaningful reward is knowing our pieces bring joy.",
      readAllLabel: "Read All Reviews",
    },
    instagramSection: {
      eyebrow: "@areve.handmade",
      title: "Follow Our Journey",
      subtitle: "Behind the scenes, new arrivals, and stories from our community.",
      viewLinkLabel: "View on Instagram →",
    },
    ctaSection: {
      emoji: "☀️",
      titleLine1: "Want something",
      titleItalic: "uniquely yours?",
      paragraph:
        "We accept custom orders — your colors, your vision, our hands. Let's create something together.",
      buttonLabel: "Request Custom Order",
      buttonHref: "/contact",
    },
    collectionCards: [
      {
        title: "Beaded Bags",
        desc: "Each bag is a wearable artwork — beaded by hand, one stitch at a time.",
        img: "/images/prod-bag-a.png",
        href: "/products?category=bags",
      },
      {
        title: "Handmade Toys",
        desc: "Soft, safe, and full of soul — toys that become treasured companions.",
        img: "/images/prod-toy-a.png",
        href: "/products?category=toys",
      },
      {
        title: "Accessories",
        desc: "From morning to evening — our accessories add a golden touch to every look.",
        img: "/images/prod-acc-a.png",
        href: "/products?category=accessories",
      },
    ],
  },
  about: {
    hero: {
      emoji: "☀️",
      eyebrow: "Our Story",
      titleLine1: "Made from the",
      titleItalic: "heart",
      intro:
        "AREVÉ is more than a brand. It is a love letter to the art of making things by hand — slowly, intentionally, beautifully.",
    },
    beginning: {
      eyebrow: "The Beginning",
      title: "A story told in beads",
      paragraphs: [
        "AREVÉ started on a small table by a window, with a bowl of beads and an afternoon of sunlight. What began as a personal obsession with handcraft grew into something shared.",
        "The name AREVÉ comes from the Armenian word for sun — arév — because sunlight transforms ordinary things into something luminous.",
        "Today we create pieces designed to be cherished, not consumed. Every piece has a story, and when you carry it, that story becomes yours.",
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
          bg: "#D6C3B3",
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
      title: "Ready to find your piece?",
      subtitle: "Explore our handmade collection — each one waiting for the right person.",
      ctaLabel: "Shop the Collection",
      ctaHref: "/products",
    },
  },
  contact: {
    hero: {
      eyebrow: "Get in Touch",
      title: "We'd Love to Hear from You",
      subtitle: "Connect with us directly for custom orders, product advice, or just to say hello.",
    },
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
      quote: "Every piece is a tiny sun — made with warmth & sunlight.",
    },
  },
} as const;
