export default async function Layout({
  params: { id },
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  return <>{children}</>;
}
