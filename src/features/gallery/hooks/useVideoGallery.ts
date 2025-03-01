import { useState, useCallback } from 'react';
import { GalleryVideo, VideoCategory } from '../types';
import { galleryVideos } from '../data/videos';

export function useVideoGallery() {
  const [category, setCategory] = useState<VideoCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVideos = useCallback(() => {
    let videos = galleryVideos;

    if (category !== 'all') {
      videos = videos.filter(video => video.category === category);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      videos = videos.filter(video => 
        video.title?.toLowerCase().includes(query) ||
        video.description?.toLowerCase().includes(query)
      );
    }

    return videos;
  }, [category, searchQuery]);

  return {
    videos: filteredVideos(),
    category,
    searchQuery,
    setCategory,
    setSearchQuery
  };
}