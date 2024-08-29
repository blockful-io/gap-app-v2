"use client";
import { useEffect } from "react";
import { useReviewStore } from "@/store/review";
import { useSearchParams } from "next/navigation";

import { GrantStory } from "@/types/review";

import { StarReviewIcon } from "@/components/Icons/StarReview";
import { CardReview } from "@/components/Pages/Project/Review/CardReview";
import { ChevronDown } from "@/components/Icons";

import { formatDate } from "@/utilities/formatDate";
import { getGrantStories } from "@/utilities/review/getGrantStories";
import { SCORER_ID } from "@/utilities/review/constants/constants";
import { getBadge } from "@/utilities/review/getBadge";
import { getBadgeIds } from "@/utilities/review/getBadgeIds";

export const NavbarReview = () => {
  const isStarSelected = useReviewStore((state: any) => state.isStarSelected);
  const stories = useReviewStore((state: any) => state.stories);
  const setStories = useReviewStore((state: any) => state.setStories);
  const grantUID = useReviewStore((state: any) => state.grantUID);
  const setBadges = useReviewStore((state: any) => state.setBadges);
  const searchParams = useSearchParams();
  const grantIdFromQueryParam = searchParams?.get("grantId");

  const handleToggleReviewSelected = (id: number) => {
    const currentSelection = useReviewStore.getState().isStarSelected;
    useReviewStore.setState({
      isStarSelected: currentSelection === id ? null : id,
    });
  };

  useEffect(() => {
    const fetchGrantStories = async () => {
      if (!grantIdFromQueryParam) return;
      const grantStories = await getGrantStories(
        "0x635c2d0642c81e3191e6eff8623ba601b7e22e832d7791712b6bc28d052ff2b5", // TODO: Remove this hardcoded value
        // grantUID ? grantUID : grantIdFromQueryParam
      );
      setStories(grantStories);
    };
    fetchGrantStories();
  }, [grantIdFromQueryParam, grantUID]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const badgeIds = await getBadgeIds(SCORER_ID);
        const badges = await Promise.all(badgeIds.map((id) => getBadge(id)));
        setBadges(badges);
      } catch (error) {
        console.log("error", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex px-2 gap-2 overflow-x-auto pb-4 relative scroller">
        {stories &&
          stories
            .sort((a: any, b: any) => Number(b.timestamp) - Number(a.timestamp))
            .map((storie: GrantStory, index: number) => (
              <div
                key={index}
                className="flex flex-col justify-center items-center text-center relative"
              >
                <p className="w-full">{formatDate(new Date(Number(storie.timestamp) * 1000))}</p>
                <div className="w-full flex flex-col items-center sm:px-14 px-4">
                  <StarReviewIcon
                    props={{
                      className: `w-20 h-20 ${isStarSelected === index && "text-[#004EEB]"}`,
                    }}
                    pathProps={{
                      className: "cursor-pointer",
                      fill: `${isStarSelected === index && "#004EEB"} `,
                      onClick: () => {
                        handleToggleReviewSelected(index);
                      },
                    }}
                  />
                  <p>{parseFloat(Number(storie.averageScore).toFixed(2).substring(0, 3)) / 100}</p>
                  {isStarSelected === index && (
                    <div>
                      <ChevronDown />
                    </div>
                  )}
                  {index < stories.length - 1 && (
                    <div className="absolute right-0 top-1/2 h-3/4 w-[2px] bg-zinc-300 transform -translate-y-1/2"></div>
                  )}
                </div>
              </div>
            ))}
      </div>
      <div className="w-full flex flex-col">
        {isStarSelected !== null && stories && <CardReview storie={stories[isStarSelected]} />}
      </div>
    </div>
  );
};
