import { PrismaClient, Playlist, Track } from '@prisma/client'

const prisma = new PrismaClient()

export class PlaylistService {
  static create(playlist: Omit<Playlist, 'id'>) {
    return prisma.playlist.create({ data: playlist })
  }
  static update(playlistId: Playlist['id'], data: Partial<Playlist>) {
    return prisma.playlist.update({
      where: { id: playlistId },
      data: data,
    })
  }

  static async delete(playlistId: Playlist['id']) {
    return await prisma.$transaction([
      prisma.tracksOnPlaylists.deleteMany({
        where: { playlist: { id: playlistId } },
      }),
      prisma.playlist.delete({
        where: {
          id: playlistId,
        },
      }),
    ])
  }

  static async remove(playlistId: Playlist['id'], trackId: Track['id']) {
    return await prisma.$transaction([
      prisma.tracksOnPlaylists.findFirst({
        where: { playlistId, trackId },
        select: { track: true },
      }),
      prisma.tracksOnPlaylists.deleteMany({
        where: { playlistId, trackId },
      }),
    ])
  }

  static getByGuildId(guildId: Playlist['guild']) {
    return prisma.playlist.findMany({
      where: {
        guild: guildId,
      },
    })
  }

  static add(playlistId: Playlist['id'], track: Track) {
    return prisma.playlist.update({
      where: {
        id: playlistId,
      },
      data: {
        tracks: {
          create: [
            {
              assignedBy: 'me', // TODO: add assignedBy
              track: {
                connectOrCreate: {
                  where: { id: track.url },
                  create: {
                    author: track.author,
                    id: track.url,
                    title: track.title,
                    url: track.url,
                    thumbnail: track.thumbnail,
                  },
                },
              },
            },
          ],
        },
      },
    })
  }
  // static removeTrack(playlistId: Playlist['id'], trackId: Track['id']) {
  //   return prisma.playlist.update({
  //     where: {
  //       id: playlistId,
  //     },
  //     data: {
  //       tracks: {
  //         disconnect: {
  //           id: trackId,
  //         },
  //       },
  //     },
  //   })
  // }
  static getTracks(playlistId: Playlist['id']) {
    return prisma.track.findMany({
      where: {
        playlists: {
          some: {
            playlistId,
          },
        },
      },
    })
  }
}
