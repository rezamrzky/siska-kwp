import { env } from '$env/dynamic/private';
import Minio from 'Minio';

const minio = new Minio.Client({
    endPoint: 'localhost',
    port: 9000,
    useSSL: false,
    accessKey: env.MINIO_ACCESS_KEY,
    secretKey: env.MINIO_SECRET_KEY
})

export {minio}