import { I18nProvider } from "./i18n";
import { RouterProvider, useRouter } from "./context/RouterContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import WhyPage from "./pages/WhyPage";
import CatalogPage from "./pages/CatalogPage";
import ProductPage from "./pages/ProductPage";
import NewsPage from "./pages/NewsPage";
import NewsDetailPage from "./pages/NewsDetailPage";
import ContactsPage from "./pages/ContactsPage";

function AppContent() {
  const { page } = useRouter();
  return (
      <>
          <link href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" rel="stylesheet"/>
          <Header/>
          <main className="app-main">
              {page === "home" && <HomePage/>}
              {page === "about" && <AboutPage/>}
              {page === "why" && <WhyPage/>}
              {page === "catalog" && <CatalogPage/>}
              {page === "product" && <ProductPage/>}
              {page === "news" && <NewsPage/>}
              {page === "newsDetail" && <NewsDetailPage/>}
              {page === "contacts" && <ContactsPage/>}
          </main>
          <Footer/>
          <ScrollToTop/>
          <style>{`
        .app-main{min-height:100vh;overflow:hidden}
      `}</style>
      </>
  );
}

export default function App() {
    return (
        <I18nProvider>
            <RouterProvider>
            <AppContent />
      </RouterProvider>
    </I18nProvider>
  );
}
