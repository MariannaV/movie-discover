import React from "react";
import { Authorization } from "../authorization";
import headerStyles from "./index.scss";

export function Header() {
  return (
    <header className={headerStyles.header}>
      <h1 className={headerStyles.headerTitle}>Movie Discover</h1>
      <Authorization />
    </header>
  );
}

export default React.memo(Header);
