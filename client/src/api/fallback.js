/**
 * Fallback data when API/server is unavailable.
 * Loads from public/data.json so the app remains functional.
 */

let cachedData = null;

async function loadFallbackData() {
  if (cachedData) return cachedData;
  try {
    const base = import.meta.env.BASE_URL || '/';
    const res = await fetch(`${base}data.json`);
    const json = await res.json();
    cachedData = json;
    return json;
  } catch {
    return { couses: [] };
  }
}

/** Transform data.json classes (note: "couses" typo in source) to app format */
export async function getFallbackClasses() {
  const data = await loadFallbackData();
  const couses = data.couses || data.classes || [];
  return couses.map((c, i) => ({
    ...c,
    _id: c._id || `fallback-${i}`,
    totalEnrolled: c.totalEnrolled ?? 0,
    instructorName: c.instructorName || 'Instructor',
  }));
}

/** Get a single class by id (for fallback ids like fallback-0) */
export async function getFallbackClassById(id) {
  if (!id || !String(id).startsWith('fallback-')) return null;
  const classes = await getFallbackClasses();
  const idx = parseInt(String(id).replace('fallback-', ''), 10);
  return classes[idx] || null;
}

/** Derive instructors from fallback classes */
export async function getFallbackInstructors() {
  const classes = await getFallbackClasses();
  const byEmail = new Map();
  for (const c of classes) {
    const email = c.instructorEmail || `instructor-${c.instructorName?.replace(/\s/g, '')}@demo.com`;
    const existing = byEmail.get(email);
    const enrolled = (c.totalEnrolled || 0);
    if (existing) {
      existing.totalEnrolled = (existing.totalEnrolled || 0) + enrolled;
    } else {
      byEmail.set(email, {
        _id: `fallback-inst-${email}`,
        name: c.instructorName || 'Instructor',
        email,
        photoUrl: '/logo.png',
        totalEnrolled: enrolled,
      });
    }
  }
  return Array.from(byEmail.values());
}
