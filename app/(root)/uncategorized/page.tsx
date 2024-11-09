"use client";
import EmptyState from "#/components/EmptyState";
import PodcastCard from "#/components/PodcastCard";
import { Input } from "#/components/ui/input";
import { api } from "#/convex/_generated/api";
import { cn } from "#/lib/utils";
import { Button } from "@/components/ui/button";
import { useQuery } from "convex/react";
import { Search } from "lucide-react";
import React, { useState } from "react";

const Page = () => {
  const allImagesData = useQuery(api.picture.getAllPics);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 24;
  const filteredImages = allImagesData?.filter((image) =>
    image.image_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredImages?.slice(indexOfFirstItem, indexOfLastItem);

  const nextPage = () => {
    if (currentPage * itemsPerPage < (filteredImages?.length || 0)) {
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
        <div className="flex pb-[40px] flex-col sm:flex-row gap-2 sm:items-center sm:gap-4">
          <h1 className="text-20 sm:w-fit font-bold text-white-1">
            Uncategorized Pictures
          </h1>
          <div className="flex items-center border border-[#374151] pr-2 rounded-md">
            <Search className="w-5 h-5 text-gray-500 mx-2" />{" "}
            <Input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className={cn(
                "flex-grow sm:w-[300px] px-2 border-none text-white py-1 bg-transparent outline-none",
                {
                  "focus:ring-2 focus:ring-blue-500": searchTerm,
                }
              )}
            />
          </div>
        </div>
        {filteredImages && filteredImages.length > 0 ? (
          <div className="podcast_grid">
            {currentItems?.map(
              ({
                _id,
                image_id,
                image_url,
                image_name,
                user,
                _creationTime,
              }) => (
                <PodcastCard
                  key={_id}
                  id={_id}
                  image_name={image_name}
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
              currentPage * itemsPerPage >= (filteredImages?.length || 0)
            }
          >
            Next
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Page;
