/**
 * Typed résumé content model.
 * Pure data types — no rendering or 3D concerns (Single Responsibility).
 * Any presenter (HTML, WebGL, JSON-LD) consumes these through the ContentRepository interface.
 */

export type SectionId =
  | 'home'
  | 'about'
  | 'experience'
  | 'projects'
  | 'skills'
  | 'leadership'
  | 'contact'

export interface DateRange {
  /** ISO-like "YYYY-MM" */
  readonly start: string
  /** ISO-like "YYYY-MM" or null when ongoing */
  readonly end: string | null
  /** Human label, e.g. "Jun 2025 – Present" */
  readonly label: string
}

export interface Profile {
  readonly fullName: string
  readonly firstName: string
  readonly title: string
  readonly tagline: string
  readonly summary: string
  readonly location: string
  readonly avatarInitials: string
}

export interface ContactChannel {
  readonly id: 'email' | 'phone' | 'linkedin' | 'resume' | 'github'
  readonly label: string
  readonly value: string
  readonly href: string
  readonly external: boolean
}

export interface ExperienceRole {
  readonly id: string
  readonly company: string
  readonly role: string
  readonly location: string
  readonly period: DateRange
  readonly highlights: readonly string[]
  readonly tech: readonly string[]
}

export interface Project {
  readonly id: string
  readonly name: string
  readonly category: string
  readonly summary: string
  readonly highlights: readonly string[]
  readonly tech: readonly string[]
}

export interface SkillGroup {
  readonly id: string
  readonly name: string
  readonly skills: readonly string[]
}

export interface EducationEntry {
  readonly id: string
  readonly institution: string
  readonly degree: string
  readonly year: string
  readonly score: string
  readonly coursework?: readonly string[]
}

export interface LeadershipEntry {
  readonly id: string
  readonly organisation: string
  readonly role: string
  readonly period: DateRange
  readonly highlights: readonly string[]
}

export interface ResumeContent {
  readonly profile: Profile
  readonly contacts: readonly ContactChannel[]
  readonly experience: readonly ExperienceRole[]
  readonly projects: readonly Project[]
  readonly skills: readonly SkillGroup[]
  readonly education: readonly EducationEntry[]
  readonly leadership: readonly LeadershipEntry[]
}

/** Read-only access to content. Swappable (static TS, JSON, CMS) without touching consumers (Dependency Inversion). */
export interface ContentRepository {
  getResume(): ResumeContent
}
