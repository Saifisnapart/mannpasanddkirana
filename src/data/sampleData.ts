import { Vendor, Product, VendorListing, Order, Address } from '@/types';

export const vendors: Vendor[] = [
  {
    id: 'v1', slug: 'freshmart-pimpri', name: 'FreshMart Pimpri', type: 'grocery',
    rating: 4.4, reviewCount: 312, locality: 'Pimpri', pincode: '411018',
    deliveryEstimate: '35 min', deliveryMinutes: 35, isOpen: true,
    minOrder: 99, description: 'Your neighborhood fresh grocery store with daily deliveries.',
    categories: ['Dairy', 'Staples', 'Snacks', 'Beverages', 'Cleaning', 'Fruits', 'Vegetables'],
    lat: 18.6298, lng: 73.7997, image: '🏪',
  },
  {
    id: 'v2', slug: 'mannan-provisions', name: 'Mannan Provisions', type: 'grocery',
    rating: 4.2, reviewCount: 189, locality: 'Chinchwad', pincode: '411019',
    deliveryEstimate: '40 min', deliveryMinutes: 40, isOpen: true,
    minOrder: 149, description: 'Trusted provisions store serving Chinchwad for 15+ years.',
    categories: ['Dairy', 'Staples', 'Oils', 'Cleaning', 'Personal Care', 'Beverages'],
    lat: 18.6186, lng: 73.8037, image: '🏬',
  },
  {
    id: 'v3', slug: 'dailyneeds-store', name: 'DailyNeeds Store', type: 'grocery',
    rating: 4.6, reviewCount: 478, locality: 'Wakad', pincode: '411057',
    deliveryEstimate: '30 min', deliveryMinutes: 30, isOpen: true,
    minOrder: 199, description: 'Premium quality groceries delivered fast to your doorstep.',
    categories: ['Dairy', 'Staples', 'Fruits', 'Vegetables', 'Snacks', 'Beverages', 'Cleaning'],
    lat: 18.5978, lng: 73.7644, image: '🛒',
  },
  {
    id: 'v4', slug: 'budget-basket', name: 'Budget Basket', type: 'grocery',
    rating: 4.0, reviewCount: 95, locality: 'Nigdi', pincode: '411044',
    deliveryEstimate: '45 min', deliveryMinutes: 45, isOpen: true,
    minOrder: 49, description: 'Best prices on daily essentials. Save more every day!',
    categories: ['Dairy', 'Staples', 'Cleaning', 'Snacks', 'Fruits', 'Vegetables', 'Personal Care'],
    lat: 18.6573, lng: 73.7604, image: '🧺',
  },
  {
    id: 'v5', slug: 'quality-foods', name: 'Quality Foods', type: 'grocery',
    rating: 4.3, reviewCount: 234, locality: 'Aundh', pincode: '411007',
    deliveryEstimate: '25 min', deliveryMinutes: 25, isOpen: true,
    minOrder: 149, description: 'Curated selection of premium groceries and gourmet items.',
    categories: ['Dairy', 'Staples', 'Gourmet', 'Beverages', 'Snacks', 'Oils'],
    lat: 18.5593, lng: 73.8078, image: '🏪',
  },
  {
    id: 'v6', slug: 'pure-goashth', name: 'Pure Goashth Ltd', type: 'meat',
    rating: 4.8, reviewCount: 156, locality: 'Pimpri', pincode: '411018',
    deliveryEstimate: '22 min', deliveryMinutes: 22, isOpen: true,
    minOrder: 199, description: 'Premium quality fresh meat. Halal certified.',
    categories: ['Meat'],
    lat: 18.6250, lng: 73.8050, image: '🥩',
  },
  {
    id: 'v7', slug: 'juicy-meats', name: 'Juicy Meats', type: 'meat',
    rating: 4.6, reviewCount: 203, locality: 'Chinchwad', pincode: '411019',
    deliveryEstimate: '24 min', deliveryMinutes: 24, isOpen: true,
    minOrder: 149, description: 'Fresh chicken and mutton daily. Farm to table.',
    categories: ['Meat'],
    lat: 18.6210, lng: 73.7990, image: '🍗',
  },
];

