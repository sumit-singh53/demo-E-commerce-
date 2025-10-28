# Demo E-commerce - Modern Beauty Store

A modern, futuristic e-commerce application built with React and Node.js, featuring a stunning neon theme with dark blue backgrounds and red accent text.

## 🌟 Features

- **Futuristic Design**: Dark blue gradient backgrounds with animated grid patterns
- **Neon Theme**: Cyan blue accents with neon red "Beauty" text
- **Responsive Layout**: Optimized for all device sizes
- **Smooth Animations**: Scroll-triggered animations and parallax effects
- **Product Catalog**: 110+ beauty products with detailed information
- **Shopping Cart**: Add/remove items with real-time updates
- **Error Handling**: Comprehensive error handling with retry functionality
- **Performance Optimized**: Lazy loading and optimized animations

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Framer Motion** - Smooth animations and transitions
- **CSS Modules** - Scoped styling with CSS custom properties
- **React Router** - Client-side routing

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **Mock Data** - 110+ beauty products dataset
- **CORS** - Cross-origin resource sharing
- **Error Handling** - Comprehensive error middleware

## 🎨 Design Features

- **Futuristic Background**: Radial gradients with animated particles
- **Grid Overlay**: Moving grid pattern for sci-fi aesthetic
- **Neon Glows**: Multi-layered glow effects with rotation
- **Glass Morphism**: Backdrop blur effects for modern UI
- **Responsive Typography**: Fluid typography that scales with viewport

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sumit-singh53/demo-E-commerce-.git
   cd demo-E-commerce-
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Start the Backend Server**
   ```bash
   cd ../backend
   npm start
   ```
   Server will run on `http://localhost:5000`

5. **Start the Frontend Development Server**
   ```bash
   cd ../frontend
   npm start
   ```
   Application will open at `http://localhost:3000`

## 🌐 API Endpoints

- `GET /api/products` - Fetch all products
- `GET /api/cart?userId=mock` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `POST /api/cart/remove` - Remove item from cart
- `POST /api/checkout` - Process checkout

## 🎯 Key Components

- **HeroSection**: Animated hero with neon red "Beauty" text
- **ProductGrid**: Responsive grid with scroll animations
- **ProductCard**: Individual product cards with hover effects
- **ThemeProvider**: Centralized theme management
- **ErrorBoundary**: Error handling and recovery

## 🔧 Configuration

### Environment Variables

**Frontend (.env)**
```
REACT_APP_API_URL=http://localhost:5000
```

**Backend (.env)**
```
DB_TYPE=sqlite
USE_MOCK=true
PORT=5000
```

## 📱 Responsive Breakpoints

- **Mobile**: < 480px (1 column)
- **Small**: 480px - 767px (1-2 columns)
- **Medium**: 768px - 1023px (2-3 columns)
- **Large**: 1024px - 1279px (3-4 columns)
- **Extra Large**: 1280px+ (4-5 columns)

## 🎨 Color Palette

- **Primary Background**: Deep blue gradients (#0a0a1a, #001133, #002244)
- **Accent Blue**: Cyan (#00ffff)
- **Accent Red**: Neon red (#ff073a) - Used for "Beauty" text
- **Text**: White (#ffffff)
- **Glass Effects**: Semi-transparent dark blue with backdrop blur

## 🚀 Performance Features

- **GPU Acceleration**: 3D transforms for smooth animations
- **Lazy Loading**: Components load as needed
- **Optimized Images**: Responsive image loading
- **Reduced Motion**: Respects user accessibility preferences
- **Bundle Optimization**: Code splitting and tree shaking

## 📸 Screenshots

The application features a modern, futuristic design with:
- Animated hero section with neon red "Beauty" text
- Product grid with hover animations
- Responsive cart functionality
- Smooth checkout process

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Sumit Singh** - [GitHub Profile](https://github.com/sumit-singh53)

---

⭐ Star this repository if you found it helpful!
