import { Schema, model, Document } from 'mongoose'
import { IPlaylist } from './Playlist'
import { GuildNodeCreateOptions } from 'discord-player'
import { ITrack } from './Track'

export interface IGuild extends Document {
  _id: string
  guildNodeCreateOptions: GuildNodeCreateOptions
  playlists: IPlaylist[]
  trackHistory: ITrack[]
  logs: string[]
  thumbnail: string
}

const TrackSchema = new Schema<IGuild>({
  _id: String,
  guildNodeCreateOptions: {
    strategy: String,
    volume: Number,
    equalizer: Schema.Types.Mixed,
    a_filter: Schema.Types.Mixed,
    biquad: Schema.Types.Mixed,
    resampler: Number,
    repeatMode: String,
    pauseOnEmpty: Boolean,
    leaveOnEmpty: Boolean,
    leaveOnEmptyCooldown: Number,
    leaveOnEnd: Boolean,
    leaveOnEndCooldown: Number,
    leaveOnStop: Boolean,
    leaveOnStopCooldown: Number,
    // metadata: id maybe later
    // selfDeaf: Boolean,
    // connectionTimeout: Number,
    defaultFFmpegFilters: [String],
    // bufferingTimeout: Number,
    // noEmitInsert: Boolean,
    maxSize: Number,
    maxHistorySize: Number,
    // disableVolume: Boolean,
    disableEqualizer: Boolean,
    disableFilterer: Boolean,
    disableBiquad: Boolean,
    disableResampler: Boolean,
  },
  playlists: [{ type: Schema.Types.ObjectId, ref: 'Playlist' }],
  trackHistory: [{ type: Schema.Types.ObjectId, ref: 'Track' }],
  logs: [String],
  thumbnail: String,
})

export const Track = model<IGuild>('Track', TrackSchema)
