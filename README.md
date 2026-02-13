# Dranand Dashboard - Medical Admin Dashboard

A professional, clean, and modern admin dashboard for Dr. Anand's gastroenterology practice.

## Features

- **Dashboard**: Overview with stats cards, recent appointments, and quick actions
- **Patients**: Patient management with search, filtering, and status badges
- **Appointments**: Appointment scheduling and management with colored status badges
- **Reports**: Analytics and report generation with visual charts
- **Testimonials**: Patient review and feedback management
- **Settings**: Profile management and account settings

## Tech Stack

- **React** (with JSX only, no TypeScript)
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons
- **Vite** - Fast build tool

## Design Features

- Clean and minimal medical theme
- Calm teal and white color palette
- Soft shadows and rounded cards
- Professional typography
- Fully responsive (mobile, tablet, desktop)
- Smooth page transitions
- Hover effects and micro-interactions

## Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open your browser and navigate to:
```
http://localhost:3000
```

## Build for Production

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```

## Project Structure

```
dranand-dashboard/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Layout.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Header.jsx
│   │   └── ui/
│   │       ├── StatsCard.jsx
│   │       ├── Card.jsx
│   │       ├── Badge.jsx
│   │       ├── Button.jsx
│   │       └── SearchInput.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Patients.jsx
│   │   ├── Appointments.jsx
│   │   ├── Reports.jsx
│   │   ├── Testimonials.jsx
│   │   └── Settings.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Features by Page

### Dashboard
- 4 stats cards (Patients, Appointments, Surgeries, Revenue)
- Recent appointments table
- Quick actions panel
- Today's schedule
- Smooth fade-in animations

### Patients
- Searchable patient table
- Status badges (Active, Critical, Recovering)
- Edit/Delete actions
- Pagination
- Responsive table layout

### Appointments
- Appointment list with detailed information
- Status badges (Confirmed, Pending, Cancelled)
- Date filtering
- Status filtering
- Quick stats overview

### Reports
- Analytics cards
- Animated bar charts (Patient Growth, Revenue Trend)
- Recent reports list
- Quick stats display
- Download functionality

### Testimonials
- Patient reviews with ratings
- Status filtering (Published, Pending)
- Star ratings
- Like counter
- Review management

### Settings
- Profile information form
- Password change
- Notification preferences
- Quick actions
- Account statistics

## Color Palette

- Primary: Teal-500 (#58c8ca)
- Background: Gray-50 (#f9fafb)
- Cards: White with shadow-md
- Text: Gray-800/900
- Accents: Green, Yellow, Red for status badges

## Customization

You can customize the dashboard by modifying:

1. **Colors**: Edit `tailwind.config.js` to change the color scheme
2. **Data**: Update dummy data in each page component
3. **Layout**: Modify components in `src/components/layout/`
4. **Pages**: Edit page components in `src/pages/`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Private - For Dr. Anand's medical practice

## Author

Created for Dr. Anand's Gastroenterology Practice
