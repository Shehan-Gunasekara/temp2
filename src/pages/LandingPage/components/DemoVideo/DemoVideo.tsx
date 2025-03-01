import { VideoOverlay } from './VideoOverlay';
import { PlayButton } from './PlayButton';

export function DemoVideo() {
  return (
    <div className="relative rounded-2xl overflow-hidden shadow-2xl">
      <div className="aspect-[4/3] bg-black/5">
        <img
          src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e"
          alt="AI Actor Demo"
          className="w-full h-full object-cover"
        />
        <VideoOverlay />
        <PlayButton />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <p className="text-lg font-medium">See AI Actors in Action</p>
        <p className="text-white/80">Watch how our technology creates lifelike digital humans</p>
      </div>
    </div>
  );
}