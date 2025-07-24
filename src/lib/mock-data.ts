
import type { Product, Manager, Shop } from './types';

// Deterministic pseudo-random number generator
const seededRandom = (seedStr: string) => {
  let seed = 0;
  for (let i = 0; i < seedStr.length; i++) {
    seed = (seed + seedStr.charCodeAt(i)) % 10000;
  }
  return () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
};

function generatePriceHistory(basePrice: number, days: number, sku: string): { date: string, price: number }[] {
  const history = [];
  let price = basePrice;
  const random = seededRandom(sku);

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    price += (random() - 0.5) * (basePrice * 0.05); // smaller fluctuation
    if (i % 30 === 0 && i > 0 && days > 60) {
      price *= (0.9 + random() * 0.05); // pseudo-seasonal drop
    }
    if (i % 15 === 0 && days > 30) {
      price *= (1.02 + random() * 0.01); // pseudo-seasonal rise
    }
    history.push({
      date: date.toISOString().split('T')[0],
      price: Math.max(10, parseFloat(price.toFixed(2))), // ensure price doesn't drop too low
    });
  }
  return history;
}

export const shops: Shop[] = [
  { id: 'shop-1', name: 'Основной магазин' },
  { id: 'shop-2', name: 'Филиал "Север"' },
];

export const managers: Manager[] = [
  { id: 'manager-1', name: 'Анна Иванова', avatarUrl: 'https://placehold.co/40x40.png', shopId: 'shop-1' },
  { id: 'manager-2', name: 'Петр Петров', avatarUrl: 'https://placehold.co/40x40.png', shopId: 'shop-1' },
  { id: 'manager-3', name: 'Мария Сидорова', avatarUrl: 'https://placehold.co/40x40.png', shopId: 'shop-2' },
  { id: 'manager-4', name: 'Игорь Васильев', avatarUrl: 'https://placehold.co/40x40.png', shopId: 'shop-2' },
  { id: 'manager-5', name: 'Елена Смирнова', avatarUrl: 'https://placehold.co/40x40.png', shopId: 'shop-1' },
  { id: 'manager-6', name: 'Дмитрий Кузнецов', avatarUrl: 'https://placehold.co/40x40.png', shopId: 'shop-2' },
];

