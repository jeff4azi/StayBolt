import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
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

const updateSW = registerSW({
  onOfflineReady() {
    console.log("StayBolt is ready to work offline.");
  },
  onNeedRefresh() {
    console.log("A new version of StayBolt is available.");
  },
});

createRoot(document.getElementById("root")).render(<App />);
