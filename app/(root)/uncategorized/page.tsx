"use client";
import EmptyState from "#/components/EmptyState";
import PodcastCard from "#/components/PodcastCard";
import { api } from "#/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { useQuery } from "convex/react";
import React, { useState } from "react";

const page = () => {
  const allImagesData = useQuery(api.picture.getAllPics);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = allImagesData?.slice(indexOfFirstItem, indexOfLastItem);
  const nextPage = () => {
    if (currentPage * itemsPerPage < (allImagesData?.length || 0)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="flex flex-col gap-9 md:overflow-hidden">
      <section className="flex flex-col gap-5 pb-5">
        <h1 className="text-20 font-bold text-white-1">
          Uncategorized Pictures
        </h1>
        {allImagesData && allImagesData?.length > 0 ? (
          <div className="podcast_grid">
            {currentItems?.map(
              ({ _id, image_id, image_url, user, _creationTime }) => (
                <PodcastCard
                  key={_id}
                  id={_id}
                  image_url={image_url}
                  image_id={image_id}
                  user={user}
                  _creationTime={_creationTime}
                />
              )
            )}
          </div>
        ) : (
          <div className="pt-[50px] pb-[80px]">
            <EmptyState
              title="No Data found!"
              buttonLink="/uncategorized"
              buttonText="Sync more pictures"
            />
          </div>
        )}

        <div className="flex justify-between items-center mt-4">
          <Button
            onClick={prevPage}
            className="px-4 py-2 bg-gray-500 text-white rounded"
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-white-1">Page {currentPage}</span>
          <Button
            onClick={nextPage}
            className="px-4 py-2 bg-gray-500 text-white rounded"
            disabled={
              currentPage * itemsPerPage >= (allImagesData?.length || 0)
            }
          >
            Next
          </Button>
        </div>
      </section>
    </div>
  );
};

export default page;
