export const similerItems = (currentItem, allItems, slug) => {
  if (!currentItem || !Array.isArray(currentItem) || currentItem.length === 0) {
    console.error("currentItem is invalid:", currentItem);
    return [];
  }

  let categories = [];

  // Assuming currentItem[0] exists after the above check
  if (currentItem[0].frontmatter && currentItem[0].frontmatter.categories) {
    categories = currentItem[0].frontmatter.categories;
  }

  const filterByCategories = allItems.filter((item) =>
    item.frontmatter && item.frontmatter.categories.some(category => 
      categories.includes(category)
    )
  );

  const filterBySlug = filterByCategories.filter((item) => item.slug !== slug);

  return filterBySlug;
};

