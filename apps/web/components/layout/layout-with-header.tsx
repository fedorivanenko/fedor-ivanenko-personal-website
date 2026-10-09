import Footer from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export function WithHeaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-x-1 px-5 pt-16 lg:grid lg:grid-cols-[auto_var(--content-width)_auto] lg:pt-32">
        <Header />
        {children}
      </div>
      <Footer />
    </>
  );
}
