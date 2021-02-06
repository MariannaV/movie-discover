import React from "react";
import { Spin } from "antd";
import styles from "./index.scss";

export function Loader(): React.ReactElement {
  return <Spin size="default" className={styles.loader} />;
}