export const products: Product[] = [
  // Dairy
  { id: 'p1', name: 'Curd', brand: 'Amul', category: 'Dairy', image: '🥛', searchTerms: ['curd', 'dahi', 'yogurt'], description: 'Fresh and creamy curd', unit: '400g', isActive: true },
  { id: 'p2', name: 'Curd', brand: 'Chitale', category: 'Dairy', image: '🥛', searchTerms: ['curd', 'dahi', 'yogurt'], description: 'Traditional Chitale curd', unit: '500g', isActive: true },
  { id: 'p3', name: 'Curd', brand: 'Nestle', category: 'Dairy', image: '🥛', searchTerms: ['curd', 'dahi', 'yogurt'], description: 'Nestle fresh curd', unit: '400g', isActive: true },
  { id: 'p4', name: 'Milk', brand: 'Amul', category: 'Dairy', image: '🥛', searchTerms: ['milk', 'dudh'], description: 'Amul Gold full cream milk', unit: '500ml', isActive: true },
  { id: 'p5', name: 'Milk', brand: 'Chitale', category: 'Dairy', image: '🥛', searchTerms: ['milk', 'dudh'], description: 'Chitale full cream milk', unit: '500ml', isActive: true },
  { id: 'p6', name: 'Milk 1L', brand: 'Amul', category: 'Dairy', image: '🥛', searchTerms: ['milk', 'dudh'], description: 'Amul Gold 1L pack', unit: '1L', isActive: true },
  { id: 'p7', name: 'Paneer', brand: 'Amul', category: 'Dairy', image: '🧀', searchTerms: ['paneer', 'cottage cheese'], description: 'Fresh and soft paneer', unit: '200g', isActive: true },
  { id: 'p8', name: 'Paneer', brand: 'Amul', category: 'Dairy', image: '🧀', searchTerms: ['paneer', 'cottage cheese'], description: 'Family pack paneer', unit: '500g', isActive: true },
  { id: 'p9', name: 'Butter', brand: 'Amul', category: 'Dairy', image: '🧈', searchTerms: ['butter', 'makhan'], description: 'Amul pasteurized butter', unit: '100g', isActive: true },
  { id: 'p10', name: 'Cheese', brand: 'Amul', category: 'Dairy', image: '🧀', searchTerms: ['cheese'], description: 'Processed cheese slices', unit: '200g', isActive: true },
  { id: 'p11', name: 'Eggs', brand: 'Farm Fresh', category: 'Dairy', image: '🥚', searchTerms: ['eggs', 'anda'], description: 'Fresh farm eggs', unit: '6 pcs', isActive: true },
  { id: 'p12', name: 'Eggs', brand: 'Farm Fresh', category: 'Dairy', image: '🥚', searchTerms: ['eggs', 'anda'], description: 'Fresh farm eggs dozen', unit: '12 pcs', isActive: true },

  // Staples
  { id: 'p13', name: 'Basmati Rice', brand: 'India Gate', category: 'Staples', image: '🍚', searchTerms: ['rice', 'chawal', 'basmati'], description: 'Premium aged basmati rice', unit: '5kg', isActive: true },
  { id: 'p14', name: 'Basmati Rice', brand: 'India Gate', category: 'Staples', image: '🍚', searchTerms: ['rice', 'chawal', 'basmati'], description: 'Premium rice large pack', unit: '10kg', isActive: true },
  { id: 'p15', name: 'Wheat Atta', brand: 'Aashirvaad', category: 'Staples', image: '🌾', searchTerms: ['atta', 'flour', 'wheat'], description: 'Whole wheat atta for soft rotis', unit: '5kg', isActive: true },
  { id: 'p16', name: 'Wheat Atta', brand: 'Aashirvaad', category: 'Staples', image: '🌾', searchTerms: ['atta', 'flour', 'wheat'], description: 'Wheat atta large pack', unit: '10kg', isActive: true },
  { id: 'p17', name: 'Toor Dal', brand: 'Tata Sampann', category: 'Staples', image: '🫘', searchTerms: ['dal', 'toor', 'arhar'], description: 'Unpolished toor dal', unit: '1kg', isActive: true },
  { id: 'p18', name: 'Moong Dal', brand: 'Tata Sampann', category: 'Staples', image: '🫘', searchTerms: ['dal', 'moong'], description: 'Yellow moong dal', unit: '1kg', isActive: true },
  { id: 'p19', name: 'Sugar', brand: 'Madhur', category: 'Staples', image: '🍬', searchTerms: ['sugar', 'cheeni'], description: 'Refined white sugar', unit: '1kg', isActive: true },
  { id: 'p20', name: 'Salt', brand: 'Tata', category: 'Staples', image: '🧂', searchTerms: ['salt', 'namak'], description: 'Iodized salt', unit: '1kg', isActive: true },
  { id: 'p21', name: 'Bread', brand: 'Britannia', category: 'Staples', image: '🍞', searchTerms: ['bread', 'roti'], description: 'Fresh white bread', unit: '400g', isActive: true },
  { id: 'p22', name: 'Brown Bread', brand: 'Britannia', category: 'Staples', image: '🍞', searchTerms: ['bread', 'brown bread'], description: 'Healthy brown bread', unit: '400g', isActive: true },

  // Oils
  { id: 'p23', name: 'Sunflower Oil', brand: 'Fortune', category: 'Oils', image: '🫒', searchTerms: ['oil', 'sunflower', 'cooking oil'], description: 'Heart-healthy sunflower cooking oil', unit: '1L', isActive: true },
  { id: 'p24', name: 'Groundnut Oil', brand: 'Dhara', category: 'Oils', image: '🫒', searchTerms: ['oil', 'groundnut', 'peanut'], description: 'Pure groundnut oil', unit: '1L', isActive: true },
  { id: 'p25', name: 'Mustard Oil', brand: 'Fortune', category: 'Oils', image: '🫒', searchTerms: ['oil', 'mustard', 'sarson'], description: 'Kachi ghani mustard oil', unit: '1L', isActive: true },
  { id: 'p26', name: 'Olive Oil', brand: 'Figaro', category: 'Oils', image: '🫒', searchTerms: ['oil', 'olive'], description: 'Extra virgin olive oil', unit: '500ml', isActive: true },

  // Snacks
  { id: 'p27', name: 'Biscuits', brand: 'Parle-G', category: 'Snacks', image: '🍪', searchTerms: ['biscuit', 'parle'], description: 'Original glucose biscuits', unit: '200g', isActive: true },
  { id: 'p28', name: 'Chips', brand: 'Lays', category: 'Snacks', image: '🥔', searchTerms: ['chips', 'lays'], description: 'Classic salted chips', unit: '100g', isActive: true },
  { id: 'p29', name: 'Namkeen Mix', brand: 'Haldirams', category: 'Snacks', image: '🥜', searchTerms: ['namkeen', 'mixture'], description: 'Classic namkeen mix', unit: '200g', isActive: true },
  { id: 'p30', name: 'Chocolate', brand: 'Cadbury', category: 'Snacks', image: '🍫', searchTerms: ['chocolate', 'cadbury', 'dairy milk'], description: 'Dairy Milk chocolate', unit: '50g', isActive: true },

  // Beverages
  { id: 'p31', name: 'Tea Powder', brand: 'Tata', category: 'Beverages', image: '☕', searchTerms: ['tea', 'chai'], description: 'Premium tea powder', unit: '250g', isActive: true },
  { id: 'p32', name: 'Coffee Powder', brand: 'Nescafe', category: 'Beverages', image: '☕', searchTerms: ['coffee'], description: 'Classic coffee powder', unit: '200g', isActive: true },

  // Cleaning
  { id: 'p33', name: 'Detergent Powder', brand: 'Surf Excel', category: 'Cleaning', image: '🧹', searchTerms: ['detergent', 'washing', 'surf'], description: 'Easy wash detergent powder', unit: '1kg', isActive: true },
  { id: 'p34', name: 'Dish Soap', brand: 'Vim', category: 'Cleaning', image: '🧼', searchTerms: ['dish', 'soap', 'vim'], description: 'Dishwash liquid', unit: '500ml', isActive: true },

  // Personal Care
  { id: 'p35', name: 'Shampoo', brand: 'Head & Shoulders', category: 'Personal Care', image: '🧴', searchTerms: ['shampoo'], description: 'Anti-dandruff shampoo', unit: '200ml', isActive: true },
  { id: 'p36', name: 'Soap Bar', brand: 'Dove', category: 'Personal Care', image: '🧼', searchTerms: ['soap', 'bath'], description: 'Moisturizing soap', unit: '100g', isActive: true },
  { id: 'p37', name: 'Toothpaste', brand: 'Colgate', category: 'Personal Care', image: '🦷', searchTerms: ['toothpaste', 'colgate'], description: 'Cavity protection toothpaste', unit: '150g', isActive: true },

  // Fruits
  { id: 'p38', name: 'Apples', brand: 'Shimla', category: 'Fruits', image: '🍎', searchTerms: ['apple', 'seb'], description: 'Fresh Shimla apples', unit: '1kg', isActive: true },
  { id: 'p39', name: 'Bananas', brand: 'Local', category: 'Fruits', image: '🍌', searchTerms: ['banana', 'kela'], description: 'Fresh bananas', unit: '1 dozen', isActive: true },
  { id: 'p40', name: 'Oranges', brand: 'Nagpur', category: 'Fruits', image: '🍊', searchTerms: ['orange', 'santra'], description: 'Nagpur oranges', unit: '1kg', isActive: true },

  // Vegetables
  { id: 'p41', name: 'Tomatoes', brand: 'Farm Fresh', category: 'Vegetables', image: '🍅', searchTerms: ['tomato', 'tamatar'], description: 'Fresh tomatoes', unit: '1kg', isActive: true },
  { id: 'p42', name: 'Onions', brand: 'Farm Fresh', category: 'Vegetables', image: '🧅', searchTerms: ['onion', 'pyaaz'], description: 'Fresh onions', unit: '1kg', isActive: true },
  { id: 'p43', name: 'Potatoes', brand: 'Farm Fresh', category: 'Vegetables', image: '🥔', searchTerms: ['potato', 'aloo'], description: 'Fresh potatoes', unit: '2kg', isActive: true },
  { id: 'p44', name: 'Spinach', brand: 'Farm Fresh', category: 'Vegetables', image: '🥬', searchTerms: ['spinach', 'palak'], description: 'Fresh spinach', unit: '250g', isActive: true },

  // Meat
  { id: 'p45', name: 'Chicken Curry Cut', brand: 'Farm Fresh', category: 'Meat', image: '🍗', searchTerms: ['chicken', 'murgi'], description: 'Fresh chicken curry cut', unit: '500g', isActive: true },
  { id: 'p46', name: 'Chicken Boneless', brand: 'Farm Fresh', category: 'Meat', image: '🍗', searchTerms: ['chicken', 'boneless'], description: 'Boneless chicken breast', unit: '500g', isActive: true },
  { id: 'p47', name: 'Chicken Wings', brand: 'Farm Fresh', category: 'Meat', image: '🍗', searchTerms: ['chicken', 'wings'], description: 'Fresh chicken wings', unit: '500g', isActive: true },
  { id: 'p48', name: 'Whole Chicken', brand: 'Farm Fresh', category: 'Meat', image: '🍗', searchTerms: ['chicken', 'whole'], description: 'Whole fresh chicken', unit: '1kg', isActive: true },
  { id: 'p49', name: 'Mutton Curry Cut', brand: 'Premium', category: 'Meat', image: '🥩', searchTerms: ['mutton', 'goat', 'bakra'], description: 'Fresh mutton curry cut', unit: '500g', isActive: true },
  { id: 'p50', name: 'Mutton Keema', brand: 'Premium', category: 'Meat', image: '🥩', searchTerms: ['mutton', 'keema', 'mince'], description: 'Fresh mutton keema', unit: '500g', isActive: true },
  { id: 'p51', name: 'Mutton Chops', brand: 'Premium', category: 'Meat', image: '🥩', searchTerms: ['mutton', 'chops'], description: 'Premium mutton chops', unit: '500g', isActive: true },
];

