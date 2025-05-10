import { jwtDecode } from 'jwt-decode';
import axios from '../apiConnection';

class DobbyFileManager {
  constructor() {
    this.axios = axios; // Almacena la instancia de axios en una propiedad de la clase
  }

  registerUser(userDto) {
    return this.axios.post('/user', userDto);
  }

  async uploadFiles(files, metadataArray) {
    const token = localStorage.getItem('accessToken');
    const decoded = jwtDecode(token);
    const userId = decoded.user_id;
    const userEmail = decoded.email;

    console.log('User ID:', userId);
    console.log('User Email:', userEmail);

    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    formData.append('idCitizen', userId);
    formData.append('metadata', JSON.stringify(metadataArray));

    try {
      const response = await this.axios.post(`/gcp-storage/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Error al subir archivos');
    }
  }

  async listDocuments() {
    try {
      const token = localStorage.getItem('accessToken');
      const decoded = jwtDecode(token);
      const userId = decoded.user_id;
      const userEmail = decoded.email;

      console.log('User ID:', userId);
      console.log('User Email:', userEmail);

      const response = await this.axios.get(`/gcp-storage/list-documents/${userId}`, {
        // headers: GcpStorageApi.authHeader(),
      });
      return response.data;
    } catch (error) {
      throw new Error('Error al listar documentos');
    }
  }

  async deleteFile(fileName) {
    try {
      const token = localStorage.getItem('accessToken');
      const decoded = jwtDecode(token);
      const userId = decoded.user_id;
      const userEmail = decoded.email;

      console.log('User ID:', userId);
      console.log('User Email:', userEmail);

      const response = await this.axios.post(
        `/gcp-storage/delete-file`,
        { userId, fileName },
        {
          // headers: GcpStorageApi.authHeader(),
        }
      );
      return response.data;
    } catch (error) {
      throw new Error('Error al eliminar archivo');
    }
  }

  async downloadFile(fileName) {
    try {
      const token = localStorage.getItem('accessToken');
      const decoded = jwtDecode(token);
      const userId = decoded.user_id;
      const userEmail = decoded.email;

      console.log('User ID:', userId);
      console.log('User Email:', userEmail);

      const url = `/gcp-storage/download-file/${userId}/${fileName}`;
      const response = await this.axios.get(url, {
        responseType: 'blob',
        // headers: GcpStorageApi.authHeader(),
      });

      const href = URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = href;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(href);
    } catch (error) {
      throw new Error('Error al descargar archivo');
    }
  }

  async transferFilesToMyFolder(sourceCitizenId, targetCitizenId, fileNames) {
    if (!Array.isArray(fileNames) || fileNames.length === 0) {
      throw new Error('fileNames debe ser un array no vacío');
    }

    try {
      const response = await this.axios.post(
        `/gcp-storage/transfer-files`,
        {
          sourceCitizenId,
          targetCitizenId,
          fileNames,
        },
        {
          // headers: GcpStorageApi.authHeader(),
        }
      );
      return response.data;
    } catch (error) {
      throw new Error('Error al transferir archivos entre carpetas');
    }
  }
}

export default new DobbyFileManager();
