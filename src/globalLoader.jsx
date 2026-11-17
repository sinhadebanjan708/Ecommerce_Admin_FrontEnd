
import React from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Fade,
} from "@mui/material";
import { keyframes } from "@mui/system";
import { useSelector } from "react-redux";

// Pulsing dots animation
const pulseAnimation = keyframes`
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.4;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
`;

// Background glow animation
const glowAnimation = keyframes`
  0%, 100% {
    opacity: 0.3;
    transform: scale(0.9);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
`;

export default function GlobalLoader({ contained = false }) {

  const loading = useSelector(
    (state) => state.global?.globalloader?.loading || false
  );

  if (!loading) return null;

  // Loader colors
  const primary = "#6366F1";
  const secondary = "#06B6D4";

  return (
    <Fade in={loading} timeout={300}>
      <Box
        sx={{
          position: contained ? "absolute" : "fixed",
          inset: 0,
          zIndex: contained ? 10 : 9999,

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          background: "rgba(15, 23, 42, 0.45)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        }}
      >
        {/* SVG Gradient */}
        <svg width="0" height="0">
          <defs>
            <linearGradient
              id="global-loader-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor={primary} />
              <stop offset="100%" stopColor={secondary} />
            </linearGradient>
          </defs>
        </svg>

        {/* Loader Card */}
        <Box
          sx={{
            position: "relative",
            minWidth: 290,
            px: 5,
            py: 4.5,

            borderRadius: "24px",
            overflow: "hidden",

            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,

            background: "#FFFFFF",
            border: "1px solid rgba(226, 232, 240, 0.8)",

            boxShadow:
              "0 20px 65px rgba(0, 0, 0, 0.20)",
          }}
        >

          {/* Background Glow */}
          <Box
            sx={{
              position: "absolute",
              top: -90,
              left: "50%",
              transform: "translateX(-50%)",

              width: 200,
              height: 200,
              borderRadius: "50%",

              background: `radial-gradient(
                circle,
                ${primary}25,
                transparent 70%
              )`,

              animation: `${glowAnimation} 3s ease-in-out infinite`,
              pointerEvents: "none",
            }}
          />

          {/* Spinner */}
          <Box
            sx={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 85,
              height: 85,
            }}
          >
            <CircularProgress
              size={75}
              thickness={3.5}
              sx={{
                position: "absolute",
                color: primary,

                "& .MuiCircularProgress-circle": {
                  stroke: "url(#global-loader-gradient)",
                  strokeLinecap: "round",
                },
              }}
            />

            {/* Center Dot */}
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",

                background: `linear-gradient(
                  135deg,
                  ${primary},
                  ${secondary}
                )`,

                boxShadow: `0 0 20px ${primary}80`,
              }}
            />
          </Box>

          {/* Loading Text */}
          <Box
            sx={{
              textAlign: "center",
              mt: 1,
            }}
          >
            <Typography
              sx={{
                fontSize: "1.15rem",
                fontWeight: 700,
                color: "#1E293B",
                letterSpacing: "-0.4px",
              }}
            >
              Please Wait
            </Typography>

            <Typography
              sx={{
                fontSize: "0.85rem",
                mt: 0.7,
                color: "#64748B",
              }}
            >
              Processing your request...
            </Typography>
          </Box>

          {/* Animated Dots */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.7,
              mt: 0.5,
            }}
          >
            {[0, 1, 2].map((item) => (
              <Box
                key={item}
                sx={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: primary,

                  animation: `${pulseAnimation} 1.4s infinite ease-in-out`,
                  animationDelay: `${item * 0.2}s`,
                }}
              />
            ))}
          </Box>

        </Box>
      </Box>
    </Fade>
  );
}
