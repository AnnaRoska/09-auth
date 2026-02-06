import TanStackProvider from "./components/TanStackProvider/TanStackProvider";
import AuthProvider from "./components/AuthProvider/AuthProvider";
import Header from "./components/Header/Header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <TanStackProvider>
          <AuthProvider>
            {/* <Header /> */}

            {children}

            {/* <footer>© NoteHub*********</footer> */}
          </AuthProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}