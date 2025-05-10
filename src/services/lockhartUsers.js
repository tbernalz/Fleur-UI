import axios from '../apiConnection';

class LockhartUsersApi {
  constructor() {
    this.axios = axios; // Store the axios instance in a class property
  }

  checkEmailExistence(email) {
    return this.axios.get(`/user/check-email?email=${email}`);
  }

  checkIdentificationNumberExistence(identificationNumber) {
    return this.axios.get(`/user/check-document-number?identificationNumber=${identificationNumber}`);
  }

  registerUser(userDto) {
    console.log(userDto);
    return this.axios.post('/user/verify', userDto);
  }
}

export default new LockhartUsersApi();
