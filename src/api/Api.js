import axios from "axios";
import { config } from "../constants/config";
import { validObject } from "../utils/utils";

class Api {
  normalizePath(endpoint) {
    let res = endpoint.match(
      /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
    );
    if (res !== null) {
      return endpoint;
    } else {
      return `${config.baseUrl}/${endpoint}`;
    }
  }

  defaultHeader(object) {
    Object.keys(object).forEach((key) => {
      axios.defaults.headers.common[key] = object[key];
    });
  }

  GET(endpoint, params, headers = {}) {
    return new Promise((resolve, reject) => {
      axios({
        method: "GET",
        url: this.normalizePath(endpoint),
        params,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...headers,
        },
        validateStatus: (status) => {
          return true;
        },
      })
        .then((response) => {
          if (
            response &&
            (response?.status === 401 || response?.status === 403)
          ) {
            axios({
              method: "GET",
              url: this.normalizePath(endpoint),
              params,
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                ...headers,
              },
              validateStatus: (status) => {
                return true;
              },
            }).then((response1) => {
              resolve(response1);
            });
          } else if (response && response?.status === 200) {
            resolve(response);
          } else {
            reject({
              error: true,
              message:
                response?.data?.message ||
                response?.message ||
                `Status: ${response?.status}` ||
                "GETV3 error!  Something is wrong",
            });
          }
        })
        .catch((error) => {
          console.log("GET error", error);
          reject({
            error: true,
            message:
              error?.message || error || "GETV3 error!  Something is wrong",
          });
        });
    });
  }

  POST(endpoint, params, headers = {}) {
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url: this.normalizePath(endpoint),
        data: params ? JSON.stringify(params) : null,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...headers,
        },
        validateStatus: (status) => {
          return true;
        },
      })
        .then((response) => {
          if (
            response &&
            (response?.status === 401 || response?.status === 403)
          ) {
            axios({
              method: "post",
              url: this.normalizePath(endpoint),
              data: params ? JSON.stringify(params) : null,
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                ...headers,
              },
              validateStatus: (status) => {
                return true;
              },
            }).then((response1) => {
              resolve(response1);
            });
          } else if (response && response?.status === 200) {
            resolve(response);
          } else {
            reject({
              error: true,
              message:
                response?.data?.message ||
                response?.message ||
                `Status: ${response?.status}` ||
                "POSTV3 error!  Something is wrong",
              ...(validObject(response?.data?.data)
                ? { data: response?.data?.data }
                : {}),
            });
          }
        })
        .catch((error) => {
          console.log("POST error", JSON.stringify(error));
          reject({
            error: true,
            message:
              error?.message || error || "POST error!  Something is wrong",
            ...(validObject(error?.data) ? { data: error?.data } : {}),
          });
        });
    });
  }

  DELETE(endpoint, params, headers = {}) {
    return new Promise((resolve, reject) => {
      axios({
        method: "delete",
        url: this.normalizePath(endpoint),
        data: params ? JSON.stringify(params) : null,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...headers,
        },
        validateStatus: (status) => {
          return true;
        },
      })
        .then((response) => {
          if (
            response &&
            (response?.status === 401 || response?.status === 403)
          ) {
            axios({
              method: "delete",
              url: this.normalizePath(endpoint),
              data: params ? JSON.stringify(params) : null,
              headers: { "Content-Type": "application/json", ...headers },
              validateStatus: (status) => {
                return true;
              },
            }).then((response1) => {
              resolve(response1);
            });
          } else if (response && response?.status === 200) {
            resolve(response);
          } else {
            reject({
              error: true,
              message:
                response?.data?.message ||
                response?.message ||
                `Status: ${response?.status}` ||
                "DELETEV3 error!  Something is wrong",
            });
          }
        })
        .catch((error) => {
          console.log("DELETE error", JSON.stringify(error));
          reject({
            error: true,
            message:
              error?.message || error || "DELETE error!  Something is wrong",
          });
        });
    });
  }

  POSTFORMDATA(endpoint, params, headers = {}) {
    return new Promise((resolve) => {
      const data = new FormData();
      if (params) {
        Object.keys(params).forEach((key) => {
          data.append(key, params[key]);
        });
      }
      axios({
        method: "post",
        url: this.normalizePath(endpoint),
        data: data,
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
          ...headers,
        },
        validateStatus: (status) => {
          return true;
        },
      })
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          console.log("POSTFORMDATA error", JSON.stringify(error));
          resolve({ error: true, message: "Oops!  Something is wrong" });
        });
    });
  }

  PUT(endpoint, params, headers = {}) {
    return new Promise((resolve, reject) => {
      axios({
        method: "put",
        url: this.normalizePath(endpoint),
        data: JSON.stringify(params),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...headers,
        },
        validateStatus: (status) => {
          return true;
        },
      })
        .then((response) => {
          if (
            response &&
            (response?.status === 401 || response?.status === 403)
          ) {
            axios({
              method: "put",
              url: this.normalizePath(endpoint),
              data: params ? JSON.stringify(params) : null,
              headers: { "Content-Type": "application/json", ...headers },
              validateStatus: (status) => {
                return true;
              },
            }).then((response1) => {
              resolve(response1);
            });
          } else if (response && response?.status === 200) {
            resolve(response);
          } else {
            reject({
              error: true,
              message:
                response?.data?.message ||
                response?.message ||
                `Status: ${response?.status}` ||
                "PUTV3 error!  Something is wrong",
            });
          }
        })
        .catch((error) => {
          console.log("PUT error", error);
          reject({
            error: true,
            message:
              error?.message || error || "PUT error!  Something is wrong",
          });
        });
    });
  }
}

export default new Api();
