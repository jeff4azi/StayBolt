import { createRoot } from "react-dom/client";
import logo from "./assets/logo.png";
import "./index.css";
import App from "./App";

const setFavicon = (rel, href, type = "image/png", sizes = "any") => {
  let link = document.querySelector(`link[rel="${rel}"]`);
  if (!link) {
    link = document.createElement("link");
    link.rel = rel;
    document.head.appendChild(link);
  }
  link.href = href;
  link.type = type;
  link.sizes = sizes;
};

setFavicon("icon", logo, "image/png", "any");
setFavicon("shortcut icon", logo, "image/png", "any");
setFavicon("apple-touch-icon", logo, "image/png", "180x180");

createRoot(document.getElementById("root")).render(<App />);
