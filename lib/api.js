const ARTICLE_GRAPHQL_FIELDS = `
  sys {
    id
  }
  title
  slug
  summary
  details {
    json
    links {
      assets {
        block {
          sys {
            id
          }
          url
          description
        }
      }
    }
  }
  date
  authorName
  categoryName
  articleImage {
    url
  }
`;

async function fetchGraphQL(query, preview = false) {
  try {
    const response = await fetch(
      `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`,
      {
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
      }
    );
    const data = await response.json();
    if (data.errors) {
      console.error("GraphQL errors:", data.errors);
    }
    return data;
  } catch (error) {
    console.error("Error fetching GraphQL data:", error);
    throw new Error("Failed to fetch GraphQL data");
  }
}

function extractArticleEntries(fetchResponse) {
  return fetchResponse?.data?.articleCollection?.items || [];
}

export async function getArticle(slug, isDraftMode = false) {
  const article = await fetchGraphQL(
    `query {
      articleCollection(where:{slug: "${slug}"}, limit: 1, preview: ${
      isDraftMode ? "true" : "false"
    }) {
        items {
          ${ARTICLE_GRAPHQL_FIELDS}
        }
      }
    }`,
    isDraftMode
  );
  if (!article || !article.data || !article.data.articleCollection || !article.data.articleCollection.items) {
    console.error(`No data found for slug: ${slug}`);
    return null;
  }
  return extractArticleEntries(article)[0];
}

export async function getAllArticles() {
  const articles = await fetchGraphQL(
    `query {
      articleCollection(limit: 100) {
        items {
          ${ARTICLE_GRAPHQL_FIELDS}
        }
      }
    }`
  );
  return extractArticleEntries(articles);
}
