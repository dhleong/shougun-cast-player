import debug from "debug";
import React from "react";

import { connect, useDispatch } from "the-mall";

import { addRecommendations } from "./events";
import { IRecommendation, IShougunState } from "./store";
import { isLoadingRecommendations, recommendations } from "./subs";

const CoverArt = ({item}: {item: IRecommendation}) => {
  if (item.cover) {
    return (
      <img className="cover-image"
        src={item.cover.replace("https:", "")}
        alt={item.title}
      />
    );
  }

  return (
    <div className="cover-label">
      {item.title}
    </div>
  );
};

const CarouselItem = connect(({
  item,
}: {
  item: IRecommendation,
}) => {

  return (
    <div className="carousel-item">
      <div className="cover">
        <CoverArt item={item} />
      </div>
      <div className="title">{item.title}</div>
    </div>
  );
});

const Carousel = connect(({
  label,
  items,
}: {
  label: string,
  items: IRecommendation[],
}) => {

  const children = items.map(item => (
    <CarouselItem key={item.id} item={item} />
  ));

  const duration = 5 * items.length;
  const animationDuration = `${duration}s`;

  return (
    <div className="carousel-container">
      <div className="label">{label}</div>
      <div className="carousel" style={{ animationDuration }}>{children}</div>
    </div>
  );
});

export const Browser = connect(() => {
  const dispatch = useDispatch<IShougunState>();

  if (isLoadingRecommendations().deref()) {
    // TODO show "loading"?

    if (debug.enabled("shougun:browser")) {
      dispatch(addRecommendations([
        {
          cover: "https://img1.hulu.com/user/v3/artwork/f11df77f-115e-4eba-8efa-264f0ff322d0?base_image_bucket_name=image_manager&base_image=1e20918d-629f-4720-a44e-29b01c22d133&operations=%5B%7B%22resize%22%3A%22800x800%7Cmax%22%7D%2C%7B%22format%22%3A%22jpeg%22%7D%5D",
          id: "babbling:HuluApp:the-good-place",
          title: "The Good Place",
        },

        {
          cover: "https://img4.hulu.com/user/v3/artwork/1138ee62-b9d9-4561-8094-3f7cda4bbd22?base_image_bucket_name=image_manager&base_image=85c6b7e5-0b6a-4730-9b60-66b20ea63fb4&operations=%5B%7B%22resize%22%3A%22600x600%7Cmax%22%7D%2C%7B%22format%22%3A%22jpeg%22%7D%5D",
          id: "babbling:HuluApp:the-rookie",
          title: "The Rookie",
        },
      ]));
    }

    return null;
  }

  const recommendedItems = recommendations().deref();

  return (
    <div className="browser">
      <Carousel
        label="Recently Watched"
        items={recommendedItems}
      />
    </div>
  );
});
