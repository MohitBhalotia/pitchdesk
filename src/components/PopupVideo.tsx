import { Info } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import {
  VideoPlayer,
  VideoPlayerTimeDisplay,
  VideoPlayerSeekForwardButton,
  VideoPlayerPlayButton,
  VideoPlayerContent,
  VideoPlayerControlBar,
  VideoPlayerSeekBackwardButton,
  VideoPlayerTimeRange,
  VideoPlayerMuteButton,
  VideoPlayerVolumeRange,
} from "./kibo-ui/video-player";

interface PopupVideoProps {
  videoUrl: string;
}

export default function PopupVideo({ videoUrl }: PopupVideoProps) {
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="outline" size="icon">
          <Info className="h-8 w-8" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl py-4 px-2 sm:p-6 sm:py-8">
        <DialogHeader>
          <DialogTitle>How it works?</DialogTitle>
          <DialogDescription>
            Watch the video to learn how to use the platform.
          </DialogDescription>
        </DialogHeader>
        <div className="sm:my-4 sm:mx-auto">
          <VideoPlayer className="overflow-hidden rounded-lg border">
            <VideoPlayerContent
              preload="auto"
              slot="media"
              src={videoUrl}
            />
            <VideoPlayerControlBar>
              <VideoPlayerPlayButton />
              <VideoPlayerSeekBackwardButton />
              <VideoPlayerSeekForwardButton />
              <VideoPlayerTimeRange />
              <VideoPlayerTimeDisplay showDuration />
              <VideoPlayerMuteButton />
              <VideoPlayerVolumeRange />
            </VideoPlayerControlBar>
          </VideoPlayer>
        </div>
      </DialogContent>
    </Dialog>
  );
}
