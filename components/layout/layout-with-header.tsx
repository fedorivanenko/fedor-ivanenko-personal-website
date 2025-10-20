import { Header } from "@/components/layout/header";

export function WithHeaderLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <>
        <Header />
        {children}
      </>
    );
  }