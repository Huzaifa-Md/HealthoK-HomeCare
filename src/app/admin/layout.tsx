import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Login | PrickCare',
  description: 'Admin dashboard for PrickCare',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
