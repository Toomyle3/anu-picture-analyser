/* eslint-disable no-unused-vars */

import { Dispatch, SetStateAction } from "react";

import { Id } from "#/convex/_generated/dataModel";

export interface EmptyStateProps {
  title: string;
  search?: boolean;
  buttonText?: string;
  buttonLink?: string;
}

export interface GeneratePodcastProps {
  voiceType: string;
  setAudio: Dispatch<SetStateAction<string>>;
  audio: string;
  setAudioStorageId: Dispatch<SetStateAction<Id<"_storage"> | null>>;
  voicePrompt: string;
  setVoicePrompt: Dispatch<SetStateAction<string>>;
  setAudioDuration: Dispatch<SetStateAction<number>>;
}

export interface GenerateThumbnailProps {
  setImageUrl: Dispatch<string[]>;
  setImageStorageId: Dispatch<SetStateAction<Id<"_storage"> | null>>;
  setUploadedImages: Dispatch<SetStateAction<string[]>>;
  setStorageIds: Dispatch<SetStateAction<string[]>>;
  storageIds: string[];
  uploadedImages: string[];
}

export interface AudioProps {
  title: string;
  audioUrl: string;
  author: string;
  imageUrl: string;
  podcastId: string;
}

export interface AudioContextType {
  audio: AudioProps | undefined;
  setAudio: React.Dispatch<React.SetStateAction<AudioProps | undefined>>;
}

export interface PodcastCardProps {
  image_url: string;
  image_id: string;
  user: string;
  _creationTime: number;
}

export interface ImageCardProps {
  imgUrl: string;
  title: string;
  description: string;
  imageId: Id<"images">;
}

export interface ProfileCardProps {
  imageUrl: string;
  userFirstName: string;
  email: string;
  createTime: number;
}

export type UseDotButtonType = {
  selectedIndex: number;
  scrollSnaps: number[];
  onDotButtonClick: (index: number) => void;
};
