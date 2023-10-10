import { Schema, model } from 'mongoose'

interface ITrack {
  _id: string
  author: string
  title: string
  url: string
  duration: string
  thumbnail: string
}

const TrackSchema = new Schema<ITrack>({
  _id: String,
  author: String,
  title: String,
  url: String,
  duration: String,
  thumbnail: String,
})

const Track = model('Track', TrackSchema)

export { ITrack, Track, TrackSchema }
