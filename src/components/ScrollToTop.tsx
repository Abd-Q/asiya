import { useState, useEffect } from "react";
export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const h = () => setVisible(window.scrollY > 400); window.addEventListener("scroll", h, { passive: true }); return () => window.removeEventListener("scroll", h); }, []);
  if (!visible) return null;
  return <><button className="scroll-top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>↑</button><style>{`.scroll-top{position:fixed;right:22px;bottom:22px;z-index:30;width:46px;height:46px;border-radius:50%;background:var(--olive);color:white;box-shadow:var(--soft)}`}</style></>;
}
