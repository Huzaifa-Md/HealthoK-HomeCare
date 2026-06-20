import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Login | Patient Care',
  description: 'Admin dashboard for Patient Care',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
