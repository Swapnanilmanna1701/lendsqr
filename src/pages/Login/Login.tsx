import { useState, useEffect, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { getFromLocalStorage } from "../../utils/localStorage";
import signInIllustration from "../../assets/images/sign-in-illustration.png";
import logo from "../../assets/images/logo.png";
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
          <img src={logo} alt="Lendsqr logo" />
        </div>

        {/* Sign-in Illustration */}
        <div className="login-page__illustration">
          <img
            src={signInIllustration}
            alt="Sign in illustration"
          />
        </div>
      </div>

      {/* ---- RIGHT SIDE ---- */}
      <div className="login-page__right">
        <div className="login-page__form-wrapper">
          {/* Mobile logo – visible only when left panel is hidden */}
          <div className="login-page__mobile-logo">
            <img src={logo} alt="Lendsqr logo" />
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
