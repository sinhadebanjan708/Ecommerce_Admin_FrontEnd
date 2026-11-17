import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  Link,
  Stack,
  IconButton,
} from '@mui/material';
import {
  EmailOutlined,
  AccessTime,
  Shield,
  Fingerprint,
  ArrowBack,
} from '@mui/icons-material';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../theme';
import { useSelector, useDispatch } from 'react-redux';
import * as actions from "../store/actions";
import { useLocation, useNavigate } from "react-router-dom";


const VerifyPasscode = () => {
//  let 
 const navigate = useNavigate();
  const adminEmail= useSelector((state)=>state.auth.emailId)
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(168); // 02:48 in seconds
  const inputRefs = useRef([]);
  const dispatch = useDispatch();
  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleChange = (index, value) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  console.log('otp send_',otp)

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2,
          py: 4,
          position: 'relative',
        }}
      >

        {/* Logo */}
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            backgroundColor: '#111',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3,
            position: 'relative',
          }}
        >
          <Box
            sx={{
              width: 28,
              height: 28,
              border: '2.5px solid white',
              borderRadius: 1,
              transform: 'rotate(45deg)',
            }}
          />
        </Box>

       

        {/* Title */}
        <Typography variant="h4" align="center" gutterBottom fontWeight={700}>
          Verify Passcode
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ maxWidth: 420, mb: 4 }}
        >
          Enter the 6–digit authorization code dispatched to your
          registered workstation email address.
        </Typography>

        {/* Card */}
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            maxWidth: 440,
            p: 4,
            borderRadius: 4,
            border: '1px solid #e5e7eb',
            boxShadow: '0 10px 40px rgba(0,0,0,0.04)',
          }}
        >
          {/* Authorized Email Box */}
          <Box
            sx={{
              backgroundColor: '#f9fafb',
              borderRadius: 2,
              p: 2,
              mb: 3,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}
          >
            <Box>
              <Typography
                variant="caption"
                fontWeight={600}
                color="text.secondary"
                sx={{ letterSpacing: 0.5 }}
              >
                AUTHORIZED WORKSTATION EMAIL
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                <EmailOutlined sx={{ fontSize: 18, color: 'text.secondary' }} />
                <Box>
                  <Typography variant="body2" fontWeight={600}>
                    valentin.laurent@studioatelier.com
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Lead Curator • Global Editorial
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* OTP Label + Timer */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 1.5,
            }}
          >
            <Typography variant="caption" fontWeight={600} color="text.secondary">
              ONE-TIME PASSCODE
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AccessTime sx={{ fontSize: 16, color: '#ea580c' }} />
              <Typography variant="caption" fontWeight={600} color="#ea580c">
                Expires in {formatTime(timeLeft)}
              </Typography>
            </Box>
          </Box>

          {/* OTP Inputs */}
          <Stack direction="row" spacing={1.2} justifyContent="center" sx={{ mb: 2 }}>
            {otp.map((digit, index) => (
              <Box
                key={index}
                component="input"
                ref={(el) => (inputRefs.current[index] = el)}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                maxLength={1}
                sx={{
                  width: 52,
                  height: 56,
                  textAlign: 'center',
                  fontSize: 22,
                  fontWeight: 600,
                  borderRadius: 2,
                  border: '1.5px solid',
                  borderColor: digit ? '#111' : '#e5e7eb',
                  backgroundColor: digit ? '#fff' : '#f9fafb',
                  outline: 'none',
                  transition: 'all 0.15s',
                  '&:focus': {
                    borderColor: '#111',
                    backgroundColor: '#fff',
                    boxShadow: '0 0 0 3px rgba(0,0,0,0.06)',
                  },
                }}
              />
            ))}
          </Stack>

          {/* Encrypted note + Resend */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
            >
              <Shield sx={{ fontSize: 14 }} />
              Encrypted relay via Cloudflare Turnstile
            </Typography>
            <Link
              href="#"
              underline="hover"
              sx={{ fontSize: 13, fontWeight: 600, color: '#111' }}
            >
              Resend Code
            </Link>
          </Box>

          {/* Verify Button */}
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={async ()=>{
                 const filterOtp = otp.join('');
                if (filterOtp.length < 4) return; // Optional guard for incomplete OTP
                
                const res = await dispatch(actions.verifyLoginotp(adminEmail, filterOtp));
                console.log('res__',res)
                if (res?.success) {
                    navigate('/dashboard'); // `replace: true` prevents going back to OTP screen
                }
            }}
            sx={{
              py: 1.6,
              fontSize: 15,
              backgroundColor: '#111',
              borderRadius: 3,
              '&:hover': { backgroundColor: '#000' },
            }}
          >
            Verify & Launch Console →
          </Button>

          {/* Back Link */}
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Link
              href="#"
              underline="hover"
              onClick={()=>{
                navigate("/")
              }}
              sx={{
                fontSize: 14,
                fontWeight: 500,
                color: 'text.secondary',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              <ArrowBack sx={{ fontSize: 16 }} />
              Back to Primary Sign In
            </Link>
          </Box>
        </Paper>

        {/* Footer Info */}
        <Box sx={{ mt: 4, textAlign: 'center', maxWidth: 480 }}>
          <Typography variant="caption" color="text.secondary" display="block">
            PROD-CLUSTER US-EAST • HARDWARE-BOUND SESSION • SECURE ENCLAVE 256-BIT
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
            Need role elevation or clearance change?{' '}
            <Link href="#" underline="hover" color="primary">
              Contact SecOps Dispatch
            </Link>
          </Typography>
        </Box>

        {/* Bottom Copyright */}
        <Typography
          variant="caption"
          sx={{
            position: 'absolute',
            bottom: 16,
            left: 32,
            color: 'text.secondary',
          }}
        >
          © ATELIER EDITION. ALL RIGHTS RESERVED.
        </Typography>
        <Typography
          variant="caption"
          sx={{
            position: 'absolute',
            bottom: 16,
            right: 32,
            color: 'text.secondary',
          }}
        >
          SECURITY PROTOCOL TLS 1.3
        </Typography>
      </Box>
    </ThemeProvider>
  );
};

export default VerifyPasscode;