export const vendorListings: VendorListing[] = [
  // FreshMart Pimpri (v1) - Good prices, good stock
  { id: 'vl1', productId: 'p1', vendorId: 'v1', price: 32, mrp: 35, quantity: 400, unit: 'g', stock: 'in_stock', stockQty: 40 },
  { id: 'vl2', productId: 'p4', vendorId: 'v1', price: 30, mrp: 32, quantity: 500, unit: 'ml', stock: 'in_stock', stockQty: 50 },
  { id: 'vl3', productId: 'p6', vendorId: 'v1', price: 56, mrp: 60, quantity: 1, unit: 'L', stock: 'in_stock', stockQty: 45 },
  { id: 'vl4', productId: 'p7', vendorId: 'v1', price: 85, mrp: 95, quantity: 200, unit: 'g', stock: 'in_stock', stockQty: 20 },
  { id: 'vl5', productId: 'p8', vendorId: 'v1', price: 210, mrp: 235, quantity: 500, unit: 'g', stock: 'in_stock', stockQty: 15 },
  { id: 'vl6', productId: 'p9', vendorId: 'v1', price: 56, mrp: 60, quantity: 100, unit: 'g', stock: 'in_stock', stockQty: 30 },
  { id: 'vl7', productId: 'p11', vendorId: 'v1', price: 36, mrp: 40, quantity: 6, unit: 'pcs', stock: 'in_stock', stockQty: 60 },
  { id: 'vl8', productId: 'p12', vendorId: 'v1', price: 70, mrp: 80, quantity: 12, unit: 'pcs', stock: 'in_stock', stockQty: 50 },
  { id: 'vl9', productId: 'p13', vendorId: 'v1', price: 280, mrp: 310, quantity: 5, unit: 'kg', stock: 'in_stock', stockQty: 60 },
  { id: 'vl10', productId: 'p14', vendorId: 'v1', price: 550, mrp: 599, quantity: 10, unit: 'kg', stock: 'in_stock', stockQty: 40 },
  { id: 'vl11', productId: 'p15', vendorId: 'v1', price: 220, mrp: 250, quantity: 5, unit: 'kg', stock: 'in_stock', stockQty: 50 },
  { id: 'vl12', productId: 'p17', vendorId: 'v1', price: 120, mrp: 140, quantity: 1, unit: 'kg', stock: 'in_stock', stockQty: 30 },
  { id: 'vl13', productId: 'p19', vendorId: 'v1', price: 42, mrp: 48, quantity: 1, unit: 'kg', stock: 'in_stock', stockQty: 55 },
  { id: 'vl14', productId: 'p21', vendorId: 'v1', price: 35, mrp: 40, quantity: 400, unit: 'g', stock: 'in_stock', stockQty: 40 },
  { id: 'vl15', productId: 'p23', vendorId: 'v1', price: 150, mrp: 170, quantity: 1, unit: 'L', stock: 'in_stock', stockQty: 30 },
  { id: 'vl16', productId: 'p24', vendorId: 'v1', price: 180, mrp: 200, quantity: 1, unit: 'L', stock: 'in_stock', stockQty: 25 },
  { id: 'vl17', productId: 'p27', vendorId: 'v1', price: 25, mrp: 30, quantity: 200, unit: 'g', stock: 'in_stock', stockQty: 80 },
  { id: 'vl18', productId: 'p28', vendorId: 'v1', price: 20, mrp: 20, quantity: 100, unit: 'g', stock: 'in_stock', stockQty: 70 },
  { id: 'vl19', productId: 'p31', vendorId: 'v1', price: 140, mrp: 160, quantity: 250, unit: 'g', stock: 'in_stock', stockQty: 40 },
  { id: 'vl20', productId: 'p33', vendorId: 'v1', price: 180, mrp: 210, quantity: 1, unit: 'kg', stock: 'in_stock', stockQty: 35 },
  { id: 'vl21', productId: 'p35', vendorId: 'v1', price: 110, mrp: 130, quantity: 200, unit: 'ml', stock: 'in_stock', stockQty: 45 },
  { id: 'vl22', productId: 'p38', vendorId: 'v1', price: 120, mrp: 140, quantity: 1, unit: 'kg', stock: 'in_stock', stockQty: 50 },
  { id: 'vl23', productId: 'p41', vendorId: 'v1', price: 30, mrp: 35, quantity: 1, unit: 'kg', stock: 'in_stock', stockQty: 70 },
  { id: 'vl24', productId: 'p42', vendorId: 'v1', price: 25, mrp: 30, quantity: 1, unit: 'kg', stock: 'in_stock', stockQty: 80 },

  // Mannan Provisions (v2) - Premium prices, excellent stock
  { id: 'vl25', productId: 'p1', vendorId: 'v2', price: 30, mrp: 35, quantity: 400, unit: 'g', stock: 'in_stock', stockQty: 60 },
  { id: 'vl26', productId: 'p4', vendorId: 'v2', price: 28, mrp: 32, quantity: 500, unit: 'ml', stock: 'in_stock', stockQty: 65 },
  { id: 'vl27', productId: 'p6', vendorId: 'v2', price: 54, mrp: 60, quantity: 1, unit: 'L', stock: 'in_stock', stockQty: 55 },
  { id: 'vl28', productId: 'p7', vendorId: 'v2', price: 100, mrp: 110, quantity: 200, unit: 'g', stock: 'in_stock', stockQty: 40 },
  { id: 'vl29', productId: 'p9', vendorId: 'v2', price: 55, mrp: 60, quantity: 100, unit: 'g', stock: 'in_stock', stockQty: 50 },
  { id: 'vl30', productId: 'p10', vendorId: 'v2', price: 180, mrp: 200, quantity: 200, unit: 'g', stock: 'in_stock', stockQty: 35 },
  { id: 'vl31', productId: 'p13', vendorId: 'v2', price: 290, mrp: 310, quantity: 5, unit: 'kg', stock: 'in_stock', stockQty: 80 },
  { id: 'vl32', productId: 'p15', vendorId: 'v2', price: 230, mrp: 250, quantity: 5, unit: 'kg', stock: 'in_stock', stockQty: 70 },
  { id: 'vl33', productId: 'p17', vendorId: 'v2', price: 125, mrp: 140, quantity: 1, unit: 'kg', stock: 'in_stock', stockQty: 50 },
  { id: 'vl34', productId: 'p18', vendorId: 'v2', price: 135, mrp: 150, quantity: 1, unit: 'kg', stock: 'in_stock', stockQty: 45 },
  { id: 'vl35', productId: 'p19', vendorId: 'v2', price: 45, mrp: 48, quantity: 1, unit: 'kg', stock: 'in_stock', stockQty: 75 },
  { id: 'vl36', productId: 'p21', vendorId: 'v2', price: 38, mrp: 40, quantity: 400, unit: 'g', stock: 'in_stock', stockQty: 60 },
  { id: 'vl37', productId: 'p23', vendorId: 'v2', price: 155, mrp: 170, quantity: 1, unit: 'L', stock: 'in_stock', stockQty: 45 },
  { id: 'vl38', productId: 'p25', vendorId: 'v2', price: 170, mrp: 190, quantity: 1, unit: 'L', stock: 'in_stock', stockQty: 35 },
  { id: 'vl39', productId: 'p26', vendorId: 'v2', price: 420, mrp: 480, quantity: 500, unit: 'ml', stock: 'in_stock', stockQty: 20 },
  { id: 'vl40', productId: 'p32', vendorId: 'v2', price: 280, mrp: 320, quantity: 200, unit: 'g', stock: 'in_stock', stockQty: 30 },
  { id: 'vl41', productId: 'p34', vendorId: 'v2', price: 95, mrp: 110, quantity: 500, unit: 'ml', stock: 'in_stock', stockQty: 55 },
  { id: 'vl42', productId: 'p36', vendorId: 'v2', price: 35, mrp: 42, quantity: 100, unit: 'g', stock: 'in_stock', stockQty: 70 },
  { id: 'vl43', productId: 'p39', vendorId: 'v2', price: 48, mrp: 55, quantity: 1, unit: 'dozen', stock: 'in_stock', stockQty: 60 },

  // DailyNeeds Store (v3) - Lower prices, some out of stock
  { id: 'vl44', productId: 'p2', vendorId: 'v3', price: 38, mrp: 40, quantity: 500, unit: 'g', stock: 'in_stock', stockQty: 35 },
  { id: 'vl45', productId: 'p4', vendorId: 'v3', price: 26, mrp: 32, quantity: 500, unit: 'ml', stock: 'in_stock', stockQty: 30 },
  { id: 'vl46', productId: 'p5', vendorId: 'v3', price: 34, mrp: 36, quantity: 500, unit: 'ml', stock: 'in_stock', stockQty: 25 },
  { id: 'vl47', productId: 'p7', vendorId: 'v3', price: 80, mrp: 95, quantity: 200, unit: 'g', stock: 'in_stock', stockQty: 5 },
  { id: 'vl48', productId: 'p8', vendorId: 'v3', price: 200, mrp: 235, quantity: 500, unit: 'g', stock: 'out_of_stock', stockQty: 0 },
  { id: 'vl49', productId: 'p13', vendorId: 'v3', price: 275, mrp: 310, quantity: 5, unit: 'kg', stock: 'in_stock', stockQty: 45 },
  { id: 'vl50', productId: 'p15', vendorId: 'v3', price: 215, mrp: 250, quantity: 5, unit: 'kg', stock: 'in_stock', stockQty: 40 },
  { id: 'vl51', productId: 'p17', vendorId: 'v3', price: 115, mrp: 140, quantity: 1, unit: 'kg', stock: 'in_stock', stockQty: 20 },
  { id: 'vl52', productId: 'p19', vendorId: 'v3', price: 40, mrp: 48, quantity: 1, unit: 'kg', stock: 'in_stock', stockQty: 50 },
  { id: 'vl53', productId: 'p21', vendorId: 'v3', price: 33, mrp: 40, quantity: 400, unit: 'g', stock: 'in_stock', stockQty: 35 },
  { id: 'vl54', productId: 'p23', vendorId: 'v3', price: 145, mrp: 170, quantity: 1, unit: 'L', stock: 'in_stock', stockQty: 25 },
  { id: 'vl55', productId: 'p27', vendorId: 'v3', price: 23, mrp: 30, quantity: 200, unit: 'g', stock: 'in_stock', stockQty: 60 },
  { id: 'vl56', productId: 'p31', vendorId: 'v3', price: 135, mrp: 160, quantity: 250, unit: 'g', stock: 'in_stock', stockQty: 35 },
  { id: 'vl57', productId: 'p33', vendorId: 'v3', price: 175, mrp: 210, quantity: 1, unit: 'kg', stock: 'in_stock', stockQty: 30 },
  { id: 'vl58', productId: 'p38', vendorId: 'v3', price: 110, mrp: 140, quantity: 1, unit: 'kg', stock: 'in_stock', stockQty: 40 },
  { id: 'vl59', productId: 'p40', vendorId: 'v3', price: 90, mrp: 100, quantity: 1, unit: 'kg', stock: 'in_stock', stockQty: 35 },
  { id: 'vl60', productId: 'p41', vendorId: 'v3', price: 28, mrp: 35, quantity: 1, unit: 'kg', stock: 'in_stock', stockQty: 65 },
  { id: 'vl61', productId: 'p42', vendorId: 'v3', price: 23, mrp: 30, quantity: 1, unit: 'kg', stock: 'in_stock', stockQty: 70 },
  { id: 'vl62', productId: 'p43', vendorId: 'v3', price: 40, mrp: 50, quantity: 2, unit: 'kg', stock: 'in_stock', stockQty: 55 },

  // Budget Basket (v4) - Best prices, lower stock
  { id: 'vl63', productId: 'p1', vendorId: 'v4', price: 18, mrp: 20, quantity: 200, unit: 'g', stock: 'in_stock', stockQty: 25 },
  { id: 'vl64', productId: 'p4', vendorId: 'v4', price: 60, mrp: 65, quantity: 1000, unit: 'ml', stock: 'in_stock', stockQty: 18 },
  { id: 'vl65', productId: 'p7', vendorId: 'v4', price: 88, mrp: 95, quantity: 200, unit: 'g', stock: 'in_stock', stockQty: 10 },
  { id: 'vl66', productId: 'p13', vendorId: 'v4', price: 270, mrp: 310, quantity: 5, unit: 'kg', stock: 'in_stock', stockQty: 35 },
  { id: 'vl67', productId: 'p15', vendorId: 'v4', price: 210, mrp: 250, quantity: 5, unit: 'kg', stock: 'in_stock', stockQty: 30 },
  { id: 'vl68', productId: 'p17', vendorId: 'v4', price: 110, mrp: 140, quantity: 1, unit: 'kg', stock: 'in_stock', stockQty: 15 },
  { id: 'vl69', productId: 'p19', vendorId: 'v4', price: 38, mrp: 48, quantity: 1, unit: 'kg', stock: 'in_stock', stockQty: 40 },
  { id: 'vl70', productId: 'p20', vendorId: 'v4', price: 18, mrp: 22, quantity: 1, unit: 'kg', stock: 'in_stock', stockQty: 60 },
  { id: 'vl71', productId: 'p21', vendorId: 'v4', price: 32, mrp: 40, quantity: 400, unit: 'g', stock: 'in_stock', stockQty: 30 },
  { id: 'vl72', productId: 'p23', vendorId: 'v4', price: 142, mrp: 170, quantity: 1, unit: 'L', stock: 'in_stock', stockQty: 20 },
  { id: 'vl73', productId: 'p27', vendorId: 'v4', price: 22, mrp: 30, quantity: 200, unit: 'g', stock: 'in_stock', stockQty: 50 },
  { id: 'vl74', productId: 'p28', vendorId: 'v4', price: 18, mrp: 20, quantity: 100, unit: 'g', stock: 'in_stock', stockQty: 45 },
  { id: 'vl75', productId: 'p29', vendorId: 'v4', price: 40, mrp: 50, quantity: 200, unit: 'g', stock: 'in_stock', stockQty: 35 },
  { id: 'vl76', productId: 'p33', vendorId: 'v4', price: 170, mrp: 210, quantity: 1, unit: 'kg', stock: 'in_stock', stockQty: 25 },
  { id: 'vl77', productId: 'p35', vendorId: 'v4', price: 105, mrp: 130, quantity: 200, unit: 'ml', stock: 'in_stock', stockQty: 30 },
  { id: 'vl78', productId: 'p37', vendorId: 'v4', price: 85, mrp: 99, quantity: 150, unit: 'g', stock: 'in_stock', stockQty: 40 },
  { id: 'vl79', productId: 'p41', vendorId: 'v4', price: 26, mrp: 35, quantity: 1, unit: 'kg', stock: 'in_stock', stockQty: 50 },
  { id: 'vl80', productId: 'p42', vendorId: 'v4', price: 22, mrp: 30, quantity: 1, unit: 'kg', stock: 'in_stock', stockQty: 60 },
  { id: 'vl81', productId: 'p43', vendorId: 'v4', price: 38, mrp: 50, quantity: 2, unit: 'kg', stock: 'in_stock', stockQty: 45 },
  { id: 'vl82', productId: 'p44', vendorId: 'v4', price: 18, mrp: 25, quantity: 250, unit: 'g', stock: 'in_stock', stockQty: 35 },
  { id: 'vl83', productId: 'p11', vendorId: 'v4', price: 33, mrp: 40, quantity: 6, unit: 'pcs', stock: 'in_stock', stockQty: 45 },
  { id: 'vl84', productId: 'p12', vendorId: 'v4', price: 64, mrp: 80, quantity: 12, unit: 'pcs', stock: 'in_stock', stockQty: 35 },

  // Quality Foods (v5) - Curated, gourmet
  { id: 'vl85', productId: 'p3', vendorId: 'v5', price: 34, mrp: 38, quantity: 400, unit: 'g', stock: 'low_stock', stockQty: 5 },
  { id: 'vl86', productId: 'p5', vendorId: 'v5', price: 32, mrp: 36, quantity: 500, unit: 'ml', stock: 'in_stock', stockQty: 30 },
  { id: 'vl87', productId: 'p8', vendorId: 'v5', price: 225, mrp: 235, quantity: 500, unit: 'g', stock: 'low_stock', stockQty: 5 },
  { id: 'vl88', productId: 'p9', vendorId: 'v5', price: 108, mrp: 115, quantity: 200, unit: 'g', stock: 'in_stock', stockQty: 25 },
  { id: 'vl89', productId: 'p13', vendorId: 'v5', price: 295, mrp: 310, quantity: 5, unit: 'kg', stock: 'in_stock', stockQty: 40 },
  { id: 'vl90', productId: 'p23', vendorId: 'v5', price: 148, mrp: 170, quantity: 1, unit: 'L', stock: 'in_stock', stockQty: 30 },
  { id: 'vl91', productId: 'p24', vendorId: 'v5', price: 185, mrp: 200, quantity: 1, unit: 'L', stock: 'in_stock', stockQty: 20 },
  { id: 'vl92', productId: 'p26', vendorId: 'v5', price: 410, mrp: 480, quantity: 500, unit: 'ml', stock: 'in_stock', stockQty: 15 },
  { id: 'vl93', productId: 'p12', vendorId: 'v5', price: 38, mrp: 42, quantity: 6, unit: 'pcs', stock: 'in_stock', stockQty: 45 },

  // Pure Goashth Ltd (v6) - Premium meat shop
  { id: 'vl94', productId: 'p45', vendorId: 'v6', price: 180, mrp: 210, quantity: 500, unit: 'g', stock: 'in_stock', stockQty: 40 },
  { id: 'vl95', productId: 'p46', vendorId: 'v6', price: 240, mrp: 280, quantity: 500, unit: 'g', stock: 'in_stock', stockQty: 35 },
  { id: 'vl96', productId: 'p47', vendorId: 'v6', price: 220, mrp: 250, quantity: 500, unit: 'g', stock: 'in_stock', stockQty: 30 },
  { id: 'vl97', productId: 'p48', vendorId: 'v6', price: 350, mrp: 400, quantity: 1, unit: 'kg', stock: 'in_stock', stockQty: 25 },
  { id: 'vl98', productId: 'p49', vendorId: 'v6', price: 550, mrp: 620, quantity: 500, unit: 'g', stock: 'in_stock', stockQty: 30 },
  { id: 'vl99', productId: 'p50', vendorId: 'v6', price: 480, mrp: 550, quantity: 500, unit: 'g', stock: 'in_stock', stockQty: 25 },
  { id: 'vl100', productId: 'p51', vendorId: 'v6', price: 620, mrp: 700, quantity: 500, unit: 'g', stock: 'in_stock', stockQty: 20 },
  { id: 'vl101', productId: 'p11', vendorId: 'v6', price: 37, mrp: 40, quantity: 6, unit: 'pcs', stock: 'in_stock', stockQty: 50 },
  { id: 'vl102', productId: 'p12', vendorId: 'v6', price: 72, mrp: 80, quantity: 12, unit: 'pcs', stock: 'in_stock', stockQty: 45 },

  // Juicy Meats (v7) - Competitive meat prices
  { id: 'vl103', productId: 'p45', vendorId: 'v7', price: 170, mrp: 210, quantity: 500, unit: 'g', stock: 'in_stock', stockQty: 50 },
  { id: 'vl104', productId: 'p46', vendorId: 'v7', price: 230, mrp: 280, quantity: 500, unit: 'g', stock: 'in_stock', stockQty: 45 },
  { id: 'vl105', productId: 'p47', vendorId: 'v7', price: 210, mrp: 250, quantity: 500, unit: 'g', stock: 'in_stock', stockQty: 40 },
  { id: 'vl106', productId: 'p48', vendorId: 'v7', price: 340, mrp: 400, quantity: 1, unit: 'kg', stock: 'in_stock', stockQty: 30 },
  { id: 'vl107', productId: 'p49', vendorId: 'v7', price: 540, mrp: 620, quantity: 500, unit: 'g', stock: 'in_stock', stockQty: 35 },
  { id: 'vl108', productId: 'p50', vendorId: 'v7', price: 470, mrp: 550, quantity: 500, unit: 'g', stock: 'in_stock', stockQty: 30 },
  { id: 'vl109', productId: 'p51', vendorId: 'v7', price: 610, mrp: 700, quantity: 500, unit: 'g', stock: 'in_stock', stockQty: 25 },
  { id: 'vl110', productId: 'p11', vendorId: 'v7', price: 36, mrp: 40, quantity: 6, unit: 'pcs', stock: 'in_stock', stockQty: 60 },
  { id: 'vl111', productId: 'p12', vendorId: 'v7', price: 70, mrp: 80, quantity: 12, unit: 'pcs', stock: 'in_stock', stockQty: 55 },
];

