import Layout from '@/components/layout/Layout';

export default function DWSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout>{children}</Layout>;
}
