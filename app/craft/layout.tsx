import { Header } from "@/components/layout/header";

export default function WithHeaderLayout({
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