export const sampleOrders: Order[] = [
  {
    id: 'ord1', vendorIds: ['v1'],
    items: [
      { listingId: 'vl1', qty: 2, price: 32, productName: 'Amul Curd 400g', vendorId: 'v1' },
      { listingId: 'vl2', qty: 1, price: 30, productName: 'Amul Milk 500ml', vendorId: 'v1' },
    ],
    subtotal: 94, deliveryFee: 0, taxAmount: 5, total: 99,
    status: 'delivered', createdAt: '2026-03-12T10:30:00Z',
    deliveryAddress: 'Flat 204, Green Valley Apt, Pimpri, Pune 411018',
    paymentMethod: 'cod',
  },
  {
    id: 'ord2', vendorIds: ['v3', 'v6'],
    items: [
      { listingId: 'vl44', qty: 1, price: 38, productName: 'Chitale Curd 500g', vendorId: 'v3' },
      { listingId: 'vl49', qty: 1, price: 275, productName: 'Basmati Rice 5kg', vendorId: 'v3' },
      { listingId: 'vl94', qty: 1, price: 180, productName: 'Chicken Curry Cut 500g', vendorId: 'v6' },
    ],
    subtotal: 493, deliveryFee: 40, taxAmount: 25, total: 558,
    status: 'out_for_delivery', createdAt: '2026-03-14T08:15:00Z',
    deliveryAddress: 'B-12, Sunrise Towers, Wakad, Pune 411057',
    paymentMethod: 'upi',
  },
];

