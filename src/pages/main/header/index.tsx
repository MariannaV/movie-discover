import React from "react";
import { Radio, Form, Button, Checkbox } from "antd";
import { DownOutlined } from "@ant-design/icons";
import styles from "./index.scss";
import { NMovies, StoreMovies } from "../../../store/movies";

export enum sortBy {
  popularity = "popularity",
  novelty = "novelty",
  rating = "rating",
}

export function Header(props: {
  sortBy: sortBy;
  setSort: React.Dispatch<sortBy>;
  setGenresFilters: React.Dispatch<Array<NMovies.IGenre["id"]>>;
}): React.ReactElement {
  const onClick = React.useCallback((event) => {
    props.setSort(event.target.value);
  }, []);

  const moviesData: any = StoreMovies.useSelector(
    (store: NMovies.IStore) => store
  );

  const { genres } = moviesData;

  const [isOpen, setOpen] = React.useState(false);
  const toggleFilter = () => {
    setOpen((isOpen) => !isOpen);
  };

  const options: Array<any> = [];

  for (const genreID in genres) {
    options.push(genres[genreID].name);
  }

  const onFinish = (formValues: any) => {
    toggleFilter();
    props.setGenresFilters(formValues.genres);
  };

  const menu = React.useMemo(
    () => (
      <Form name="GenresFilter" onFinish={onFinish}>
        <Form.Item name="genres">
          <Checkbox.Group>
            {Object.values(genres).map((genre: any) => (
              <Checkbox
                value={genre.id}
                style={{ lineHeight: "32px" }}
                children={genre.name}
                key={genre.id}
              />
            ))}
            {/*{options.map(genre => <Checkbox value={genre} style={{lineHeight: '32px'}} children={genre}/>)}*/}
          </Checkbox.Group>
        </Form.Item>
        <Form.Item>
          <Button
            type={"primary"}
            htmlType="submit"
            size={"small"}
            children="OK"
          />
        </Form.Item>
      </Form>
    ),
    [options]
  );

  return (
    <div className={styles.header}>
      <div>
        <div>Sort by:</div>
        <Radio.Group
          value={props.sortBy}
          style={{ marginBottom: 16 }}
          onChange={onClick}
        >
          {[sortBy.popularity, sortBy.novelty, sortBy.rating].map(
            (sortType) => (
              <Radio.Button
                value={sortType}
                children={sortType}
                key={sortType}
              />
            )
          )}
        </Radio.Group>
      </div>
      <div className={styles.filtersBlock}>
        <p onClick={toggleFilter}>
          Select genre <DownOutlined />
        </p>
        <div
          className={[styles.blockWithForm, !isOpen && styles.hiddenBlock].join(
            " "
          )}
        >
          {menu}
        </div>
      </div>
    </div>
  );
}