const allProductsData: Omit<Product, 'priceHistory' | 'shopId' | 'marketplace' | 'currentPrice' | 'competitorSkus'>[] = [
  {
    id: 'B08H93ZRK9',
    name: 'Echo Dot (4-го поколения)',
    imageUrl: 'https://placehold.co/100x100.png',
    managerId: 'manager-1',
    rating: 4.7,
    reviews: 782341,
    features: ['Умная колонка', 'С поддержкой Alexa', 'Цвет древесного угля', 'Компактный дизайн'],
    notifications: 2,
  },
  {
    id: 'B08P2H5L7G',
    name: 'Google Nest Hub (2-го поколения)',
    imageUrl: 'https://placehold.co/100x100.png',
    managerId: 'manager-1',
    rating: 4.6,
    reviews: 12543,
    features: ['Умный дисплей', 'Google Ассистент', 'Цвет «мел»', 'Анализ сна'],
    notifications: 0,
  },
  {
    id: 'B09B8V2T6C',
    name: 'Sony WH-1000XM5',
    imageUrl: 'https://placehold.co/100x100.png',
    managerId: 'manager-2',
    rating: 4.8,
    reviews: 15234,
    features: ['Шумоподавление', '30 часов работы', 'Hi-Res Audio', 'Multipoint'],
    notifications: 1,
  },
  {
    id: 'B09J29QDP9',
    name: 'Apple HomePod mini',
    imageUrl: 'https://placehold.co/100x100.png',
    managerId: null, // Unassigned
    rating: 4.8,
    reviews: 45678,
    features: ['360-градусный звук', 'Интеграция с Siri', 'Цвет «серый космос»', 'Интерком'],
    notifications: 0,
  },
  {
    id: 'B07Y2P3Y9W',
    name: 'Sonos One (Gen 2)',
    imageUrl: 'https://placehold.co/100x100.png',
    managerId: 'manager-2',
    rating: 4.7,
    reviews: 23456,
    features: ['Голосовое управление', 'Насыщенный звук', 'Влагостойкий', 'Apple AirPlay 2'],
    notifications: 5,
  },
  {
    id: 'B07XJ8C8F7',
    name: 'Bose Home Speaker 500',
    imageUrl: 'https://placehold.co/100x100.png',
    managerId: 'manager-4',
    rating: 4.5,
    reviews: 15987,
    features: ['Стереозвук', 'Встроенный Alexa', 'ЖК-дисплей', 'Bluetooth'],
    notifications: 0,
  },
  {
    id: 'B08F26C7R1',
    name: 'Amazon Echo Show 10 (3rd Gen)',
    imageUrl: 'https://placehold.co/100x100.png',
    managerId: 'manager-5',
    rating: 4.7,
    reviews: 32109,
    features: ['HD-дисплей', 'Движение', 'Alexa', 'Камера 13 Мп'],
    notifications: 1,
  },
   {
    id: 'B0C1J3V6P4',
    name: 'Anker Soundcore Liberty 4',
    imageUrl: 'https://placehold.co/100x100.png',
    managerId: 'manager-3',
    rating: 4.5,
    reviews: 9876,
    features: ['ANC', 'Hi-Res Wireless', 'Мониторинг ЧСС', 'Пространственный звук'],
    notifications: 3,
  },
  {
    id: 'B08L5C81X6',
    name: 'Kindle Paperwhite (11th Gen)',
    imageUrl: 'https://placehold.co/100x100.png',
    managerId: 'manager-5',
    rating: 4.8,
    reviews: 150234,
    features: ['Экран 6.8"', 'Регулируемая подсветка', 'Водонепроницаемый', 'Недели работы от батареи'],
    notifications: 0,
  },
  {
    id: 'B07VGRJDFY',
    name: 'Fire TV Stick 4K Max',
    imageUrl: 'https://placehold.co/100x100.png',
    managerId: 'manager-1',
    rating: 4.7,
    reviews: 540987,
    features: ['Wi-Fi 6', 'Dolby Vision', 'Alexa Voice Remote', '4K Ultra HD'],
    notifications: 0,
  },
  {
    id: 'B09G96W65H',
    name: 'Apple AirPods (3rd Generation)',
    imageUrl: 'https://placehold.co/100x100.png',
    managerId: 'manager-6',
    rating: 4.6,
    reviews: 89012,
    features: ['Spatial Audio', 'Adaptive EQ', 'Защита от пота и воды', 'Быстрое подключение'],
    notifications: 1,
  },
  {
    id: 'B08WF83B47',
    name: 'Samsung Galaxy SmartTag+',
    imageUrl: 'https://placehold.co/100x100.png',
    managerId: null, // Unassigned
    rating: 4.5,
    reviews: 12345,
    features: ['Bluetooth', 'AR Finding', 'UWB', 'Водостойкий'],
    notifications: 0,
  },
  {
    id: 'B08C4K3R22',
    name: 'Roku Ultra 2020',
    imageUrl: 'https://placehold.co/100x100.png',
    managerId: 'manager-3',
    rating: 4.7,
    reviews: 23456,
    features: ['4K/HDR/Dolby Vision', 'Bluetooth streaming', 'Ethernet port', 'Голосовой пульт'],
    notifications: 4,
  },
  {
    id: 'B09N3ZN55B',
    name: 'JBL Flip 6',
    imageUrl: 'https://placehold.co/100x100.png',
    managerId: 'manager-4',
    rating: 4.8,
    reviews: 11223,
    features: ['Водонепроницаемая', '12 часов работы', 'PartyBoost', 'Смелый дизайн'],
    notifications: 0,
  },
  {
    id: 'B09M6YQY34',
    name: 'Logitech MX Master 3S',
    imageUrl: 'https://placehold.co/100x100.png',
    managerId: 'manager-6',
    rating: 4.7,
    reviews: 18901,
    features: ['8K DPI сенсор', 'Тихие клики', 'MagSpeed скроллинг', 'Multi-device'],
    notifications: 0,
  },
];

