/**
 * Centralized Photographic Backdrop Image Configuration
 * 
 * Sourced from high-resolution, royalty-free photography (Unsplash)
 * matching each specific section/page theme. All images are displayed with a
 * consistent 45-55% dark scrim overlay to ensure optimal contrast and readability.
 */

export const BACKDROP_IMAGES = {
  // Login / Main Landing Page: Campus exterior, pathways, university architecture
  loginLanding: {
    url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1920&q=80',
    alt: 'Presidency University campus architecture and grounds',
    credit: 'Unsplash - University Campus Architecture',
    caption: 'Presidency University Campus Grounds'
  },

  // Dashboard Overview: Wide, calm campus architecture shot (low activity)
  dashboardOverview: {
    url: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1920&q=80',
    alt: 'Calm university academic building and quad',
    credit: 'Unsplash - Academic Architecture',
    caption: 'Executive Operations Overview'
  },

  // Faculty Section: Faceless / over-the-shoulder classroom instruction scene
  faculty: {
    url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1920&q=80',
    alt: 'Instructor lecturing in university classroom',
    credit: 'Unsplash - Faculty Instruction',
    caption: 'Academic Faculty & Instruction'
  },

  // Classrooms / Timetable / Academic Spaces: Presidency University lecture hall & classroom instruction
  classrooms: {
    url: '/presidency_classroom_admin.jpg',
    alt: 'Presidency University Classroom Instruction & Lecture Hall',
    credit: 'Presidency University Classroom',
    caption: 'Classrooms & Smart Learning Spaces'
  },

  // Transportation Section: Campus shuttle / bus on road, calm daylight composition
  transportation: {
    url: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1920&q=80',
    alt: 'Transit bus on university campus road',
    credit: 'Unsplash - Transit & Fleet',
    caption: 'Campus Fleet & Transit Logistics'
  },

  // Maintenance Section: Clean facilities, infrastructure, technician tools
  maintenance: {
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1920&q=80',
    alt: 'Building infrastructure and maintenance engineering',
    credit: 'Unsplash - Facility Maintenance',
    caption: 'Facilities & Infrastructure Systems'
  },

  // Energy & Sustainability Section: Solar arrays, power grid and sustainable utility
  energy: {
    url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1920&q=80',
    alt: 'Solar array panels and clean power infrastructure',
    credit: 'Unsplash - Clean Energy Grid',
    caption: 'Energy, Solar & Sustainability Command'
  },

  // Attendance Section: Register book, attendance desk, campus check-in
  attendance: {
    url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1920&q=80',
    alt: 'Attendance register and sign-in desk',
    credit: 'Unsplash - Academic Register',
    caption: 'Daily Attendance & Check-in Records'
  },

  // Recommendations / NL Query / Chat Section: Minimal subtle texture for maximum reading comfort
  assistantChat: {
    url: 'https://images.unsplash.com/photo-1518655048521-f130df041f66?auto=format&fit=crop&w=1920&q=80',
    alt: 'Clean neutral study workspace texture',
    credit: 'Unsplash - Minimal Workspace',
    caption: 'Campus Decision Intelligence'
  },

  // Events & Auditorium Section: Presidency University student awards event
  events: {
    url: '/presidency_event_admin.jpg',
    alt: 'Presidency University Event & Student Awards Ceremony',
    credit: 'Presidency University Campus Event',
    caption: 'Auditorium & Event Management Command'
  }
};

export default BACKDROP_IMAGES;
