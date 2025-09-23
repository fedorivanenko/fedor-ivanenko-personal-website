export default function Footer() {
  return (
    <div className="flex flex-col sm:flex-row gap-1.5 w-[calc(100%+0.375rem)] -translate-x-1.5 text-sm text-border sm:items-center mt-auto relative">
      <span className="ml-auto">{new Date().getFullYear()} © fedor.studio</span>
    </div>
  );
}
