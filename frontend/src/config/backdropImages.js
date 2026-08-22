/**
 * Centralized Photographic Backdrop Image Configuration
 *
 * Local images are stored in /public/backdrops/ for each branded section.
 * Unsplash URLs are kept for sections whose real photos are not yet supplied.
 * All images are displayed with a consistent 45-55% navy (#1F2A38) scrim
 * overlay to ensure optimal contrast and readability.
 */

export const BACKDROP_IMAGES = {
  // Login / Main Landing Page: Presidency University aerial campus shot (image 1)
  loginLanding: {
    url: '/backdrops/login-hero.jpg',
    alt: 'Presidency University aerial campus with fountain and School of Management',
    caption: 'Presidency University Campus'
  },

  // Dashboard Overview: Same aerial campus shot (image 1 / image 2 per brief)
  dashboardOverview: {
    url: '/backdrops/dashboard-hero.jpg',
    alt: 'Presidency University campus aerial overview',
    caption: 'Executive Operations Overview'
  },

  // Faculty Section: Instructor-led classroom scene (Unsplash — real photo TBD)
  faculty: {
    url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1920&q=80',
    alt: 'Instructor lecturing in university classroom',
    caption: 'Academic Faculty & Instruction'
  },

  // Classrooms / Timetable: Real classroom photo with students and faculty (image 2)
  classrooms: {
    url: '/backdrops/classroom-hero.jpg',
    alt: 'Presidency University classroom with students and faculty',
    caption: 'Classrooms & Smart Learning Spaces'
  },

  // Transportation Section: Presidency University branded buses (image 3)
  transportation: {
    url: '/backdrops/transport-hero.jpg',
    alt: 'Presidency University branded college buses on campus road',
    caption: 'Campus Fleet & Transit Logistics'
  },

  // Transport alias used by TransportManagerInterface (maps to same image)
  transport: {
    url: '/backdrops/transport-hero.jpg',
    alt: 'Presidency University branded college buses on campus road',
    caption: 'Campus Fleet & Transit Logistics'
  },

  // Auditorium & Events Section: Felicitation/event photo on stage (image 4)
  auditorium: {
    url: '/backdrops/events-hero.png',
    alt: 'Presidency University felicitation event on stage',
    caption: 'Auditorium & Events'
  },

  // Maintenance Section: Clean facilities, infrastructure (Unsplash — real photo TBD)
  maintenance: {
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1920&q=80',
    alt: 'Building infrastructure and maintenance engineering',
    caption: 'Facilities & Infrastructure Systems'
  },

  // Energy & Sustainability Section: Solar arrays (Unsplash — real photo TBD)
  energy: {
    url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1920&q=80',
    alt: 'Solar array panels and clean power infrastructure',
    caption: 'Energy, Solar & Sustainability Command'
  },

  // Attendance Section: Register/sign-in desk (Unsplash — real photo TBD)
  attendance: {
    url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1920&q=80',
    alt: 'Attendance register and sign-in desk',
    caption: 'Daily Attendance & Check-in Records'
  },

  // Recommendations / NL Query / Chat Section: Minimal texture
  assistantChat: {
    url: 'https://images.unsplash.com/photo-1518655048521-f130df041f66?auto=format&fit=crop&w=1920&q=80',
    alt: 'Clean neutral study workspace texture',
    caption: 'Campus Decision Intelligence'
  }
};

export default BACKDROP_IMAGES;
