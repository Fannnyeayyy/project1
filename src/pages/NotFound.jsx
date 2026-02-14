import React, { useState, useEffect } from "react";

export default function NotFound() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setPosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white opacity-10"
            style={{
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center">
        {/* 404 Number with parallax effect */}
        <div
          className="mb-8 transition-transform duration-300 ease-out"
          style={{
            transform: `translate(${position.x}px, ${position.y}px)`,
          }}
        >
          <h1 className="text-9xl md:text-[200px] font-black text-white opacity-20 select-none">
            404
          </h1>
        </div>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Oops! Page Not Found
            </h2>
            <p className="text-lg md:text-xl text-gray-200 mb-8">
              Looks like you've ventured into the void. The page you're looking
              for doesn't exist.
            </p>

            {/* Animated astronaut or icon */}
            <div className="mb-8">
              <svg
                className="w-32 h-32 mx-auto animate-bounce"
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="100" cy="100" r="80" fill="#fff" opacity="0.2" />
                <circle cx="100" cy="100" r="60" fill="#fff" opacity="0.4" />
                <circle cx="100" cy="100" r="40" fill="#fff" />
                <circle cx="85" cy="90" r="8" fill="#6366f1" />
                <circle cx="115" cy="90" r="8" fill="#6366f1" />
                <path
                  d="M 75 115 Q 100 130 125 115"
                  stroke="#6366f1"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                onClick={() => window.history.back()}
                className="px-8 py-4 bg-white text-purple-900 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                ← Go Back
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className="px-8 py-4 bg-purple-600 text-white rounded-full font-semibold text-lg transition-all duration-300 hover:bg-purple-500 hover:scale-105 hover:shadow-xl border-2 border-white/30"
              >
                Home Page
              </button>
            </div>

            {/* Fun suggestion */}
            <p className="mt-8 text-sm text-gray-300">
              Lost? Try searching or return to safety.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
      `}</style>
    </div>
  );
}
