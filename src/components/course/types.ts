export type CoursePageData = {
  title: string;
  tagline: string;
  overview: string;
  level: string;
  deliveryMode: string;
  formatLabel: string;
  duration: string;
  infoBanner?: string;
  video?: { title: string; url: string };
  learningOutcomes: string[];
  audience: string[];
  prerequisites: string[];
  languages: string[];
  examAlignment?: string;
  syllabus?: { title: string; bullets: string[] }[];
  faqs?: { q: string; a: string }[];
  relatedCourses?: { title: string; url: string }[];
};