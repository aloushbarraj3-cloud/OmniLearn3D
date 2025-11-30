import { Subject, SubjectType, Branch } from './types';
import { Microscope, FlaskConical, Calculator, Atom, Rocket } from 'lucide-react';

// Helper to generate generic branches
const createBranches = (prefix: string, names: string[]): Branch[] => {
  return names.map((name, index) => ({
    id: `${prefix}-${name.replace(/\s+/g, '-').toUpperCase()}`,
    name,
    description: `Comprehensive study of ${name}`,
    totalLessons: 100 // As per MVP spec
  }));
};

export const SUBJECTS: Subject[] = [
  {
    id: SubjectType.BIOLOGY,
    name: "Biology",
    icon: "Microscope",
    color: "bg-emerald-500",
    description: "Explore the science of life, from cells to ecosystems.",
    branches: createBranches('BIO', [
      "Cell Biology", "Molecular Biology", "Genetics", "Microbiology",
      "Anatomy & Physiology", "Botany", "Zoology", "Ecology",
      "Evolutionary Biology", "Biochemistry"
    ])
  },
  {
    id: SubjectType.CHEMISTRY,
    name: "Chemistry",
    icon: "FlaskConical",
    color: "bg-blue-500",
    description: "Understand matter, reactions, and the building blocks of the universe.",
    branches: createBranches('CHEM', [
      "Organic Chemistry", "Inorganic Chemistry", "Physical Chemistry",
      "Analytical Chemistry", "Biochemistry", "Environmental Chemistry",
      "Nuclear Chemistry", "Industrial Chemistry", "Polymer Chemistry",
      "Theoretical Chemistry"
    ])
  },
  {
    id: SubjectType.MATHEMATICS,
    name: "Mathematics",
    icon: "Calculator",
    color: "bg-red-500",
    description: "Master the language of logic, numbers, and space.",
    branches: createBranches('MATH', [
      "Algebra", "Geometry", "Calculus", "Statistics & Probability", "Number Theory"
    ]).map(b => ({ ...b, totalLessons: 200 }))
  },
  {
    id: SubjectType.PHYSICS,
    name: "Physics",
    icon: "Atom",
    color: "bg-violet-500",
    description: "Unravel the laws of motion, energy, and the fabric of reality.",
    branches: createBranches('PHYS', [
      "Classical Mechanics", "Electromagnetism", "Thermodynamics",
      "Quantum Physics", "Nuclear Physics", "Optics", "Fluid Mechanics",
      "Relativity", "Astrophysics", "Particle Physics"
    ])
  },
  {
    id: SubjectType.ASTRONOMY,
    name: "Astronomy",
    icon: "Rocket",
    color: "bg-indigo-900",
    description: "Journey through the cosmos, stars, and galaxies.",
    branches: createBranches('ASTRO', [
      "Planetary Science", "Stellar Astronomy", "Galactic Astronomy",
      "Cosmology", "Astrobiology", "Observational Astronomy",
      "Radio Astronomy", "High-Energy Astronomy", "Space Exploration",
      "Infrared/Optical Astronomy"
    ])
  }
];