import React from 'react';

interface Props {
  url: string;
}

export function VideoThumbnail({ url }: Props) {
  return (
    <div className="aspect-[9/16] relative overflow-hidden rounded-xl bg-black">
      <img 
        src={url} 
        alt="AI Actor Preview"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-200" />
    </div>
  );
}