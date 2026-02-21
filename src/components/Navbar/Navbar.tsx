import { useState, useMemo } from "react";
import { getFromLocalStorage } from "../../utils/localStorage";
import { useSearch } from "../../contexts/SearchContext";
import "./Navbar.scss";

interface NavbarProps {
  onMenuToggle: () => void;
}

const Navbar = ({ onMenuToggle }: NavbarProps) => {
  const { searchQuery, setSearchQuery } = useSearch();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const displayName = useMemo(() => {
    const auth = getFromLocalStorage<{ email: string }>("lendsqr_auth");
    if (!auth?.email) return "User";
    // Extract the part before '@' and capitalise the first letter
    const name = auth.email.split("@")[0].replace(/[._-]/g, " ");
    return name.charAt(0).toUpperCase() + name.slice(1);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar__left">
        <button
          className="navbar__hamburger"
          onClick={onMenuToggle}
          aria-label="Toggle menu"
        >
          <svg
            width="20"
            height="14"
            viewBox="0 0 20 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 0H20V2H0V0Z" fill="#213F7D" />
            <path d="M0 6H20V8H0V6Z" fill="#213F7D" />
            <path d="M0 12H20V14H0V12Z" fill="#213F7D" />
          </svg>
        </button>

        <div className="navbar__logo">
          <svg
            width="145"
            height="30"
            viewBox="0 0 173 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g>
              <path
                d="M17.44 0C7.808 0 0 7.808 0 17.44c0 5.663 2.705 10.69 6.89 13.882l3.528-6.108a8.72 8.72 0 0 1-2.698-6.334c0-4.836 3.924-8.76 8.76-8.76a8.72 8.72 0 0 1 6.335 2.698l6.107-3.528C25.43 4.505 21.803 1.8 17.44 0z"
                fill="#213F7D"
              />
              <path
                d="M17.44 26.16c-4.836 0-8.76-3.924-8.76-8.76 0-1.513.392-2.935 1.072-4.178l-6.107-3.528A17.28 17.28 0 0 0 0 17.44c0 9.632 7.808 17.44 17.44 17.44 2.683 0 5.224-.612 7.498-1.694l-3.528-6.108a8.67 8.67 0 0 1-3.97.922z"
                fill="#39CDCC"
              />
            </g>
            <text
              x="42"
              y="27"
              fontFamily="'Work Sans', sans-serif"
              fontSize="28"
              fontWeight="700"
              fill="#213F7D"
            >
              lendsqr
            </text>
          </svg>
        </div>
      </div>

      <div className="navbar__search">
        <input
          type="text"
          className="navbar__search-input"
          placeholder="Search for anything"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="navbar__search-btn" type="button" aria-label="Search">
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.3837 0C2.41095 0 0 2.41095 0 5.3837C0 8.35645 2.41095 10.7674 5.3837 10.7674C6.5898 10.7674 7.70463 10.3839 8.61653 9.73811L12.0386 13.1602C12.348 13.4468 12.8263 13.4365 13.1234 13.137C13.4087 12.8494 13.4087 12.3899 13.1234 12.1023L9.73811 8.61653C10.3839 7.70463 10.7674 6.5898 10.7674 5.3837C10.7674 2.41095 8.35645 0 5.3837 0ZM5.3837 1.49547C7.53702 1.49547 9.27193 3.23038 9.27193 5.3837C9.27193 7.53702 7.53702 9.27193 5.3837 9.27193C3.23038 9.27193 1.49547 7.53702 1.49547 5.3837C1.49547 3.23038 3.23038 1.49547 5.3837 1.49547Z"
              fill="white"
            />
          </svg>
        </button>
      </div>

      <div className="navbar__right">
        {/* Mobile search toggle button */}
        <button
          className="navbar__mobile-search-toggle"
          onClick={() => setMobileSearchOpen((prev) => !prev)}
          aria-label="Toggle search"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.3837 0C2.41095 0 0 2.41095 0 5.3837C0 8.35645 2.41095 10.7674 5.3837 10.7674C6.5898 10.7674 7.70463 10.3839 8.61653 9.73811L12.0386 13.1602C12.348 13.4468 12.8263 13.4365 13.1234 13.137C13.4087 12.8494 13.4087 12.3899 13.1234 12.1023L9.73811 8.61653C10.3839 7.70463 10.7674 6.5898 10.7674 5.3837C10.7674 2.41095 8.35645 0 5.3837 0ZM5.3837 1.49547C7.53702 1.49547 9.27193 3.23038 9.27193 5.3837C9.27193 7.53702 7.53702 9.27193 5.3837 9.27193C3.23038 9.27193 1.49547 7.53702 1.49547 5.3837C1.49547 3.23038 3.23038 1.49547 5.3837 1.49547Z"
              fill="#213F7D"
            />
          </svg>
        </button>

        <a href="#" className="navbar__docs">
          Docs
        </a>

        <button className="navbar__notification" aria-label="Notifications">
          <svg
            width="22"
            height="24"
            viewBox="0 0 22 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.3333 8.66669C17.3333 6.89858 16.631 5.20288 15.3807 3.95264C14.1305 2.7024 12.4348 2.00002 10.6667 2.00002C8.89856 2.00002 7.20286 2.7024 5.95262 3.95264C4.70238 5.20288 4 6.89858 4 8.66669C4 16.0834 0.666687 18.0834 0.666687 18.0834H20.6667C20.6667 18.0834 17.3333 16.0834 17.3333 8.66669Z"
              stroke="#213F7D"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12.5833 21.4167C12.3852 21.7594 12.1001 22.0437 11.7569 22.2409C11.4136 22.4381 11.0241 22.5415 10.6278 22.5402C10.2314 22.5389 9.84261 22.433 9.50062 22.2335C9.15864 22.0341 8.87548 21.7479 8.67969 21.4039"
              stroke="#213F7D"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="navbar__user">
          <div className="navbar__avatar">
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`}
              alt="User avatar"
            />
          </div>
          <span className="navbar__username">{displayName}</span>
          <svg
            className="navbar__caret"
            width="12"
            height="8"
            viewBox="0 0 12 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 1.5L6 6.5L11 1.5"
              stroke="#213F7D"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Mobile search dropdown */}
      {mobileSearchOpen && (
        <div className="navbar__mobile-search">
          <input
            type="text"
            className="navbar__mobile-search-input"
            placeholder="Search for anything"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          <button className="navbar__mobile-search-btn" aria-label="Search">
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.3837 0C2.41095 0 0 2.41095 0 5.3837C0 8.35645 2.41095 10.7674 5.3837 10.7674C6.5898 10.7674 7.70463 10.3839 8.61653 9.73811L12.0386 13.1602C12.348 13.4468 12.8263 13.4365 13.1234 13.137C13.4087 12.8494 13.4087 12.3899 13.1234 12.1023L9.73811 8.61653C10.3839 7.70463 10.7674 6.5898 10.7674 5.3837C10.7674 2.41095 8.35645 0 5.3837 0ZM5.3837 1.49547C7.53702 1.49547 9.27193 3.23038 9.27193 5.3837C9.27193 7.53702 7.53702 9.27193 5.3837 9.27193C3.23038 9.27193 1.49547 7.53702 1.49547 5.3837C1.49547 3.23038 3.23038 1.49547 5.3837 1.49547Z"
                fill="white"
              />
            </svg>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
