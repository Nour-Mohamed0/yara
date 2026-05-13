# YouTube Integration Setup Guide

## YouTube API Configuration

Your YouTube integration is already configured with:

```env
YOUTUBE_API_KEY=AIzaSyBQxROmk6aLxvdLjA6pNT_AftIXtEnlFXY
YOUTUBE_CHANNEL_ID=UC9WNQ1AUrjOle0QihbaSLdw
```

## How YouTube Integration Works

### 1. **Automatic Playlist Fetching**

When you add a playlist ID via the admin dashboard:
- The system fetches playlist metadata
- Auto-downloads all video information
- Caches in D1 database
- Displays with thumbnails and descriptions

### 2. **Video Organization**

Videos are organized by:
- **Playlist**: Grouping related videos
- **Section**: Named categories (Grammar, Speaking, etc.)
- **Order**: Custom sorting within playlists

### 3. **Public Display**

Frontend shows:
- Playlist names and descriptions
- Video thumbnails
- Video titles and descriptions
- Play buttons to embed YouTube player
- Video count per playlist

## Adding Playlists to Your Site

### Method 1: Admin Dashboard (Easiest)

1. Go to `https://yourdomain.com/admin/youtube`
2. Enter YouTube Playlist ID
3. Enter section name (e.g., "Grammar", "Speaking")
4. Click "Add Playlist"
5. Click "Sync with YouTube"

### Method 2: YouTube Playlist ID Format

YouTube Playlist IDs look like:
```
PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf
```

**How to find:**
1. Open YouTube playlist
2. Look at URL: `youtube.com/playlist?list=PLAYLIST_ID`
3. Copy the `PLAYLIST_ID` part

## Creating Your Own YouTube Channel

### If you don't have a channel yet:

1. Sign in to YouTube
2. Click your profile icon
3. Click "Create a channel"
4. Enter channel name
5. Customize channel with banner and icon

### Create Playlists:

1. Go to "Library" in YouTube Studio
2. Click "Create playlist"
3. Enter name (e.g., "English Grammar Basics")
4. Set to "Unlisted" or "Public"
5. Add videos to playlist

### Get Your Channel ID:

1. YouTube Studio > Settings > Basic Info
2. Copy "Channel ID"
3. Use in `YOUTUBE_CHANNEL_ID` environment variable

## How the System Works

### Data Flow

```
YouTube API
    ↓
Fetch Playlists & Videos
    ↓
Cache in D1 Database
    ↓
Admin Dashboard
    ↓
Display on Website
```

### API Requests

The system makes these API calls:

1. **Get Playlists** (monthly sync)
   ```
   GET https://www.googleapis.com/youtube/v3/playlists
   Parameters: channelId, part=snippet,contentDetails
   ```

2. **Get Playlist Videos** (per playlist)
   ```
   GET https://www.googleapis.com/youtube/v3/playlistItems
   Parameters: playlistId, part=snippet
   ```

3. **Get Video Details** (optional)
   ```
   GET https://www.googleapis.com/youtube/v3/videos
   Parameters: id, part=snippet,statistics,contentDetails
   ```

## YouTube API Quota

### Free Tier Limits

- **Daily Quota**: 10,000 units per day
- **Cost**: ~100-1000 quota units per API call
- **Estimated Calls**: ~10-100 calls per day

### Typical Usage

For your site:
- Daily sync of playlists: ~500 quota units
- Video detail fetches: ~2000 quota units
- Total: ~2500 quota units/day

This means you have plenty of room for a school or teaching site.

### Monitor Usage

1. Google Cloud Console: https://console.cloud.google.com
2. Select your project
3. APIs & Services > Quotas
4. Monitor YouTube Data API usage

## Troubleshooting YouTube Integration

### Issue: "Invalid API Key"

**Solution**:
```env
# Verify API key is correct
YOUTUBE_API_KEY=AIzaSyBQxROmk6aLxvdLjA6pNT_AftIXtEnlFXY

# If not, get new key from Google Cloud Console
```

### Issue: "Quota Exceeded"

**Solution**:
- Wait 24 hours for quota to reset
- Or increase quota in Google Cloud Console
- Or reduce API calls (cache longer)

