import { createContext, useContext } from "react";
import posts from "../.json/posts.json";

const HeaderContext = createContext();
export const TaxonomySlugProvider = ({ children }) => {
  // Ensure posts and frontmatter are valid before proceeding
  const categories = posts.reduce((acc, post) => {
    const postCategories = post.frontmatter?.categories || [];
    return [...acc, ...postCategories];
  }, []);

  const uniqueCategories = [...new Set(categories)].map(item => ({
    name: item,
    url: `/categories/${item.toLowerCase()}`
  }));

  return (
    <HeaderContext.Provider value={{ categories: uniqueCategories }}>
      {children}
    </HeaderContext.Provider>
  );
};

export const useHeaderContext = () => {
  return useContext(HeaderContext);
};
