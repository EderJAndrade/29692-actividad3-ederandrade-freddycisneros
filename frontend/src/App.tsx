import { AppBar, Box, Button, Container, Toolbar, Typography } from "@mui/material";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import AuthorsPage from "./pages/AuthorsPage";
import PublicationsPage from "./pages/PublicationsPage";

export default function App() {
  const location = useLocation();
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fafafa" }}>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Editorial: Autores & Publicaciones
          </Typography>
          <Button
            color="inherit"
            component={Link}
            to="/"
            sx={{ opacity: location.pathname === "/" ? 1 : 0.85 }}
          >
            Autores
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/publications"
            sx={{ opacity: location.pathname === "/publications" ? 1 : 0.85 }}
          >
            Publicaciones
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 3 }}>
        <Routes>
          <Route path="/" element={<AuthorsPage />} />
          <Route path="/publications" element={<PublicationsPage />} />
        </Routes>
      </Container>
    </Box>
  );
}
