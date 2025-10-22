import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1565c0",
    },
    secondary: {
      main: "#ff6f00",
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
  },
});

export default theme;