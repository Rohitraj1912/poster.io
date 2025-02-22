import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Switch,
  FormControlLabel,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import DownloadIcon from "@mui/icons-material/Download";
import AddIcon from "@mui/icons-material/Add";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import "./header.css";

const Header = ({ onUndo, onRedo, onDownload, onNewFile }) => {
  const [darkMode, setDarkMode] = useState(false);

  // Toggle Dark Mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Create Theme for Light & Dark Mode
  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: darkMode ? "#424242" : "#1976D2",
      },
      background: {
        default: darkMode ? "#121212" : "#ffffff",
        paper: darkMode ? "#1E1E1E" : "#f5f5f5",
      },
      text: {
        primary: darkMode ? "#ffffff" : "#000000",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" sx={{ background: theme.palette.primary.main, padding: "8px" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          
          {/* Left Section - New File, Undo, Redo */}
          <div className="header-left">
            <Button color="inherit" startIcon={<AddIcon />} onClick={onNewFile}>
              New File
            </Button>

            <IconButton color="inherit" onClick={onUndo}>
              <UndoIcon />
            </IconButton>

            <IconButton color="inherit" onClick={onRedo}>
              <RedoIcon />
            </IconButton>
          </div>

          {/* Center Section - Title */}
          <Typography variant="h6" sx={{ textAlign: "center", flexGrow: 1 }}>
            Poster.io
          </Typography>

          {/* Right Section - Dark Mode Toggle & Download */}
          <div className="header-right">
            <FormControlLabel
              control={
                <Switch
                  checked={darkMode}
                  onChange={toggleDarkMode}
                  color="default"
                />
              }
              label={darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            />

            <Button color="inherit" startIcon={<DownloadIcon />} onClick={onDownload}>
              Download
            </Button>
          </div>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
};

export default Header;
