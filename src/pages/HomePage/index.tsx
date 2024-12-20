import { lazy, Suspense } from "react";
import { useRecoilState } from "recoil";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useNavigate } from "react-router-dom";

import Section from "@/components/commons/Section/Section";
import ItemBox from "@/components/commons/ItemBox/ItemBox";
import Banner from "@/components/commons/Banner/Banner";
import SearchBar from "@/components/commons/SearchBar";
import Image from "@/components/commons/Image";
import Text from "@/components/commons/Text";

import styles from "./HomePage.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

import { useGetDestinationSearchQuery } from "@/hooks/destination/queries/useGetDestinationSearchQuery";
import { useGetCourseSearchQuery } from "@/hooks/course/queries/useGetCourseSearchQuery";
import { useGetCourseQuery } from "@/hooks/course/queries/useGetCourseQuery";
import { DestinationBadgesState } from "@/recoil/serviceAtom";
import { tagResponseDto } from "@/api/tag/type";
import { bannerItemsData, busanData, LikeMockData } from "./data.js";
const Card = lazy(() => import("@/components/commons/Card/Card"));
const bannerItems = bannerItemsData;

interface ImageSizes {
  small: string;
  medium: string;
  large: string;
}

const HomePage = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [inputValue, setInputValue] = useState("");
  const { destinationSearchData } = useGetDestinationSearchQuery(1, inputValue);
  const { courseSearchData } = useGetCourseSearchQuery(1, inputValue);
  // const { courseData: coursePopularData } = useGetCourseQuery("record=4&page=1&orderBy=POPULAR");
  const { courseData: courseLikeData } = useGetCourseQuery("record=4&page=2&orderBy=LIKE");
  const [, setDestinationBadgesState] = useRecoilState(DestinationBadgesState);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
  };

  // 화면 크기에 따른 이미지 선택 함수
  const selectImageBySize = (image: ImageSizes) => {
    if (windowWidth <= 520) {
      return image.small;
    } else if (windowWidth > 520 && windowWidth <= 850) {
      return image.medium;
    } else {
      return image.large;
    }
  };

  // 윈도우 리사이즈 이벤트를 감지하여 windowWidth 상태를 업데이트
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // 리사이즈 이벤트 리스너 추가
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleClick = (tag: tagResponseDto) => {
    setDestinationBadgesState([tag]);
    navigate(`search`);
  };
  return (
    <div data-testid="home-page">
      <Section title="" className={cx("container")}>
        <SearchBar
          destination={destinationSearchData?.contents ?? []}
          course={courseSearchData?.contents ?? []}
          value={inputValue}
          onChange={handleInputChange}
          destinationTitle="여행지"
          courseTitle="코스"
        />
      </Section>

      <Section title="어떤 여행을 할까요? ">
        <div className={cx("banner-container")}>
          {bannerItems.small.map((item) => (
            <div className={cx("banner")} key={item.id} onClick={() => handleClick(item.tag)}>
              <Image imageInfo={item.image} />
              <h1>{item.title}</h1>
            </div>
          ))}
        </div>

        <div className={cx("banner-container")}>
          {bannerItems.large.map((item) => (
            <Banner
              key={item.id}
              image={selectImageBySize(item.image)}
              size="large"
              onClick={() => navigate(item.url)}
            />
          ))}
        </div>
      </Section>

      <Section title="코스메이커 추천">
        <div className={cx("card_container")}>
          <Suspense fallback={<LoadingSkeleton />}>
            {busanData.map((item) => (
              <Card key={item.id} name={"코스 찾기"} id={item.id}>
                <div className={cx("card-image-container")}>
                  <img loading="lazy" alt={item.location} src={item.image} className={cx("card-image")} />
                  <div className={cx("card-content")}>
                    <Text className={cx("txt-title")} text={item.name} />
                    {/* <span className={cx("card-title")}>{item.name}</span> */}
                    <span className={cx("card-subtitle")}>{item.location}</span>
                  </div>
                </div>
              </Card>
            ))}
          </Suspense>
        </div>
      </Section>

      <Section title="요즘 인기있는 코스">
        <div className={cx("card_container")}>
          <Suspense fallback={<LoadingSkeleton />}>
            {courseLikeData?.contents.map((item, index) => (
              <Card key={item.id} name={"코스 찾기"} id={item.id}>
                <div className={cx("card-image-container")}>
                  <img src={LikeMockData[index].url} className={cx("card-image")} />
                  <Text className={cx("card-content-number")} text={index + 1} />
                  <div className={cx("card-content")}>
                    <ItemBox
                      color="white"
                      name={"코스 찾기"}
                      title={item.title}
                      travelerCount={item.travelerCount}
                      views={item.views}
                      duration={item.duration}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </Suspense>
        </div>
      </Section>
    </div>
  );
};

export default HomePage;

const LoadingSkeleton = () => (
  <>
    {Array.from({ length: 4 }).map((_, index) => (
      <div key={index} className={cx("card-container")}>
        <Skeleton className={cx("card-image")} />
        <div className={cx("card-content")}>
          <Skeleton count={3} />
        </div>
      </div>
    ))}
  </>
);
