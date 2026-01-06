import DWSLayout from '@/components/layout/DWSLayout';

export default function DWSRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DWSLayout>{children}</DWSLayout>;
}
