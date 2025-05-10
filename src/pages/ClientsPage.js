import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Button,
  CircularProgress,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Input,
  IconButton,
} from '@mui/material';
import { CloudDownload, Delete } from '@mui/icons-material';

import DobbyFileManager from '../services/dobbyFileManager';

export default function FileManager() {
  const [idCitizen, setIdCitizen] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [metadataArray, setMetadataArray] = useState([]);

  const fetchFiles = async () => {
    if (!idCitizen) return;
    setLoading(true);
    try {
      const res = await DobbyFileManager.listDocuments(idCitizen);
      setFiles(res.files || []);
    } catch (err) {
      console.error('Error al obtener archivos', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getIdCitizen = async () => {
      try {
        const id = await DobbyFileManager.getMe();
        setIdCitizen(id);
      } catch (error) {
        console.error('Error al obtener el idCitizen', error);
      }
    };
    getIdCitizen();
  }, []);

  useEffect(() => {
    if (idCitizen) {
      fetchFiles();
    }
  }, [idCitizen]);

  const handleDelete = async (fileName) => {
    try {
      await DobbyFileManager.deleteFile(fileName);
      alert('Archivo eliminado correctamente');
      fetchFiles();
    } catch (err) {
      console.error('Error al eliminar archivo', err);
    }
  };

  const handleDownload = (fileName) => {
    DobbyFileManager.downloadFile(fileName);
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const metadata = files.map((file) => ({
      operatorId: '1728',
      fileName: file.name,
      mimetype: file.type,
      size: file.size,
    }));

    setSelectedFiles(files);
    setMetadataArray(metadata);
  };

  const handleUpload = async () => {
    if (!selectedFiles.length) return;
    try {
      setLoading(true);
      const res = await DobbyFileManager.uploadFiles(selectedFiles, metadataArray);
      alert(res.message || 'Archivos subidos');
      fetchFiles();
      setUploadDialogOpen(false);
      setSelectedFiles([]);
    } catch (err) {
      console.error('Error al subir archivos', err);
      alert('Error al subir archivos');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Gestión de Archivos
      </Typography>
      <Button variant="contained" onClick={() => setUploadDialogOpen(true)} sx={{ mb: 2 }}>
        Agregar Archivos
      </Button>

      {loading ? (
        <CircularProgress />
      ) : files.length === 0 ? (
        <Typography>No tienes archivos.</Typography>
      ) : (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {files.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((file, index) => (
                <TableRow key={index}>
                  <TableCell>{file.name}</TableCell>
                  <TableCell>{file.contentType}</TableCell>
                  <TableCell>{file.timeCreated}</TableCell>
                  <TableCell align="right">
                    <IconButton color="primary" onClick={() => handleDownload(file.name)} sx={{ mr: 1 }}>
                      <CloudDownload />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(file.name)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={files.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Paper>
      )}

      <Dialog open={uploadDialogOpen} onClose={() => setUploadDialogOpen(false)}>
        <DialogTitle>Subir Archivos</DialogTitle>
        <DialogContent>
          <Input type="file" inputProps={{ multiple: true }} onChange={handleFileChange} />
          {selectedFiles.length > 0 && (
            <List>
              {selectedFiles.map((file, idx) => (
                <ListItem key={idx}>
                  <ListItemText primary={file.name} />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleUpload}>
            Subir
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
