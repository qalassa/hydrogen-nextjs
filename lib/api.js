const ARTICLE_GRAPHQL_FIELDS = `
  sys { id }
  title
  slug
  summary
  date
  authorName
  categoryName
  articleImage { url }
`;

async function fetchGraphQL(query, preview = false) {
  try {
    const response = await fetch(`https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          preview
            ? process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN
            : process.env.CONTENTFUL_ACCESS_TOKEN
        }`,
      },
      body: JSON.stringify({ query }),
    });
    const data = await response.json();
    if (data.errors) {
      console.error("GraphQL errors:", JSON.stringify(data.errors));
      return null;
    }
    return data;
  } catch (error) {
    console.error("Error fetching GraphQL data:", error);
    return null;
  }
}


function extractArticleEntries(fetchResponse) {
  return fetchResponse?.data?.articleCollection?.items || [];
}

export async function getArticle(slug, isDraftMode = false) {
  const article = await fetchGraphQL(
    `query {
      articleCollection(where: {slug: "${slug}"}, limit: 1, preview: ${isDraftMode ? "true" : "false"}) {
        items {
          ${ARTICLE_GRAPHQL_FIELDS}
        }
      }
    }`,
    isDraftMode
  );
  if (!article) {
    return null;
  }
  return extractArticleEntries(article)[0];
}


export async function getAllArticles() {
  const articles = await fetchGraphQL(
    `query {
      articleCollection(limit: 10) { // Adjust the limit as necessary
        items {
          ${ARTICLE_GRAPHQL_FIELDS}
        }
      }
    }`
  );
  if (!articles) {
    return [];
  }
  return extractArticleEntries(articles);
}