const competitorProducts: Omit<Product, 'priceHistory' | 'shopId' | 'managerId' | 'notifications' | 'currentPrice' | 'competitorSkus'>[] = [
    {
        id: 'COMP-GGL-NEST-A',
        name: 'Google Nest Audio',
        imageUrl: 'https://placehold.co/100x100.png',
        marketplace: 'Competitor A',
        rating: 4.6,
        reviews: 25890,
        features: ['Умная колонка', 'Google Ассистент', 'Отличное качество звука'],
    },
    {
        id: 'COMP-BOSE-QC-45',
        name: 'Bose QuietComfort 45',
        imageUrl: 'https://placehold.co/100x100.png',
        marketplace: 'Competitor B',
        rating: 4.7,
        reviews: 19870,
        features: ['Шумоподавление', '24 часа работы', 'Режим Aware'],
    },
    {
        id: 'COMP-ANKR-LBT-NC',
        name: 'Anker Soundcore Liberty NC',
        imageUrl: 'https://placehold.co/100x100.png',
        marketplace: 'Competitor C',
        rating: 4.4,
        reviews: 5432,
        features: ['ANC', 'Hi-Res', 'Беспроводная зарядка'],
    },
    {
        id: 'COMP-KOBO-LIBRA',
        name: 'Kobo Libra 2',
        imageUrl: 'https://placehold.co/100x100.png',
        marketplace: 'Competitor A',
        rating: 4.7,
        reviews: 8912,
        features: ['Экран 7"', 'Водонепроницаемый', 'ComfortLight PRO', 'Физические кнопки'],
    },
    {
        id: 'COMP-SONY-XB910N',
        name: 'Sony WH-XB910N',
        imageUrl: 'https://placehold.co/100x100.png',
        marketplace: 'Competitor B',
        rating: 4.6,
        reviews: 12094,
        features: ['Шумоподавление', 'EXTRA BASS', '30 часов работы', 'Multipoint'],
    },
    {
        id: 'COMP-BEATS-FIT-PRO',
        name: 'Beats Fit Pro',
        imageUrl: 'https://placehold.co/100x100.png',
        marketplace: 'Competitor D',
        rating: 4.5,
        reviews: 21345,
        features: ['ANC', 'Spatial Audio', 'Чип Apple H1', 'Надежная посадка'],
    },
    {
        id: 'COMP-TILE-PRO',
        name: 'Tile Pro (2022)',
        imageUrl: 'https://placehold.co/100x100.png',
        marketplace: 'Competitor C',
        rating: 4.6,
        reviews: 18765,
        features: ['Bluetooth', 'Дальность 400 футов', 'Сменная батарея', 'Громкий звонок'],
    },
    {
        id: 'COMP-UE-BOOM-3',
        name: 'Ultimate Ears BOOM 3',
        imageUrl: 'https://placehold.co/100x100.png',
        marketplace: 'Competitor A',
        rating: 4.7,
        reviews: 35091,
        features: ['360-градусный звук', 'Водонепроницаемая', '15 часов работы', 'Кнопка Magic'],
    },
    {
        id: 'COMP-LOGI-MX-ANYWHERE-3',
        name: 'Logitech MX Anywhere 3S',
        imageUrl: 'https://placehold.co/100x100.png',
        marketplace: 'Competitor B',
        rating: 4.7,
        reviews: 11234,
        features: ['Компактная', '8K DPI', 'MagSpeed скроллинг', 'Multi-device'],
    },
    {
        id: 'COMP-RAZER-DEATHADDER-V3',
        name: 'Razer DeathAdder V3 Pro',
        imageUrl: 'https://placehold.co/100x100.png',
        marketplace: 'Competitor E',
        rating: 4.8,
        reviews: 9876,
        features: ['Сверхлегкая', '30K DPI', 'Беспроводная HyperSpeed', 'Эргономичный дизайн'],
    },
    {
        id: 'COMP-CHROMECAST-GTV',
        name: 'Chromecast with Google TV 4K',
        imageUrl: 'https://placehold.co/100x100.png',
        marketplace: 'Competitor A',
        rating: 4.7,
        reviews: 123456,
        features: ['4K HDR', 'Google TV', 'Голосовой пульт', 'Персональные рекомендации'],
    },
    {
        id: 'COMP-NVIDIA-SHIELD-PRO',
        name: 'NVIDIA SHIELD Android TV Pro',
        imageUrl: 'https://placehold.co/100x100.png',
        marketplace: 'Competitor E',
        rating: 4.8,
        reviews: 45678,
        features: ['AI Upscaling', 'Dolby Vision/Atmos', 'GeForce NOW', 'Tegra X1+'],
    },
];

const basePrices: { [key: string]: number } = {
  'B08H93ZRK9': 49.99,
  'B08P2H5L7G': 99.99,
  'B09B8V2T6C': 399.99,
  'B09J29QDP9': 99.00,
  'B07Y2P3Y9W': 219.00,
  'B07XJ8C8F7': 299.00,
  'B08F26C7R1': 249.99,
  'B0C1J3V6P4': 129.99,
  'B08L5C81X6': 139.99,
  'B07VGRJDFY': 54.99,
  'B09G96W65H': 179.00,
  'B08WF83B47': 34.99,
  'B08C4K3R22': 99.99,
  'B09N3ZN55B': 129.95,
  'B09M6YQY34': 99.99,
  'COMP-GGL-NEST-A': 99.99,
  'COMP-BOSE-QC-45': 329.00,
  'COMP-ANKR-LBT-NC': 99.99,
  'COMP-KOBO-LIBRA': 169.99,
  'COMP-SONY-XB910N': 249.99,
  'COMP-BEATS-FIT-PRO': 199.99,
  'COMP-TILE-PRO': 34.99,
  'COMP-UE-BOOM-3': 149.99,
  'COMP-LOGI-MX-ANYWHERE-3': 79.99,
  'COMP-RAZER-DEATHADDER-V3': 149.99,
  'COMP-CHROMECAST-GTV': 49.99,
  'COMP-NVIDIA-SHIELD-PRO': 199.99,
};

