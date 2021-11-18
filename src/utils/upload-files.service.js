import axios from "axios";

const http = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        "Content-type": "application/json"
    }
});


class UploadFilesService {

    upload(file, onUploadProgress) {

        let formData = new FormData();
        formData.append("files", file);

        return http.post("/api/v1/file/upload/files", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            onUploadProgress,
        });
    }

    uploadImage(file, onUploadProgress) {

        let formData = new FormData();
        formData.append("images", file);

        return http.post("/api/v1/file/upload/image", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            onUploadProgress,
        });
    }

    getFiles() {
        return http.get("/files");
    }
}

export default new UploadFilesService();