// import { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { loginUser } from "../store/slices/authSlice";

// export default function Login() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { status, error } = useSelector((state) => state.auth);

//   // Demo credentials from dummyjson.com
//   const [form, setForm] = useState({ username: "emilys", password: "emilyspass" });

//   const redirectTo = location.state?.from?.pathname || "/dashboard";

//   const handleChange = (e) =>
//     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const result = await dispatch(loginUser(form));
//     if (loginUser.fulfilled.match(result)) {
//       navigate(redirectTo, { replace: true });
//     }
//   };

//   return (
//     <form className="card" onSubmit={handleSubmit}>
//       <h2>Login</h2>

//       <label>
//         Username
//         <input name="username" value={form.username} onChange={handleChange} required />
//       </label>

//       <label>
//         Password
//         <input
//           type="password"
//           name="password"
//           value={form.password}
//           onChange={handleChange}
//           required
//         />
//       </label>

//       {error && <p className="error">{error}</p>}

//       <button type="submit" disabled={status === "loading"}>
//         {status === "loading" ? "Signing in..." : "Sign in"}
//       </button>
//     </form>
//   );
// }


import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  IconButton,
  Chip,
  Divider,
  Stack,
  Link,
} from '@mui/material';
import {
  LockOutlined,
  Visibility,
  VisibilityOff,
  EmailOutlined,
  VpnKeyOutlined,
  CheckCircle,
} from '@mui/icons-material';
import { useLocation, useNavigate } from "react-router-dom";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../theme';
import { storeEmailId } from "../store/slices/authSlice"
import * as actions from "../store/actions"
import { useDispatch , useSelector } from 'react-redux';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const availbleUser = useSelector((state)=>state.auth.availableUser);
  const [tab, setTab] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [trustDevice, setTrustDevice] = useState(false);
  
  React.useEffect(() => {
    if(availbleUser && availbleUser == "Welcome Admin"){
        navigate("/verify-passcode",)
    }
  }, [availbleUser])
  

  console.log('user-check__',availbleUser)
  

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

        {/* Title */}
        <Typography variant="h4" align="center" gutterBottom>
          Elevora Admin
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ maxWidth: 420, mb: 4 }}
        >
          Sign in to access catalog architecture, inventory matrices, and logistics engines.
        </Typography>

        {/* Login Card */}
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
          {/* Tabs */}
          <Tabs
            value={tab}
            onChange={(e, v) => setTab(v)}
            variant="fullWidth"
            sx={{
              mb: 3,
              '& .MuiTabs-indicator': { display: 'none' },
              backgroundColor: '#f3f4f6',
              borderRadius: 3,
              p: 0.5,
            }}
          >
            <Tab
              icon={<LockOutlined sx={{ fontSize: 18 }} />}
              iconPosition="start"
              label="Email & Password"
              sx={{
                borderRadius: 2.5,
                minHeight: 44,
                fontWeight: 600,
                backgroundColor: tab === 0 ? '#fff' : 'transparent',
                boxShadow: tab === 0 ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}
            />
            <Tab
              icon={<VpnKeyOutlined sx={{ fontSize: 18 }} />}
              iconPosition="start"
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  One-Time Passcode
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      backgroundColor: '#f97316',
                    }}
                  />
                </Box>
              }
              sx={{
                borderRadius: 2.5,
                minHeight: 44,
                fontWeight: 600,
                backgroundColor: tab === 1 ? '#fff' : 'transparent',
                boxShadow: tab === 1 ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}
            />
          </Tabs>

          {/* Email Field */}
          <Box sx={{ mb: 2.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" fontWeight={600} color="text.secondary">
                WORKSTATION EMAIL
              </Typography>
              <Chip
                icon={<CheckCircle sx={{ fontSize: 14 }} />}
                label="Staff Verified"
                size="small"
                color="success"
                variant="outlined"
                sx={{ height: 22, fontSize: 11 }}
              />
            </Box>
            <TextField
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlined fontSize="small" color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <Chip
                    label="CURATOR-L4"
                    size="small"
                    sx={{
                      height: 24,
                      fontSize: 11,
                      fontWeight: 600,
                      backgroundColor: '#f3f4f6',
                    }}
                  />
                ),
              }}
            />
          </Box>

          {/* Password Field */}
    {tab === 0 && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" fontWeight={600} color="text.secondary">
                SECURITY KEY / PASSWORD
              </Typography>
              <Link
                href="#"
                underline="hover"
                sx={{ fontSize: 12, fontWeight: 500, color: '#ea580c' }}
              >
                FORGOT ACCESS KEY?
              </Link>
            </Box>

          <TextField
            fullWidth
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlined fontSize="small" color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          </Box>
)}

          {/* Sign In Button */}
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={()=>{
              // dispatch(actions.checkAvailableUser(email))
              dispatch(actions.checkUserAndSendOTP(email))
              dispatch(storeEmailId(email))
            }}
            sx={{
              py: 1.6,
              fontSize: 15,
              backgroundColor: '#111',
              '&:hover': { backgroundColor: '#000' },
            }}
          >
            Sign In to Admin Console →
          </Button>

          {/* Bottom Status */}
          <Box
            sx={{
              mt: 3,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="caption" color="text.secondary">
              🛡 Zero-Trust Session Inspection Active
            </Typography>
            <Chip
              label="COMPLIANT"
              size="small"
              sx={{
                height: 22,
                fontSize: 11,
                fontWeight: 700,
                backgroundColor: '#dcfce7',
                color: '#166534',
              }}
            />
          </Box>
        </Paper>

        {/* Footer Info */}
        <Box sx={{ mt: 4, textAlign: 'center', maxWidth: 480 }}>
          <Typography variant="caption" color="text.secondary" display="block">
            ● PRODUCTION CLUSTER US-EAST • BUILD #8942-ALPHA • MUTUAL TLS ENCRYPTED
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
            All login events are permanently recorded into the immutable Atelier compliance vault
            with hardware-bound fingerprinting. Unscheduled breaches trigger auto-quarantine.
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Need role elevation or clearance?{' '}
            <Link href="#" underline="hover" color="primary">
              Contact SecOps
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

export default LoginPage;
