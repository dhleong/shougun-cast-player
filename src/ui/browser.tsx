import React from "react";

import { connect } from "the-mall";

import { IRecommendation } from "./store";
import { isLoadingRecommendations, recommendations } from "./subs";

const CoverArt = ({item}: {item: IRecommendation}) => {
  if (item.cover) {
    return (
      <img className="cover-image"
        src={item.cover}
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

const Title = ({item}: {item: IRecommendation}) => {
  if (!item.cover) {
    return null;
  }

  return (
    <div className="title">
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
      <Title item={item} />
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
  if (isLoadingRecommendations().deref()) {
    // TODO show "loading"?

    return null;
  }

  const recommendedItems = recommendations().deref();
  if (!recommendedItems.length) {
    // nothing to show? don't bother with overlay
    return null;
  }

  return (
    <div className="browser">
      <Carousel
        label="Recently Watched"
        items={recommendedItems}
      />
    </div>
  );
});
