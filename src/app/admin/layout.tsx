import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Login | Health oK Home Care',
  description: 'Admin dashboard for Health oK Home Care Services',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
