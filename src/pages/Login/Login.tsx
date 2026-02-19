import { useState, useEffect, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { getFromLocalStorage } from "../../utils/localStorage";
import "./Login.scss";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    const auth = getFromLocalStorage<{ isAuthenticated: boolean }>("lendsqr_auth");
    if (auth?.isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    localStorage.setItem(
      "lendsqr_auth",
      JSON.stringify({ email, isAuthenticated: true })
    );

    navigate("/dashboard");
  };

  return (
    <div className="login-page">
      {/* ---- LEFT SIDE ---- */}
      <div className="login-page__left">
        {/* Lendsqr Logo */}
        <div className="login-page__logo">
          <svg
            width="173"
            height="36"
            viewBox="0 0 173 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g>
              {/* Union icon */}
              <path
                d="M17.44 0C7.808 0 0 7.808 0 17.44c0 5.663 2.705 10.69 6.89 13.882l3.528-6.108a8.72 8.72 0 0 1-2.698-6.334c0-4.836 3.924-8.76 8.76-8.76a8.72 8.72 0 0 1 6.335 2.698l6.107-3.528C25.43 4.505 21.803 1.8 17.44 0z"
                fill="#213F7D"
              />
              <path
                d="M17.44 26.16c-4.836 0-8.76-3.924-8.76-8.76 0-1.513.392-2.935 1.072-4.178l-6.107-3.528A17.28 17.28 0 0 0 0 17.44c0 9.632 7.808 17.44 17.44 17.44 2.683 0 5.224-.612 7.498-1.694l-3.528-6.108a8.67 8.67 0 0 1-3.97.922z"
                fill="#39CDCC"
              />
            </g>
            {/* "lendsqr" text */}
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

        {/* Sign-in Illustration */}
        <div className="login-page__illustration">
          <svg
            width="600"
            height="340"
            viewBox="0 0 600 340"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Floor / ground line */}
            <ellipse cx="300" cy="320" rx="260" ry="12" fill="#E8E3F3" />

            {/* Desk */}
            <rect x="140" y="200" width="240" height="10" rx="3" fill="#344E7D" />
            <rect x="160" y="210" width="8" height="108" rx="2" fill="#344E7D" />
            <rect x="352" y="210" width="8" height="108" rx="2" fill="#344E7D" />

            {/* Laptop base */}
            <rect x="195" y="170" width="130" height="30" rx="4" fill="#545F7D" />
            {/* Laptop screen */}
            <rect x="200" y="105" width="120" height="68" rx="4" fill="#213F7D" />
            {/* Screen content */}
            <rect x="210" y="115" width="100" height="48" rx="2" fill="#39CDCC" opacity="0.3" />
            <rect x="220" y="125" width="40" height="4" rx="2" fill="#FFFFFF" opacity="0.8" />
            <rect x="220" y="133" width="60" height="4" rx="2" fill="#FFFFFF" opacity="0.6" />
            <rect x="220" y="141" width="30" height="4" rx="2" fill="#FFFFFF" opacity="0.4" />
            {/* Screen glow */}
            <rect x="210" y="115" width="100" height="48" rx="2" fill="#39CDCC" opacity="0.08" />

            {/* Person - body */}
            {/* Head */}
            <circle cx="380" cy="100" r="28" fill="#F2C09E" />
            {/* Hair */}
            <path
              d="M352 90c0-18 12-32 28-32s28 14 28 32c0 2-1 4-2 5 1-8-5-22-26-22s-27 14-26 22c-1-1-2-3-2-5z"
              fill="#213F7D"
            />
            {/* Eyes */}
            <circle cx="372" cy="100" r="2.5" fill="#213F7D" />
            <circle cx="390" cy="100" r="2.5" fill="#213F7D" />
            {/* Mouth */}
            <path
              d="M376 110c2 3 6 3 8 0"
              stroke="#C08E76"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />

            {/* Torso / shirt */}
            <path
              d="M355 135c0-8 11-14 25-14s25 6 25 14l5 65h-60l5-65z"
              fill="#39CDCC"
            />
            {/* Collar detail */}
            <path
              d="M370 121l10 10 10-10"
              stroke="#2DB5B5"
              strokeWidth="2"
              fill="none"
            />

            {/* Left arm reaching to laptop */}
            <path
              d="M355 140c-15 8-30 25-40 55l-5 5"
              stroke="#F2C09E"
              strokeWidth="14"
              strokeLinecap="round"
              fill="none"
            />
            {/* Left hand on keyboard */}
            <circle cx="308" cy="198" r="8" fill="#F2C09E" />

            {/* Right arm */}
            <path
              d="M405 140c10 10 15 30 12 50"
              stroke="#F2C09E"
              strokeWidth="14"
              strokeLinecap="round"
              fill="none"
            />
            {/* Right hand */}
            <circle cx="416" cy="190" r="8" fill="#F2C09E" />

            {/* Chair */}
            <rect x="355" y="200" width="50" height="8" rx="4" fill="#213F7D" />
            <rect x="375" y="208" width="10" height="30" rx="2" fill="#344E7D" />
            <rect x="360" y="238" width="40" height="6" rx="3" fill="#344E7D" />
            {/* Chair wheels */}
            <circle cx="365" cy="248" r="5" fill="#545F7D" />
            <circle cx="395" cy="248" r="5" fill="#545F7D" />

            {/* Legs */}
            <path
              d="M365 200l-10 70"
              stroke="#213F7D"
              strokeWidth="12"
              strokeLinecap="round"
            />
            <path
              d="M395 200l10 70"
              stroke="#213F7D"
              strokeWidth="12"
              strokeLinecap="round"
            />
            {/* Shoes */}
            <ellipse cx="353" cy="273" rx="12" ry="6" fill="#344E7D" />
            <ellipse cx="407" cy="273" rx="12" ry="6" fill="#344E7D" />

            {/* Floating elements - decorative */}
            {/* Teal circle */}
            <circle cx="100" cy="80" r="18" fill="#39CDCC" opacity="0.2" />
            <circle cx="100" cy="80" r="8" fill="#39CDCC" opacity="0.4" />
            {/* Blue circle */}
            <circle cx="500" cy="60" r="14" fill="#213F7D" opacity="0.15" />
            {/* Small dots */}
            <circle cx="80" cy="200" r="4" fill="#39CDCC" opacity="0.3" />
            <circle cx="520" cy="150" r="5" fill="#213F7D" opacity="0.2" />
            <circle cx="130" cy="280" r="3" fill="#39CDCC" opacity="0.25" />
            <circle cx="490" cy="250" r="6" fill="#213F7D" opacity="0.12" />

            {/* Login form mockup on screen */}
            <rect x="230" y="120" width="50" height="6" rx="3" fill="#FFFFFF" opacity="0.5" />
            {/* Cursor blink */}
            <rect x="280" y="120" width="2" height="6" fill="#FFFFFF" opacity="0.7" />

            {/* Plant pot */}
            <rect x="460" y="280" width="30" height="35" rx="3" fill="#C08E76" />
            <path
              d="M468 280c-3-20 3-40 8-50 2 12 12 30 18 50h-26z"
              fill="#39CDCC"
              opacity="0.6"
            />
            <path
              d="M478 280c2-25 8-35 12-42-1 10-2 28 0 42h-12z"
              fill="#39CDCC"
              opacity="0.8"
            />
          </svg>
        </div>
      </div>

      {/* ---- RIGHT SIDE ---- */}
      <div className="login-page__right">
        <div className="login-page__form-wrapper">
          {/* Mobile logo – visible only when left panel is hidden */}
          <div className="login-page__mobile-logo">
            <svg
              width="173"
              height="36"
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
          <h1 className="login-page__heading">Welcome!</h1>
          <p className="login-page__subtitle">Enter details to login.</p>

          <form className="login-page__form" onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="login-page__field">
              <input
                type="email"
                className={`login-page__input ${errors.email ? "login-page__input--error" : ""}`}
                placeholder="Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
              />
              {errors.email && (
                <span className="login-page__error">{errors.email}</span>
              )}
            </div>

            {/* Password */}
            <div className="login-page__field">
              <div className="login-page__password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`login-page__input ${errors.password ? "login-page__input--error" : ""}`}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password)
                      setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                />
                <button
                  type="button"
                  className="login-page__show-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "HIDE" : "SHOW"}
                </button>
              </div>
              {errors.password && (
                <span className="login-page__error">{errors.password}</span>
              )}
            </div>

            {/* Forgot Password */}
            <a href="#" className="login-page__forgot">
              FORGOT PASSWORD?
            </a>

            {/* Submit */}
            <button type="submit" className="login-page__submit">
              LOG IN
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
