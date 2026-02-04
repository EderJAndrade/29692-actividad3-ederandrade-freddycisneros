import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { authorsApi } from "../api/http";

type Author = {
  id: number;
  name: string;
  email: string;
  authorType: string;
  penName?: string | null;
  createdAt: string;
  updatedAt: string;
};

export default function AuthorsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [penName, setPenName] = useState("");
  const [authors, setAuthors] = useState<Author[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const canSubmit = useMemo(() => name.trim().length >= 2 && email.includes("@"), [name, email]);

  async function load() {
    setError(null);
    const res = await authorsApi.get("/authors?page=1&limit=20");
    setAuthors(res.data.data);
  }

  useEffect(() => {
    load().catch((e) => setError(e?.response?.data?.error ?? "Error cargando autores"));
  }, []);

  async function createAuthor() {
    setError(null);
    setOk(null);
    try {
      const res = await authorsApi.post("/authors", {
        name,
        email,
        ...(penName.trim() ? { penName } : {}),
      });
      setOk(`Autor creado: #${res.data.id}`);
      setName("");
      setEmail("");
      setPenName("");
      await load();
    } catch (e: any) {
      setError(e?.response?.data?.error ?? "Error creando autor");
    }
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={5}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Crear autor
            </Typography>

            {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}
            {ok ? <Alert severity="success" sx={{ mb: 2 }}>{ok}</Alert> : null}

            <TextField fullWidth label="Nombre" value={name} onChange={(e) => setName(e.target.value)} sx={{ mb: 2 }} />
            <TextField fullWidth label="Email" value={email} onChange={(e) => setEmail(e.target.value)} sx={{ mb: 2 }} />
            <TextField fullWidth label="Nombre de pluma (opcional)" value={penName} onChange={(e) => setPenName(e.target.value)} sx={{ mb: 2 }} />

            <Button variant="contained" onClick={createAuthor} disabled={!canSubmit}>
              Guardar
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={7}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
              <Typography variant="h6">Autores</Typography>
              <Button variant="outlined" onClick={() => load().catch(() => setError("Error recargando"))}>
                Recargar
              </Button>
            </Box>

            {authors.length === 0 ? (
              <Typography color="text.secondary">No hay autores aún.</Typography>
            ) : (
              <Box component="ul" sx={{ pl: 2, mb: 0 }}>
                {authors.map((a) => (
                  <li key={a.id}>
                    <Typography>
                      <b>#{a.id}</b> {a.name} — {a.email}
                      {a.penName ? ` (pluma: ${a.penName})` : ""}
                    </Typography>
                  </li>
                ))}
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
