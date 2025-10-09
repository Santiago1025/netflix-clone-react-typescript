import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { j } from "../utils";
import styles from "../styles/header.module.scss";

const LandingPageHeader = () => {
  const headerRef = useRef<HTMLElement>(null);
  const isLandingPage = useLocation().pathname === "/";
  const navigate = useNavigate();

  const scrollHandler = () => {
    if (headerRef.current && window.scrollY > 30) {
      headerRef.current?.classList.add(styles["header-blur"]);
    } else {
      headerRef.current?.classList.remove(styles["header-blur"]);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, []);

  return (
    <header ref={headerRef} className={styles.header}>
      <div className={styles["nav-left"]}>
        <a href="/" className={styles["nf-logo"]}>
          <img src="/logo.svg" alt="netflix logo" />
        </a>
      </div>
      <div className={styles["nav-right"]}>
        {isLandingPage && (
          <>
            <div className={styles["lang-selector"]}>
              <select defaultValue="english" name="language">
                <option value="english">English</option>
                <option value="spanish">Español</option>
              </select>
            </div>
            <button
              className={styles["sign-in-btn"]}
              onClick={() => navigate("/app/browse")}>
              Sign In
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default LandingPageHeader;