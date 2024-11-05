"use client";
import PodcastCard from "#/components/PodcastCard";
import { useQuery } from "convex/react";
import { api } from "#/convex/_generated/api";
import LoaderSpinner from "#/components/LoaderSpinner";
import ImageCard from "#/components/ImageCard";

const Home = () => {
  const trendingPodcasts = useQuery(api.podcasts.getTrendingPodcasts);
  const trendingImages = useQuery(api.images.getTrendingImages);
  if (!trendingPodcasts) return <LoaderSpinner />;
  return (
    <div className="mt-9 flex flex-col gap-9 md:overflow-hidden">
      <section className="flex flex-col gap-5">
        <h1 className="text-20 font-bold text-white-1">Trending Podcasts</h1>

        <div className="podcast_grid">
          {trendingPodcasts?.map(
            ({ _id, podcastTitle, podcastDescription, imageUrl }) => (
              <PodcastCard
                key={_id}
                imgUrl={imageUrl as string}
                title={podcastTitle}
                description={podcastDescription}
                podcastId={_id}
              />
            )
          )}
        </div>
        <h1 className="text-20 pt-10 font-bold text-white-1">Trending Arts</h1>

        <div className="podcast_grid">
          {trendingImages?.map(
            ({ _id, imageDescription, author, imageUrl }) => (
              <ImageCard
                key={_id}
                imgUrl={imageUrl as string}
                title={author}
                description={imageDescription}
                imageId={_id}
              />
            )
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
