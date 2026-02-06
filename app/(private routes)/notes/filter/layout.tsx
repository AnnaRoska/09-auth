  export default function FilterLayout({
  children,
  sidebar,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", gap: 24 }}>
      <aside style={{ width: 120, flexShrink: 0, border: "1px solid red" }}>
        {sidebar}
      </aside>
      <section style={{ flex: 1, border: "1px solid blue" }}>
        {children}
      </section>
    </div>
  );
}