### Issue: "Playlist Not Found"

**Solution**:
```
1. Verify playlist ID is correct
2. Check URL: youtube.com/playlist?list=PLAYLIST_ID
3. Ensure playlist is public or unlisted
4. Try copying exact ID again
```

### Issue: "No Videos Showing"

**Solution**:
1. Verify playlist has videos
2. Check sync completed: Admin > YouTube > Sync button
3. Wait 5 seconds after sync
4. Refresh page
5. Check browser console for errors

### Issue: "403 Forbidden Error"

**Solution**:
1. Verify YouTube API is enabled
2. Check API key has YouTube Data API access
3. Verify API key domain restrictions (allow all)
4. Check quota hasn't been exceeded

## API Key Management

### Generate New API Key

1. Go to Google Cloud Console
2. Create new project
3. Enable YouTube Data API v3
4. Create API key credential
5. Restrict to YouTube Data API
6. Copy and use in `.env.local`

### Security Best Practices

1. **Rotate API keys** quarterly
2. **Don't commit keys** to version control
3. **Use environment variables** for secrets
4. **Restrict key scope** to needed APIs
5. **Monitor usage** regularly

## YouTube Playlist Examples

### For English Teaching

1. **Grammar**
   - Tenses
   - Parts of speech
   - Sentence structure
   - Common errors

2. **Speaking**
   - Pronunciation
   - Conversation practice
   - Listening comprehension
   - Fluency exercises

3. **Writing**
   - Essay writing
   - Business writing
   - Creative writing
   - Technical writing

4. **Exam Prep**
   - IELTS preparation
   - TOEFL preparation
   - Cambridge exams
   - Practice tests

5. **Vocabulary**
   - Common words
   - Advanced vocabulary
   - Phrasal verbs
   - Idioms

## Video Metadata

Each video displays:

| Field | From YouTube |
|-------|--------------|
| Title | Video title |
| Description | Video description |
| Thumbnail | Video thumbnail |
| Duration | Video length (ISO 8601) |
| View Count | Subscriber views |
| Like Count | Public likes |
| Comment Count | Comments enabled |

## Performance Tips

### 1. Cache Videos Longer
```typescript
// Reduce API calls
const cacheTime = 24 * 60 * 60 * 1000; // 24 hours
```

### 2. Limit Videos Per Playlist
```typescript
maxResults: 50  // YouTube API default
```

### 3. Load Videos On Demand
```typescript
// Only fetch when user clicks playlist
```

### 4. Use Video Thumbnails Efficiently
```typescript
// YouTube provides free thumbnails
// No additional bandwidth cost
```

## Video Embedding

When users click a video:

```html
<iframe
  width="100%"
  height="600"
  src="https://www.youtube.com/embed/{VIDEO_ID}"
  allowFullScreen
></iframe>
```

Benefits:
- No bandwidth used (YouTube hosts)
- Responsive design
- Auto-play, pause, volume control
- Analytics tracked by YouTube

## FAQ

**Q: Can I use the same API key for multiple sites?**
A: Yes, but it's better to generate separate keys per site for security and quota management.

**Q: What happens if my API quota resets?**
A: Wait until the next day. Quota resets at midnight UTC every day.

**Q: Can I download videos?**
A: No, and it violates YouTube ToS. Always stream from YouTube.

**Q: How often are playlists synced?**
A: Admin can click "Sync" button anytime. Recommend monthly auto-sync.

**Q: Can users upload comments to your site?**
A: The current system doesn't support comments. Videos link to YouTube for comments.

**Q: How are videos monetized?**
A: If your YouTube channel is monetized, revenue goes to YouTube channel.

**Q: Can I make playlists private?**
A: Yes, but the API needs permission to access. Use "Unlisted" for semi-private.

## Support

- **YouTube API Docs**: https://developers.google.com/youtube/v3
- **YouTube Studio Help**: https://support.google.com/youtube/studio
- **API Explorer**: https://developers.google.com/youtube/v3/docs

---

**YouTube Integration Version**: 1.0
**Last Updated**: May 2026
**Status**: Fully Functional
