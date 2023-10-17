import { Schema, model, Document } from 'mongoose'
import { IPlaylist } from './Playlist'

export interface ITrack extends Document {
  _id: string
  author: string
  title: string
  url: string
  duration: string
  thumbnail: string
  playlist: IPlaylist
}

const TrackSchema = new Schema<ITrack>({
  _id: String,
  author: String,
  title: String,
  url: String,
  duration: String,
  thumbnail: String,
})

export const Track = model<ITrack>('Track', TrackSchema)