export const sampleAddresses: Address[] = [
  { id: 'a1', label: 'Home', full: 'Flat 204, Green Valley Apt, Pimpri, Pune 411018', pincode: '411018', area: 'Pimpri', isDefault: true, lat: 18.6285, lng: 73.8010 },
  { id: 'a2', label: 'Office', full: 'Unit 5, TechPark, Hinjewadi Phase 1, Pune 411057', pincode: '411057', area: 'Wakad', isDefault: false, lat: 18.5975, lng: 73.7650 },
];

export const categories = ['Dairy', 'Staples', 'Oils', 'Snacks', 'Beverages', 'Cleaning', 'Personal Care', 'Fruits', 'Vegetables', 'Meat'];

export const quickSearches = ['Curd', 'Milk', 'Bread', 'Eggs', 'Rice', 'Atta', 'Oil', 'Sugar', 'Dal', 'Paneer', 'Chicken', 'Mutton'];

export const popularItems = ['p1', 'p4', 'p21', 'p11', 'p13', 'p15', 'p23', 'p19', 'p17', 'p7', 'p45', 'p49'];

// Helper functions
export function getVendor(id: string) { return vendors.find(v => v.id === id); }
export function getVendorBySlug(slug: string) { return vendors.find(v => v.slug === slug); }
export function getProduct(id: string) { return products.find(p => p.id === id); }
export function getListing(id: string) { return vendorListings.find(l => l.id === id); }

