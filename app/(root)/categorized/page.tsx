"use client";
import CategorizedCard from "#/components/CategorizedCard";
import EmptyState from "#/components/EmptyState";
import { api } from "#/convex/_generated/api";
import useExportCsv from "#/hooks/useExportCsv";
import { Button } from "@/components/ui/button";
import classNames from "classnames";
import { useQuery } from "convex/react";
import { useState } from "react";

const Page = () => {
  const { handleExportXLSX } = useExportCsv();
  const allImagesData = useQuery(api.picture.getAllCategorizedPics);
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
        <div className="flex gap-5 items-center text-white-1">
          <h1 className="text-20 font-bold text-white-1">
            Categorized Pictures
          </h1>
          <Button
            disabled={allImagesData?.length === 0}
            onClick={() => handleExportXLSX(allImagesData)}
            className={classNames("px-4 py-2 text-white hover:bg-black-1 rounded border", {
              "bg-orange-1": allImagesData && allImagesData?.length > 0,
              "bg-gray-500": allImagesData?.length === 0,
            })}
          >
            Export to Excel
          </Button>
        </div>
        {currentItems && currentItems?.length > 0 ? (
          <div className="podcast_grid">
            {currentItems?.map(
              ({
                _id,
                image_id,
                categories,
                image_url,
                user,
                _creationTime,
              }) => (
                <CategorizedCard
                  key={_id}
                  id={_id}
                  image_url={image_url}
                  image_id={image_id}
                  user={user}
                  categories={categories}
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

export default Page;
