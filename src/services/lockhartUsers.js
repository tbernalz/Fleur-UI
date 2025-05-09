import axios from '../apiConnection';

class LockhartUsersApi {
  constructor() {
    this.axios = axios; // Store the axios instance in a class property
  }

  checkEmailExistence(email) {
    return this.axios.get(`/User/check-email?email=${email}`);
  }

  checkIdentificationNumberExistence(identificationNumber) {
    return this.axios.get(`/User/check-document-number?identificationNumber=${identificationNumber}`);
  }

  registerUser(userDto) {
    return this.axios.post('/User/verify', userDto);
  }
}

export default new LockhartUsersApi();
