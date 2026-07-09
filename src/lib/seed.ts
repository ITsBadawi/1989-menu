import { db } from "./db";
import type { Category, MenuItem, Restaurant } from "../types";

const uid = () => crypto.randomUUID();

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

export async function seedIfEmpty() {
  const count = await db.categories.count();
  if (count > 0) return;

  const now = Date.now();

  const breakfast: Category = {
    id: uid(),
    nameAr: "فطور صباحي",
    nameEn: "Breakfast",
    sortOrder: 0,
    isVisible: true,
    createdAt: now,
  };

  const snacks: Category = {
    id: uid(),
    nameAr: "سناك & بركر",
    nameEn: "Snacks & Burgers",
    sortOrder: 1,
    isVisible: true,
    createdAt: now,
  };

  await db.categories.bulkAdd([breakfast, snacks]);

  const items: MenuItem[] = [
    {
      id: uid(),
      nameAr: "كيمر بالعسل والقيمر",
      nameEn: "Geymar & Honey",
      descriptionAr: "قيمر طازج مع عسل طبيعي وخبز صاج ساخن، فطور عراقي أصيل",
      descriptionEn: "Fresh clotted cream with natural honey & warm saj bread",
      ingredients: ["قيمر", "عسل", "خبز صاج", "جوز"],
      price: 4000,
      categoryId: breakfast.id,
      imageUrl: img("photo-1533089860892-a7c6f0a88666"),
      isAvailable: true,
      isFeatured: true,
      sortOrder: 0,
      createdAt: now,
      rating: 4.8,
      ratingCount: 132,
      viewCount: 540,
    },
    {
      id: uid(),
      nameAr: "بيض عراقي بالطماطة",
      nameEn: "Iraqi Tomato Eggs",
      descriptionAr: "بيض مقلي مع طماطة طازجة وبهارات عراقية أصيلة",
      descriptionEn: "Fried eggs simmered with fresh tomato & Iraqi spices",
      ingredients: ["بيض", "طماطة", "بصل", "بهارات"],
      price: 3500,
      categoryId: breakfast.id,
      imageUrl: img("photo-1525351484163-7529414344d8"),
      isAvailable: true,
      isFeatured: false,
      sortOrder: 1,
      createdAt: now,
      rating: 4.5,
      ratingCount: 88,
      viewCount: 310,
    },
    {
      id: uid(),
      nameAr: "صمون بالجبن والزعتر",
      nameEn: "Samoon Cheese & Zaatar",
      descriptionAr: "صمون ساخن محشو بالجبن الطازج والزعتر البري",
      descriptionEn: "Warm samoon bread stuffed with fresh cheese & wild zaatar",
      ingredients: ["صمون", "جبن", "زعتر", "زيت زيتون"],
      price: 3000,
      categoryId: breakfast.id,
      imageUrl: img("photo-1509440159596-0249088772ff"),
      isAvailable: true,
      isFeatured: false,
      sortOrder: 2,
      createdAt: now,
      rating: 4.3,
      ratingCount: 54,
      viewCount: 210,
    },
    {
      id: uid(),
      nameAr: "شاي عراقي أصيل",
      nameEn: "Iraqi Chai",
      descriptionAr: "شاي أسود مغلي على الطريقة العراقية التقليدية بكاسة استكان",
      descriptionEn: "Traditional Iraqi black tea served in an estikan glass",
      ingredients: ["شاي أسود", "سكر", "هيل"],
      price: 1500,
      categoryId: breakfast.id,
      imageUrl: img("photo-1594631252845-29fc4cc8cde9"),
      isAvailable: true,
      isFeatured: true,
      sortOrder: 3,
      createdAt: now,
      rating: 4.9,
      ratingCount: 201,
      viewCount: 800,
    },
    {
      id: uid(),
      nameAr: "بركر 1989 الخاص",
      nameEn: "1989 Signature Burger",
      descriptionAr: "قطعة لحم بقري مشوية، جبن شيدر، صوص البيت الخاص وخبز بريوش",
      descriptionEn: "Grilled beef patty, cheddar, house special sauce & brioche bun",
      ingredients: ["لحم بقري", "جبن شيدر", "خس", "طماطة", "صوص خاص"],
      price: 7000,
      categoryId: snacks.id,
      imageUrl: img("photo-1568901346375-23c9450c58cd"),
      isAvailable: true,
      isFeatured: true,
      sortOrder: 0,
      createdAt: now,
      rating: 4.9,
      ratingCount: 315,
      viewCount: 1200,
    },
    {
      id: uid(),
      nameAr: "زنجر كرسبي حار",
      nameEn: "Spicy Crispy Zinger",
      descriptionAr: "صدر دجاج مقرمش متبل بالحار الخاص مع صوص الثوم",
      descriptionEn: "Crispy spiced chicken breast with house garlic sauce",
      ingredients: ["دجاج", "بهارات حارة", "صوص ثوم", "خس"],
      price: 6000,
      categoryId: snacks.id,
      imageUrl: img("photo-1606755962773-d324e0a13086"),
      isAvailable: true,
      isFeatured: true,
      sortOrder: 1,
      createdAt: now,
      rating: 4.7,
      ratingCount: 260,
      viewCount: 980,
    },
    {
      id: uid(),
      nameAr: "فرايز مقرمشة",
      nameEn: "Crispy Fries",
      descriptionAr: "بطاطا مقرمشة ذهبية مع بهارات البيت",
      descriptionEn: "Golden crispy fries tossed with house seasoning",
      ingredients: ["بطاطا", "ملح", "بهارات"],
      price: 2500,
      categoryId: snacks.id,
      imageUrl: img("photo-1573080496219-bb080dd4f877"),
      isAvailable: true,
      isFeatured: false,
      sortOrder: 2,
      createdAt: now,
      rating: 4.4,
      ratingCount: 140,
      viewCount: 420,
    },
    {
      id: uid(),
      nameAr: "بركر دبل تشيز",
      nameEn: "Double Cheese Burger",
      descriptionAr: "قطعتين لحم بقري مع طبقتين جبن شيدر ذائب وصوص باربكيو",
      descriptionEn: "Double beef patties, double melted cheddar & BBQ sauce",
      ingredients: ["لحم بقري", "جبن شيدر", "باربكيو", "خبز بريوش"],
      price: 9000,
      categoryId: snacks.id,
      imageUrl: img("photo-1553979459-d2229ba7433b"),
      isAvailable: true,
      isFeatured: false,
      sortOrder: 3,
      createdAt: now,
      rating: 4.6,
      ratingCount: 175,
      viewCount: 610,
    },
  ];

  await db.items.bulkAdd(items);

  const restaurant: Restaurant = {
    id: "main",
    name: "1989",
    logo: "",
    address: "بغداد، شارع الرشيد، العراق",
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13481.0!2d44.361488!3d33.315241!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDE4JzU0LjkiTiA0NMKwMjEnMzYuNSJF!5e0!3m2!1sen!2siq!4v1234567890",
    phones: [
      { number: "+964 770 123 4567", isWhatsapp: true, label: "الرئيسي" },
      { number: "+964 780 987 6543", isWhatsapp: false, label: "التوصيل" },
    ],
    socials: [
      { platform: "instagram", url: "https://instagram.com/1989.iq" },
      { platform: "facebook", url: "https://facebook.com/1989.iq" },
      { platform: "tiktok", url: "https://tiktok.com/@1989.iq" },
    ],
    hours: [
      { day: "الأحد", open: "07:00", close: "23:00", isClosed: false },
      { day: "الإثنين", open: "07:00", close: "23:00", isClosed: false },
      { day: "الثلاثاء", open: "07:00", close: "23:00", isClosed: false },
      { day: "الأربعاء", open: "07:00", close: "23:00", isClosed: false },
      { day: "الخميس", open: "07:00", close: "00:00", isClosed: false },
      { day: "الجمعة", open: "08:00", close: "00:00", isClosed: false },
      { day: "السبت", open: "07:00", close: "23:00", isClosed: false },
    ],
    about:
      "1989 هو وجهتك اليومية للفطور العراقي الأصيل والسناك العصري، حيث يلتقي طعم بغداد بروح برلين الحديثة.",
    aboutEn:
      "1989 is your daily destination for authentic Iraqi breakfast and modern snacks, where the taste of Baghdad meets modern Berlin spirit.",
    seoDescription:
      "1989 مطعم متخصص بالفطور الصباحي والسناك والبركر في العراق - جرب أشهى الأطباق العراقية الأصيلة",
    themeColor: "#c9a227",
    defaultDarkMode: true,
    fontScale: 1,
  };

  await db.restaurant.add(restaurant);
}
