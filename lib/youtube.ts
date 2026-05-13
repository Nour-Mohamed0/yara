import axios from 'axios';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;

interface YouTubePlaylist {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoCount: number;
}

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  playlistId: string;
  duration: string;
  views: string;
}

export async function getChannelPlaylists(): Promise<YouTubePlaylist[]> {
  if (!YOUTUBE_API_KEY || !YOUTUBE_CHANNEL_ID) {
    console.warn('YouTube API credentials not configured');
    return [];
  }

  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/playlists', {
      params: {
        part: 'snippet,contentDetails',
        channelId: YOUTUBE_CHANNEL_ID,
        maxResults: 50,
        key: YOUTUBE_API_KEY,
      },
    });

    return response.data.items.map((item: any) => ({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.default?.url || '',
      videoCount: item.contentDetails.itemCount,
    }));
  } catch (error) {
    console.error('Error fetching playlists:', error);
    return [];
  }
}

export async function getPlaylistVideos(playlistId: string): Promise<YouTubeVideo[]> {
  if (!YOUTUBE_API_KEY) {
    console.warn('YouTube API key not configured');
    return [];
  }

  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/playlistItems', {
      params: {
        part: 'snippet',
        playlistId,
        maxResults: 50,
        key: YOUTUBE_API_KEY,
      },
    });

    return response.data.items.map((item: any) => ({
      id: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.default?.url || '',
      playlistId,
      duration: '',
      views: '',
    }));
  } catch (error) {
    console.error('Error fetching playlist videos:', error);
    return [];
  }
}

export async function getVideoDetails(videoId: string) {
  if (!YOUTUBE_API_KEY) {
    console.warn('YouTube API key not configured');
    return null;
  }

  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        part: 'snippet,statistics,contentDetails',
        id: videoId,
        key: YOUTUBE_API_KEY,
      },
    });

    const item = response.data.items[0];
    if (!item) return null;

    return {
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.default?.url || '',
      duration: item.contentDetails.duration,
      views: item.statistics.viewCount || '0',
      likes: item.statistics.likeCount || '0',
      comments: item.statistics.commentCount || '0',
    };
  } catch (error) {
    console.error('Error fetching video details:', error);
    return null;
  }
}

export function getEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`;
}

export function getThumbnailUrl(videoId: string, quality: 'default' | 'medium' | 'high' = 'high'): string {
  const qualityMap = {
    default: 'default',
    medium: 'mqdefault',
    high: 'hqdefault',
  };
  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
}
