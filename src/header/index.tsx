import { Authorization } from "../authorization";
import React from "react";
import headerStyles from "./index.scss";

export function Header() {
  return (
    <header className={headerStyles.header}>
      <h1>Movie Discover</h1>
      <Authorization />
    </header>
  );
}
