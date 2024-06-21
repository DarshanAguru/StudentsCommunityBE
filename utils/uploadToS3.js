import { S3 } from '@aws-sdk/client-s3'
import sharp from 'sharp'

export const uploadImage = async (file, id, uuid) => {
  const bucketName = process.env.BUCKET
  const region = process.env.REGION
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

  const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey
  })
  const key = `${id}/${uuid}@${file.originalname}`
  let compressedFile
  if (file.size > 2 * 1024 * 1024) {
    compressedFile = await sharp(file.buffer).jpeg({ quality: 60 }).toBuffer()
  } else {
    compressedFile = file.buffer
  }

  const uploadParams = {
    Bucket: bucketName,
    Body: compressedFile,
    Key: key
  }
  const data = await s3.putObject(uploadParams)
  return { path: key, loc: data.Location }
}

export const retrieveImage = async (key) => {
  const bucketName = process.env.BUCKET
  const region = process.env.REGION
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

  const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey
  })

  const downloadParams = {
    Key: key,
    Bucket: bucketName
  }

  const result = await s3.getObject(downloadParams)
  return result.Body
}

export const deleteImage = async (key) => {
  const bucketName = process.env.BUCKET
  const region = process.env.REGION
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

  const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey
  })

  const deleteParams = {
    Bucket: bucketName,
    Key: key
  }

  await s3.deleteObject(deleteParams)
  return { message: 'deleted successfully' }
}
