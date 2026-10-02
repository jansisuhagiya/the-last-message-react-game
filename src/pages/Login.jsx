import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";

export default function Login() {
  const navigate = useNavigate();

  const pageRef = useRef(null);
  const glowRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const formRef = useRef(null);
  const lineRef = useRef(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      gsap.set(
        [
          titleRef.current,
          subtitleRef.current,
          formRef.current,
        ],
        {
          opacity: 0,
          y: 25,
        }
      );

      gsap.set(lineRef.current, {
        scaleX: 0,
        opacity: 0,
      });

      tl.to(pageRef.current, {
        opacity: 1,
        duration: 1.2,
        ease: "power2.out",
      })
        .to(
          lineRef.current,
          {
            scaleX: 1,
            opacity: 1,
            duration: 1.4,
            ease: "power3.inOut",
          },
          "-=0.7"
        )
        .to(
          titleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 1.3,
            ease: "power3.out",
          },
          "-=0.7"
        )
        .to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
          },
          "-=0.7"
        )
        .to(
          formRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
          },
          "-=0.5"
        );

      gsap.to(glowRef.current, {
        scale: 1.15,
        opacity: 0.45,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password.trim()) {
      setError("ENTER YOUR EMAIL AND PASSWORD.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "INVALID CREDENTIALS."
        );

        setLoading(false);
        return;
      }

      // Save authentication
      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // Cinematic exit
      gsap.to(pageRef.current, {
        opacity: 0,
        scale: 1.04,
        filter: "blur(8px)",
        duration: 1.2,
        ease: "power3.inOut",
        onComplete: () => {
          navigate("/game");
        },
      });
    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      setError(
        "THE HOUSE CANNOT BE REACHED."
      );

      setLoading(false);
    }
  };

  const handleRegister = () => {
    gsap.to(pageRef.current, {
      opacity: 0,
      filter: "blur(5px)",
      duration: 0.7,
      ease: "power2.inOut",
      onComplete: () => {
        navigate("/register");
      },
    });
  };

  return (
    <main
      ref={pageRef}
      className="auth-page login-page"
    >
      <div
        ref={glowRef}
        className="auth-glow"
      />

      <div className="auth-noise" />

      <div className="auth-vignette" />

      <div className="auth-frame auth-frame-top" />
      <div className="auth-frame auth-frame-bottom" />

      <section className="login-card">

        <div
          ref={lineRef}
          className="auth-line"
        />

        <div className="login-heading">
          <p className="auth-case">
            CASE FILE 001
          </p>

          <h1 ref={titleRef}>
            THE LAST MESSAGE
          </h1>

          <p
            ref={subtitleRef}
            className="auth-subtitle"
          >
            SOME SECRETS SHOULD NEVER BE FOUND.
          </p>
        </div>

        <form
          ref={formRef}
          className="auth-form"
          onSubmit={handleLogin}
        >
          <div className="auth-field">
            <label htmlFor="login-email">
              IDENTIFICATION
            </label>

            <input
              id="login-email"
              type="email"
              value={email}
              placeholder="EMAIL ADDRESS"
              onChange={(event) =>
                setEmail(event.target.value)
              }
              autoComplete="email"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="login-password">
              ACCESS CODE
            </label>

            <input
              id="login-password"
              type="password"
              value={password}
              placeholder="PASSWORD"
              onChange={(event) =>
                setPassword(event.target.value)
              }
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <button
            className="auth-enter-button"
            type="submit"
            disabled={loading}
          >
            <span>
              {loading
                ? "ENTERING THE HOUSE..."
                : "ENTER THE HOUSE"}
            </span>

            <span className="auth-arrow">
              →
            </span>
          </button>
        </form>

        <div className="auth-register">
          <span>
            NO CASE FILE?
          </span>

          <button
            type="button"
            onClick={handleRegister}
          >
            CREATE ACCOUNT
          </button>
        </div>

        <p className="auth-warning">
          AUTHORIZED PLAYERS ONLY
        </p>

      </section>
    </main>
  );
}