import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { publicationsApi } from "../api/http";

type Publication = {
  id: number;
  title: string;
  content: string;
  status: string;
  authorId: number;
  type: string;
  extra?: Record<string, unknown>;
  author?: { id: number; name: string; email: string; penName?: string | null };
  createdAt: string;
  updatedAt: string;
};

const STATUSES = ["DRAFT", "IN_REVIEW", "APPROVED", "PUBLISHED", "REJECTED"] as const;
const TYPES = ["BOOK", "ARTICLE"] as const;

export default function PublicationsPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [authorId, setAuthorId] = useState<number>(1);
  const [type, setType] = useState<(typeof TYPES)[number]>("BOOK");
  const [isbn, setIsbn] = useState("");
  const [genre, setGenre] = useState("");
  const [topic, setTopic] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");

  const [publications, setPublications] = useState<Publication[]>([]);
  const [selected, setSelected] = useState<Publication | null>(null);
  const [newStatus, setNewStatus] = useState<(typeof STATUSES)[number]>("IN_REVIEW");
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const canSubmit = useMemo(() => title.trim().length >= 2 && content.trim().length >= 1 && authorId > 0, [title, content, authorId]);

  async function load() {
    setError(null);
    const res = await publicationsApi.get("/publications?page=1&limit=20");
    setPublications(res.data.data);
  }

  async function loadDetail(id: number) {
    setError(null);
    const res = await publicationsApi.get(`/publications/${id}`);
    setSelected(res.data);
  }

  useEffect(() => {
    load().catch((e) => setError(e?.response?.data?.error ?? "Error cargando publicaciones"));
  }, []);

  async function createPublication() {
    setError(null);
    setOk(null);
    try {
      const payload: any = { title, content, authorId, type };
      if (type === "BOOK") {
        if (isbn.trim()) payload.isbn = isbn;
        if (genre.trim()) payload.genre = genre;
      } else {
        if (topic.trim()) payload.topic = topic;
        if (sourceUrl.trim()) payload.sourceUrl = sourceUrl;
      }
      const res = await publicationsApi.post("/publications", payload);
      setOk(`Publicación creada: #${res.data.id}`);
      setTitle(""); setContent("");
      setIsbn(""); setGenre(""); setTopic(""); setSourceUrl("");
      await load();
      await loadDetail(res.data.id);
    } catch (e: any) {
      setError(e?.response?.data?.error ?? "Error creando publicación (¿existe el autor?)");
    }
  }

  async function changeStatus() {
    if (!selected) return;
    setError(null);
    setOk(null);
    try {
      const res = await publicationsApi.patch(`/publications/${selected.id}/status`, { status: newStatus });
      setOk(`Estado actualizado a ${res.data.status}`);
      await load();
      await loadDetail(selected.id);
    } catch (e: any) {
      setError(e?.response?.data?.error ?? "Error cambiando estado");
    }
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={5}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Crear publicación
            </Typography>

            {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}
            {ok ? <Alert severity="success" sx={{ mb: 2 }}>{ok}</Alert> : null}

            <TextField fullWidth label="Título" value={title} onChange={(e) => setTitle(e.target.value)} sx={{ mb: 2 }} />
            <TextField fullWidth label="Contenido" value={content} onChange={(e) => setContent(e.target.value)} multiline minRows={3} sx={{ mb: 2 }} />

            <TextField
              fullWidth
              label="authorId (debe existir)"
              type="number"
              value={authorId}
              onChange={(e) => setAuthorId(Number(e.target.value))}
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Tipo</InputLabel>
              <Select label="Tipo" value={type} onChange={(e) => setType(e.target.value as any)}>
                {TYPES.map((t) => (
                  <MenuItem key={t} value={t}>{t}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {type === "BOOK" ? (
              <>
                <TextField fullWidth label="ISBN (opcional)" value={isbn} onChange={(e) => setIsbn(e.target.value)} sx={{ mb: 2 }} />
                <TextField fullWidth label="Género (opcional)" value={genre} onChange={(e) => setGenre(e.target.value)} sx={{ mb: 2 }} />
              </>
            ) : (
              <>
                <TextField fullWidth label="Tema (opcional)" value={topic} onChange={(e) => setTopic(e.target.value)} sx={{ mb: 2 }} />
                <TextField fullWidth label="URL fuente (opcional)" value={sourceUrl} onChange={(e) => setSourceUrl(e.target.value)} sx={{ mb: 2 }} />
              </>
            )}

            <Button variant="contained" onClick={createPublication} disabled={!canSubmit}>
              Guardar
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={7}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
              <Typography variant="h6">Publicaciones</Typography>
              <Button variant="outlined" onClick={() => load().catch(() => setError("Error recargando"))}>
                Recargar
              </Button>
            </Box>

            {publications.length === 0 ? (
              <Typography color="text.secondary">No hay publicaciones aún.</Typography>
            ) : (
              <Box component="ul" sx={{ pl: 2, mb: 2 }}>
                {publications.map((p) => (
                  <li key={p.id}>
                    <Button size="small" onClick={() => loadDetail(p.id).catch(() => setError("Error cargando detalle"))}>
                      Ver #{p.id}
                    </Button>{" "}
                    <Typography component="span">
                      <b>{p.title}</b> — {p.status} (authorId: {p.authorId}, type: {p.type})
                    </Typography>
                  </li>
                ))}
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              Detalle de publicación
            </Typography>

            {!selected ? (
              <Typography color="text.secondary">Selecciona una publicación para ver el detalle.</Typography>
            ) : (
              <>
                <Typography><b>ID:</b> {selected.id}</Typography>
                <Typography><b>Título:</b> {selected.title}</Typography>
                <Typography><b>Estado:</b> {selected.status}</Typography>
                <Typography><b>Autor:</b> {selected.author ? `${selected.author.name} (${selected.author.email})` : `authorId ${selected.authorId}`}</Typography>
                <Typography sx={{ mt: 1 }}><b>Contenido:</b> {selected.content}</Typography>

                {selected.extra ? (
                  <Typography sx={{ mt: 1 }}><b>Extra:</b> {JSON.stringify(selected.extra)}</Typography>
                ) : null}

                <Box sx={{ mt: 2 }}>
                  <FormControl fullWidth sx={{ mb: 1 }}>
                    <InputLabel>Nuevo estado</InputLabel>
                    <Select label="Nuevo estado" value={newStatus} onChange={(e) => setNewStatus(e.target.value as any)}>
                      {STATUSES.map((s) => (
                        <MenuItem key={s} value={s}>{s}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button variant="contained" onClick={changeStatus}>
                    Cambiar estado
                  </Button>
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Regla de transiciones: DRAFT→IN_REVIEW→(APPROVED|REJECTED)→PUBLISHED.
                  </Typography>
                </Box>
              </>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
