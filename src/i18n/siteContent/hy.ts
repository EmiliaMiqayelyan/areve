/** Armenian default storefront copy (merged with API `site_content`). */
export const SITE_CONTENT_HY = {
  metadata: {
    title: 'AREVÉ — Ձեռագործ՝ ջերմությամբ և արևի լույսով',
    description:
      'Բացահայտեք AREVÉ-ի ձեռագործ բիջակապարց տոպրակները, եզակի խաղալիքներն ու արհեստավոր աքսեսուարները։ Յուրաքանչյուր կտոր ստեղծված է սիրով, ջերմությամբ և արևի լույսով։',
  },
  nav: [
    { href: '/', label: 'Գլխավոր' },
    { href: '/products', label: 'Ապրանքներ' },
    { href: '/gallery', label: 'Պատկերասրահ' },
    { href: '/about', label: 'Մեր մասին' },
    { href: '/faq', label: 'ՀՏՀ' },
    { href: '/contact', label: 'Կապ' },
  ],
  footer: {
    explore: [
      ['/', 'Գլխավոր'],
      ['/products', 'Ապրանքներ'],
      ['/gallery', 'Պատկերասրահ'],
      ['/about', 'Մեր պատմությունը'],
    ] as [string, string][],
    support: [
      ['/faq', 'ՀՏՀ'],
      ['/contact', 'Կապ մեզ հետ'],
      ['/contact', 'Անհատական պատվերներ'],
      ['/faq', 'Խնամքի ուղեցույց'],
      ['/faq', 'Առաքում'],
    ] as [string, string][],
    copyrightSuffix: 'Բոլոր իրավունքները պաշտպանված են։ Ստեղծված է ☀️-ով և սիրով։',
  },
  productCategoryLabels: {
    all: 'Բոլորը',
    bags: 'Ուլունքագործ պայուսակներ',
    toys: 'Ձեռագործ խաղալիքներ',
    accessories: 'Աքսեսուարներ',
  },
  pages: {
    shop: {
      eyebrow: 'Ձեռագործ հավաքածու',
      title: 'Քո հաջորդ պայուսակը',
      subtitle: 'Ստեղծիր քեզ համար յուրահատուկը',
    },
    reviews: {
      eyebrow: 'Հաճախորդների գնահատականներ',
      title: 'Ինչ են ասում մեր համայնքը',
      subtitle: 'Իսկական խոսքեր իսկական մարդկանցից, ովքեր սիրում են ձեռագործը։',
      avgRating: '5.0',
      avgRatingLabel: 'Միջին գնահատական',
      totalReviewsLabel: 'Գնահատականներ',
      fiveStarValue: '100%',
      fiveStarLabel: '5 աստղանիշ',
      featuredQuote: 'Յուրաքանչյուր կարում զգում ես սերը։ Արժե է յուրաքանչյուր դրամի։',
      featuredAuthor: '— Սոֆի Լորեն, Փարիզ',
    },
    gallery: {
      eyebrow: 'AREVÉ',
      title: 'Ստեղծման\nողջ ճանապարհը',
      subtitle: 'Ստեղծագործություն • Ոճ • Արև',
    },
    faq: {
      eyebrow: '· ՀՏՀ',
      title: 'Հաճախ տրվող հարցեր',
      subtitle: 'Ամեն ինչ, ինչ պետք է իմանաք AREVÉ-ի մասին',
    },
    checkout: {
      title: 'Վճարում',
      subtitle: 'Ավարտեք ձեր պատվերը',
    },
  },
  home: {
    collectionsSection: {
      eyebrow: 'Կատեգորիաներ',
      title: 'Բացահայտիր Arevé-ի աշխարհը',
      subtitle: 'Ձեռագործ հավաքածուներ՝ ստեղծված առանձնանալու համար։',
    },
    hero: {
      image: '/images/hero-light.png',
      eyebrow: 'Նոր հավաքածու · 2026',
      title: 'Ոճ, որը ստեղծում է',
      titleAccent: 'AREVÉ-ն',
      subtitle:
        'Եզակի դիզայն, որակյալ նյութեր և ձեռքի աշխատանք՝ ամեն օրվա և հատուկ պահերի համար',
      trustLine: '100% ձեռագործ • Պատրաստված Հայաստանում',
      badgePrefix: 'Նոր հավաքածու',
      titleLine1: 'Ոճ, որը ստեղծում է',
      titleGold1: 'AREVÉ-ն',
      conjunction: '',
      titleGold2: '',
      stats: [
        { value: '500+', label: 'Ստեղծված կտոր' },
        { value: '200+', label: 'Երջանիկ հաճախորդ' },
        { value: '100%', label: 'Ձեռագործ' },
      ],
      primaryCta: { label: 'Գնել հիմա', href: '/products' },
      secondaryCta: { label: 'Դիտել հավաքածուն', href: '/gallery' },
    },
    featuredSection: {
      eyebrow: 'Ֆավորիտ',
      title: 'Ամենապահանջված մոդելները',
      viewAllLabel: 'Բոլոր ապրանքները',
    },
    storySection: {
      image: '/images/about-light.png',
      floatingStatValue: '40+',
      floatingStatLabel: 'ժամ մեկ տոպրակի',
      eyebrow: 'AREVÉ',
      titleLine1: 'Ստեղծված է',
      titleItalic: 'քեզ համար',
      titleLine2: '',
      paragraphs: [
        'Մենք ստեղծում ենք ձեռագործ պայուսակներ, որոնք համադրում են ոճը, որակն ու անհատականությունը։',
        'AREVÉ — ստեղծված՝ առանձնանալու համար',
      ],
      pillars: [
        { icon: '✦', label: 'Ձեռագործ' },
        { icon: '☀️', label: 'Եզակի' },
        { icon: '♡', label: 'Որակ' },
      ],
      ctaLabel: 'Իմանալ ավելին',
      ctaHref: '/about',
    },
    testimonialsSection: {
      eyebrow: 'Գնահատականներ',
      title: 'Հաճախորդների կարծիքները',
      subtitle: 'Ինչ են ասում նրանք, ովքեր արդեն ընտրել են AREVÉ-ն',
      readAllLabel: 'Բոլոր կարծիքները',
    },
    instagramSection: {
      eyebrow: '@areve.handmade',
      title: 'Հետևիր մեզ',
      subtitle: '',
      viewLinkLabel: 'Instagram →',
    },
    ctaSection: {
      emoji: '☀️',
      titleLine1: 'Դարձրու այն',
      titleItalic: 'եզակի',
      paragraph: 'Անհատական պատվերներ՝ ստեղծված հենց քեզ համար',
      buttonLabel: 'Պատվիրել',
      buttonHref: '/contact',
    },
    collectionCards: [
      {
        title: 'Ուլունքագործ պայուսակներ',
        img: '/images/prod-bag-a.png',
        href: '/products?category=bags',
      },
      {
        title: 'Ձեռագործ խաղալիքներ',
        img: '/images/prod-toy-a.png',
        href: '/products?category=toys',
      },
      {
        title: 'Աքսեսուարներ',
        img: '/images/prod-acc-a.png',
        href: '/products?category=accessories',
      },
    ],
  },
  about: {
    hero: {
      emoji: '☀️',
      eyebrow: 'AREVÉ · արև',
      titleLine1: 'Ստեղծված է',
      titleItalic: 'արևից',
      intro: 'Ստեղծված Հայաստանում',
    },
    beginning: {
      eyebrow: 'Սկիզբ',
      title: 'AREVÉ',
      paragraphs: [
        'AREVÉ անունը գալիս է «արև» բառից՝ լույսի գաղափարից, որը ընդգծում է գեղեցկությունը։',
        'Այսօր մենք ստեղծում ենք ձեռագործ պայուսակներ և աքսեսուարներ՝ պարզ դիզայնով և բարձր որակով։',
      ],
      image: '/images/about-light.png',
    },
    values: {
      eyebrow: 'Ինչ ենք հավատում',
      title: 'Մեր արժեքները',
      subtitle: 'Սկզբունքները, որոնք կանգնած են յուրաքանչյուր կտորի հիմքում։',
      items: [
        {
          icon: '✦',
          bg: '#C7D3C0',
          title: 'Ձեռագործ',
          desc: 'Յուրաքանչյուր իր ամբողջությամբ ստեղծված է ձեռքով։ Առանց մեքենաների, առանց կարճուղիների — միայն համբերատար ձեռքեր։',
        },
        {
          icon: '☀️',
          bg: '#E6C97A',
          title: 'Եզակի',
          desc: 'Քանի որ ամեն կտոր ձեռքով է, երկու նույնական չկան։ Դուք կրում եք իսկական եզակիություն։',
        },
        {
          icon: '♡',
          bg: '#E8CFCB',
          title: 'Բարձր որակ',
          desc: 'Մենք ընտրում ենք լավագույն բիջերը, բնական գործվածքներն ու նյութերը։ Ավելի փոքր բանի վրա մեր անունը չենք դնի։',
        },
        {
          icon: '🌿',
          bg: '#EDE6DF',
          title: 'Կայուն',
          desc: 'Բնական նյութեր, փոքր խմբաքանակներ, զրոյական աղտոտ փաթեթավորում։ Գեղեցիկը չպետք է վնասի մոլորակին։',
        },
      ],
    },
    process: {
      eyebrow: 'Ինչպես ենք աշխատում',
      title: 'Կուլիսներից',
      subtitle: 'Առաջին նախագծից մինչև ձեր ձեռքերը — AREVÉ-ի յուրաքանչյուր կտորի ճանապարհը։',
      steps: [
        {
          n: '01',
          title: 'Գաղափար և երազանք',
          desc: 'Յուրաքանչյուր հավաքածու սկսվում է նախագծից և զգացմունքից — առավոտյան լույսում տեսնված գույն, հին գործվածքի նախշ։',
        },
        {
          n: '02',
          title: 'Նյութերի ընտրություն',
          desc: 'Յուրաքանչյուր բիջ, գործվածք և նյութ ընտրվում է ձեռքով։ Որակը նախ զգացվում է, հետո տեսնվում։',
        },
        {
          n: '03',
          title: 'Բիջ առ բիջ',
          desc: 'Յուրաքանչյուր բիջ դրվում է մտադրությամբ։ Մեկ տոպրակը կարող է պահանջել 40+ ժամ համբերատար աշխատանք։',
        },
        {
          n: '04',
          title: 'Վերջնական սեր',
          desc: 'Ուղարկելուց առաջ յուրաքանչյուր կտոր ստուգվում, սիրով փաթեթավորվում և ուղեկցվում փոքրիկ նամակով։',
        },
      ],
    },
    bannerImages: ['/images/gallery-light-3.png', '/images/gallery-light-4.png', '/images/gallery-light-1.png'],
    closing: {
      title: 'Շարունակիր փնտրել քոնը',
      subtitle: 'Դիտեք մեր ձեռագործ հավաքածուները — յուրաքանչյուրը սպասում է',
      ctaLabel: 'Գնել հավաքածուից',
      ctaHref: '/products',
    },
  },
  contact: {
    hero: {
      eyebrow: 'ԿԱՊ',
      title: 'Եկեք ստեղծենք միասին',
      subtitle:
        'Հարցեր, անհատական պատվերներ կամ համագործակցություն։ Մենք միշտ ուրախ ենք լսել ձեզ։',
      ctaLabel: 'Կապվել մեզ հետ',
    },
    imageCaption: 'Յուրաքանչյուր ձեռագործ կտոր սկսվում է զրույցից։',
    customOrder: {
      title: 'Ցանկանու՞մ եք ինչ-որ յուրահատուկ',
      subtitle: 'Մենք ստեղծում ենք անհատական ձեռագործ կտորներ՝ հատուկ ձեզ համար։',
      ctaLabel: 'Սկսել անհատական պատվեր',
    },
    social: {
      title: 'Հետևեք AREVÉ-ին',
    },
    closing: {
      quote: 'Ձեռագործ սիրով։ Ստեղծված հոգավորության համար։',
    },
    image: '/images/prod-bag-a.png',
    card1: {
      title: 'Ընդհանուր հարց',
      subtitle: 'Ընդհանուր հարցերի և համագործակցության համար։',
      emailLabel: 'Գրեք մեզ',
      whatsappLabel: 'WhatsApp',
    },
    card2: {
      title: 'Ուղղակի պատվեր',
      subtitle: 'Ամենաարագ ճանապարհը անհատական պատվերի կամ խորհրդատվության համար։',
      buttonLabel: 'ԶՐՈՒՅՑ WHATSAPP-ՈՎ',
    },
    card3: {
      title: 'Բուտիկի լրահոս',
      subtitle: 'Հետևեք Instagram-ում՝ նորությունների, պատմությունների և պատվերների համար։',
      buttonLabel: 'ԱՅՑԵԼ ԲՈՒՏԻԿ',
    },
    studio: {
      image: '/images/gallery-light-3.png',
      eyebrow: 'Արհեստանոցում',
      quote: 'Յուրաքանչյուրը փոքրիկ արև է',
    },
  },
} as const;
