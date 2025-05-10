import { jwtDecode } from 'jwt-decode';
import axios from '../apiConnection';

class ThestralTransfer {
  constructor() {
    this.axios = axios;
  }

  async getOperators() {
    try {
      const response = await this.axios.get(`/api/Operator`);
      return response;
    } catch (error) {
      throw new Error('Error al obtener los operadores');
    }
  }

  async transfer(dataToSend) {
    try {
      const token = localStorage.getItem('accessToken');
      const decoded = jwtDecode(token);
      const userId = decoded.user_id;
      const userEmail = decoded.email;

      console.log('User ID:', userId);
      console.log('User Email:', userEmail);

      const response = await this.axios.post(`/api/Transfer`, dataToSend, {
        headers: {
          'X-User-Email': userEmail,
          'X-User-Id': userId,
        },
      });
      return response;
    } catch (error) {
      throw new Error('Error al obtener los operadores');
    }
  }
}

export default new ThestralTransfer();
