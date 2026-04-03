import { Header } from "./Header/Header";
import { Footer } from "./Footer/Footer";
import { Outlet } from "react-router-dom";

function RootLayout() {
  return (
    <div className="container">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default RootLayout;