export function searchListings(query: string): VendorListing[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  const matchingProductIds = products
    .filter(p => p.searchTerms.some(t => t.includes(q)) || p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
    .map(p => p.id);
  return vendorListings.filter(l => matchingProductIds.includes(l.productId));
}

export function getVendorListings(vendorId: string): VendorListing[] {
  return vendorListings.filter(l => l.vendorId === vendorId);
}

export function formatPrice(price: number): string {
  return `₹${price}`;
}

export function formatQuantity(qty: number, unit: string): string {
  return `${qty} ${unit}`;
}

export function getDiscountPercent(price: number, mrp?: number): number | null {
  if (!mrp || mrp <= price) return null;
  return Math.round(((mrp - price) / mrp) * 100);
}

/** Determine if a listing uses weight (g), volume (ml), or count (pcs) */
export function getUnitType(unit: string): 'g' | 'ml' | 'pcs' {
  const u = unit.toLowerCase();
  if (u === 'ml' || u === 'l') return 'ml';
  if (u === 'pcs' || u === 'dozen') return 'pcs';
  return 'g'; // g, kg
}

/** Convert listing quantity to base unit (grams or ml) */
export function toBaseUnit(quantity: number, unit: string): number {
  const u = unit.toLowerCase();
  if (u === 'kg') return quantity * 1000;
  if (u === 'l') return quantity * 1000;
  return quantity; // g, ml, pcs
}

/** Get price per base unit (per gram or per ml) */
export function getPricePerBaseUnit(price: number, quantity: number, unit: string): number {
  const base = toBaseUnit(quantity, unit);
  return price / base;
}

/** Format custom quantity with proper unit display */
export function formatCustomQty(qty: number, unitType: 'g' | 'ml' | 'pcs'): string {
  if (unitType === 'pcs') return `${qty} pcs`;
  if (qty >= 1000) {
    const big = qty / 1000;
    const label = unitType === 'g' ? 'kg' : 'L';
    return `${big % 1 === 0 ? big.toFixed(0) : big.toFixed(1)} ${label}`;
  }
  return `${qty} ${unitType === 'g' ? 'gm' : 'ml'}`;
}

/** Calculate price for a custom quantity order */
export function calcCustomPrice(listingPrice: number, listingQty: number, listingUnit: string, customQty: number): number {
  const pricePerUnit = getPricePerBaseUnit(listingPrice, listingQty, listingUnit);
  return Math.round(pricePerUnit * customQty * 100) / 100;
}
