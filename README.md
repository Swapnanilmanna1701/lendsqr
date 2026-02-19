# Lendsqr Frontend Engineering Assessment

A pixel-perfect implementation of the Lendsqr admin console, built as part of the frontend engineering assessment. The application includes Login, Dashboard, Users listing, and User Details pages with mobile responsiveness, mock API integration, and local data persistence.

## Live Demo

[Live Demo](https://lendsqr-fe-test-woad-phi.vercel.app)

## Figma Design

[Figma Design Link](https://www.figma.com/file/ZKILoCoIoy1IESdBpq3GNC/FrontendTesting?node-id=5530%3A0)

## Tech Stack

- **React 19** with **TypeScript** (strict mode)
- **Vite** for build tooling and dev server
- **SCSS** for styling (BEM methodology)
- **React Router v7** for client-side routing
- **Axios** for API requests
- **IndexedDB** for local data persistence
- **localStorage** for auth state and user detail caching
- **Vitest** + **React Testing Library** for unit tests

## Project Structure

```
src/
├── __tests__/              # Unit tests
│   ├── Login.test.tsx
│   ├── localStorage.test.ts
│   ├── StatsCard.test.tsx
│   └── UserTable.test.tsx
├── assets/                 # Static assets (icons, images)
├── components/             # Reusable UI components
│   ├── FilterPopup/        # Table filter dropdown
│   ├── Navbar/             # Top navigation bar
│   ├── Pagination/         # Pagination controls
│   ├── Sidebar/            # Side navigation menu
│   ├── StatsCard/          # Dashboard stat card
│   └── UserTable/          # Users data table with filters
├── hooks/                  # Custom React hooks
├── pages/                  # Route-level page components
│   ├── Dashboard/          # Dashboard layout + overview
│   ├── Login/              # Login page
│   ├── UserDetails/        # Individual user details
│   └── Users/              # Users listing page
├── scss/                   # Global SCSS partials
│   ├── _variables.scss     # Design tokens (colors, spacing, breakpoints)
│   └── _mixins.scss        # Responsive & utility mixins
├── services/               # API service layer
│   └── api.ts              # Mock API integration
├── types/                  # TypeScript type definitions
│   └── index.ts
├── utils/                  # Utility functions
│   ├── indexedDB.ts        # IndexedDB CRUD operations
│   └── localStorage.ts    # localStorage helpers
├── App.tsx                 # Root component with routing
├── index.scss              # Global styles & CSS reset
└── main.tsx                # Application entry point
```

## Pages

### 1. Login (`/login`)
- Split-screen layout with illustration and login form
- Form validation (email format, required fields)
- Password visibility toggle
- Auth state stored in localStorage
- Responsive: illustration hidden on tablet/mobile

### 2. Dashboard (`/dashboard`)
- Overview with 4 statistics cards (Users, Active Users, Users with Loans, Users with Savings)
- Sidebar navigation with all menu sections (Customers, Businesses, Settings)
- Top navbar with search, notifications, and user profile

### 3. Users (`/dashboard/users`)
- Statistics cards with real-time counts from API data
- Data table displaying 500 user records from mock API
- Table features: column filters, status badges, action menus, pagination
- Filter by organization, username, email, date, phone, status
- Pagination with configurable items per page (10/20/50/100)
- Data cached to IndexedDB for offline access

### 4. User Details (`/dashboard/users/:id`)
- Back navigation to users list
- User profile card with avatar, tier rating, and account info
- Tab navigation (General Details, Documents, Bank Details, Loans, Savings, App and System)
- Detailed sections: Personal Info, Education & Employment, Socials, Guarantor
- Action buttons: Blacklist User, Activate User
- Data persistence via IndexedDB and localStorage

## Mock API

The application fetches user data from:
```
https://6270020422c706a0ae70b72c.mockapi.io/lendsqr/api/v1/users
```

Additional user details (personal info, education, socials, guarantor) are generated deterministically from the user ID to ensure consistency across page loads.

## Data Persistence

- **IndexedDB**: Primary storage for user data, enabling offline access and faster page loads after initial fetch
- **localStorage**: Used for auth state and individual user detail caching

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd lendsqr-fe-test

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview production build |
| `npm run test` | Run tests in watch mode |
| `npm run test:run` | Run all tests once |
| `npm run lint` | Run ESLint |

## Testing

The project includes 33 unit tests covering positive and negative scenarios:

```bash
# Run all tests
npm run test:run

# Run tests in watch mode
npm run test
```

### Test Coverage
- **Login page** (11 tests): Rendering, input handling, password toggle, validation, navigation, localStorage
- **localStorage utility** (7 tests): Save, get, remove, complex objects, error handling
- **StatsCard component** (7 tests): Props rendering, icon styling, value types
- **UserTable component** (8 tests): Loading state, empty state, data rendering, status badges, pagination, action menu

## Design Decisions

1. **BEM naming convention** for SCSS classes ensures consistent, maintainable styling
2. **Component-scoped SCSS files** co-located with their components for easy navigation
3. **IndexedDB + localStorage dual persistence** provides reliable offline support
4. **Deterministic mock data generation** using user ID hashing ensures consistent data across sessions
5. **Inline SVG icons** avoid external dependencies and enable color customization via CSS
6. **Mobile-first responsive design** with breakpoints at 576px, 768px, 992px, and 1200px

## Responsiveness

The application is fully responsive across all screen sizes:
- **Desktop** (> 1200px): Full layout with sidebar and all features
- **Laptop** (992px - 1200px): Adjusted spacing and grid layouts
- **Tablet** (768px - 992px): Collapsible sidebar, 2-column stat cards, scrollable tables
- **Mobile** (< 576px): Single column layout, hamburger menu, simplified navigation

## Author

Swapnanil
