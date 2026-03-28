export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface Event {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  image: string | null;
  start_date: string;
  end_date: string;
  location: string;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string | null;
  category: Category | null;
  author_name: string;
  status: 'draft' | 'published';
  published_at: string | null;
  created_at: string;
}

export interface Page {
  id: number;
  title: string;
  slug: string;
  content: string;
  meta_title: string;
  meta_description: string;
  is_published: boolean;
  order: number;
}

export interface Employee {
  id: number;
  name: string;
  title: string;
  description: string;
  photo: string | null;
  order: number;
  is_active: boolean;
}

export interface TeamMember {
  id: number;
  employee: Employee;
  order: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