const productMarketplaces: { [key: string]: { shopId: string, marketplace: string } } = {
    'B08H93ZRK9': { shopId: 'shop-1', marketplace: 'Наш магазин' },
    'B08P2H5L7G': { shopId: 'shop-1', marketplace: 'Наш магазин' },
    'B09B8V2T6C': { shopId: 'shop-1', marketplace: 'Наш магазин' },
    'B09J29QDP9': { shopId: 'shop-2', marketplace: 'Филиал "Север"' },
    'B07Y2P3Y9W': { shopId: 'shop-1', marketplace: 'Наш магазин' },
    'B07XJ8C8F7': { shopId: 'shop-2', marketplace: 'Филиал "Север"' },
    'B08F26C7R1': { shopId: 'shop-1', marketplace: 'Наш магазин' },
    'B0C1J3V6P4': { shopId: 'shop-2', marketplace: 'Филиал "Север"' },
    'B08L5C81X6': { shopId: 'shop-1', marketplace: 'Наш магазин' },
    'B07VGRJDFY': { shopId: 'shop-1', marketplace: 'Наш магазин' },
    'B09G96W65H': { shopId: 'shop-2', marketplace: 'Филиал "Север"' },
    'B08WF83B47': { shopId: 'shop-1', marketplace: 'Наш магазин' },
    'B08C4K3R22': { shopId: 'shop-2', marketplace: 'Филиал "Север"' },
    'B09N3ZN55B': { shopId: 'shop-2', marketplace: 'Филиал "Север"' },
    'B09M6YQY34': { shopId: 'shop-1', marketplace: 'Наш магазин' },
};

const productCompetitors: { [key: string]: string[] } = {
    'B08H93ZRK9': ['COMP-GGL-NEST-A'],
    'B08P2H5L7G': ['COMP-GGL-NEST-A'],
    'B09B8V2T6C': ['COMP-BOSE-QC-45', 'COMP-SONY-XB910N'],
    'B09J29QDP9': ['COMP-GGL-NEST-A', 'B07Y2P3Y9W'],
    'B07Y2P3Y9W': ['COMP-GGL-NEST-A', 'COMP-UE-BOOM-3', 'B07XJ8C8F7'],
    'B07XJ8C8F7': ['COMP-GGL-NEST-A', 'COMP-UE-BOOM-3', 'B07Y2P3Y9W'],
    'B08F26C7R1': ['COMP-GGL-NEST-A', 'B08P2H5L7G'],
    'B0C1J3V6P4': ['COMP-ANKR-LBT-NC', 'COMP-BEATS-FIT-PRO', 'B09G96W65H'],
    'B08L5C81X6': ['COMP-KOBO-LIBRA'],
    'B07VGRJDFY': ['B08C4K3R22', 'COMP-CHROMECAST-GTV'],
    'B09G96W65H': ['COMP-ANKR-LBT-NC', 'COMP-BEATS-FIT-PRO'],
    'B08WF83B47': ['COMP-TILE-PRO'],
    'B08C4K3R22': ['B07VGRJDFY', 'COMP-CHROMECAST-GTV', 'COMP-NVIDIA-SHIELD-PRO'],
    'B09N3ZN55B': ['COMP-UE-BOOM-3'],
    'B09M6YQY34': ['COMP-LOGI-MX-ANYWHERE-3', 'COMP-RAZER-DEATHADDER-V3'],
};

// Combine all product data into a single source of truth
export const allAvailableProducts: Product[] = [
    ...allProductsData.map(p => {
        const marketInfo = productMarketplaces[p.id];
        const priceHistory = generatePriceHistory(basePrices[p.id] || 100, 365, p.id);
        const currentPrice = priceHistory[priceHistory.length - 1].price;
        return {
            ...p,
            shopId: marketInfo.shopId,
            marketplace: marketInfo.marketplace,
            priceHistory,
            currentPrice,
            competitorSkus: productCompetitors[p.id] || [],
        }
    }),
    ...competitorProducts.map(p => {
        const priceHistory = generatePriceHistory((basePrices[p.id] || 150) * 1.1, 365, p.id);
        const currentPrice = priceHistory[priceHistory.length - 1].price;
        return {
            ...p,
            id: p.id,
            shopId: 'competitor',
            managerId: null,
            notifications: 0,
            priceHistory,
            currentPrice,
            competitorSkus: [],
        }
    })
];

export const managedProducts: Product[] = allAvailableProducts.filter(p => p.shopId !== 'competitor');

    

    