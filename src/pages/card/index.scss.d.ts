declare namespace IndexScssNamespace {
  export interface IIndexScss {
    file: string;
    mappings: string;
    movieCard: string;
    names: string;
    sources: string;
    sourcesContent: string;
    version: string;
  }
}

declare const IndexScssModule: IndexScssNamespace.IIndexScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: IndexScssNamespace.IIndexScss;
};

export = IndexScssModule;
