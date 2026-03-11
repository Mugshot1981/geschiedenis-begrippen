/*
KennisSprint dataset
© Joas de Wit
2026
*/
import { courseCatalog } from "./js/data/courseCatalog.js";

export { courseCatalog };

const defaultCourseId = "geschiedenis-mavo-4";

export function getCourseById(courseId) {
  return courseCatalog.find((course) => course.id === courseId);
}

export function getCourseIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("course");
}

export function hasMinimumQuizContent(course) {
  if (!course) return false;

  const termCount =
    Array.isArray(course.datasets?.terms) ? course.datasets.terms.length :
    Array.isArray(course.items) ? course.items.length :
    0;

  const yearCount =
    Array.isArray(course.datasets?.years) ? course.datasets.years.length :
    Array.isArray(course.years) ? course.years.length :
    0;

  return termCount >= 4 || yearCount >= 4;
}

export function getInitialCourse() {
  const courseIdFromUrl = getCourseIdFromUrl();
  const courseFromUrl = getCourseById(courseIdFromUrl);

if (courseFromUrl) {
  return courseFromUrl;
}

return getCourseById(defaultCourseId);

  return getCourseById(defaultCourseId);
}

export const activeCourse = getInitialCourse();
