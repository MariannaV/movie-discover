import React, { ReactElement } from "react";
import { Radio } from "antd";

export enum sortBy {
  popularity = "popularity",
  novelty = "novelty",
  rating = "rating",
}

export function Header(props: {
  sortBy: sortBy;
  setSort: React.Dispatch<sortBy>;
}): React.ReactElement {
  const onClick = React.useCallback((event) => {
    props.setSort(event.target.value);
  }, []);

  return (
    <div>
      <div>Sort by:</div>
      <Radio.Group
        value={props.sortBy}
        style={{ marginBottom: 16 }}
        onChange={onClick}
      >
        {[sortBy.popularity, sortBy.novelty, sortBy.rating].map((sortType) => (
          <Radio.Button value={sortType} children={sortType} key={sortType} />
        ))}
      </Radio.Group>
    </div>
  );
}
