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

// Function to fetch data using GraphQL
async function fetchGraphQL(query, preview = false) {
  const endpoint = `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`;
  const accessToken = preview ? process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN : process.env.CONTENTFUL_ACCESS_TOKEN;
  
  console.log("Endpoint:", endpoint);
  console.log("Using access token:", accessToken);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      },
      body: JSON.stringify({ query })
    });

    const data = await response.json();

    if (data.errors) {
      console.error("GraphQL errors:", JSON.stringify(data.errors));
      return null;
    }

    console.log("Data received:", JSON.stringify(data));
    return data;
  } catch (error) {
    console.error("Error fetching GraphQL data:", error);
    return null;
  }
}

// Function to extract article entries from the fetch response
function extractArticleEntries(fetchResponse) {
  return fetchResponse?.data?.articleCollection?.items;
}


// Function to get a single article based on slug
export async function getArticle(slug, isDraftMode = false) {
  const query = `
    query {
      articleCollection(where: {slug: "${slug}"}, limit: 1, preview: ${isDraftMode}) {
        items {
          ${ARTICLE_GRAPHQL_FIELDS}
        }
      }
    }
  `;

  console.log("Executing query for getArticle:", query);

  const article = await fetchGraphQL(query, isDraftMode);
  return article ? extractArticleEntries(article)[0] : null;
}

// Function to get all articles with a limit parameter
export async function getAllArticles(limit = 10) {
  const query = `
    query {
      articleCollection(limit: ${limit}) {
        items {
          ${ARTICLE_GRAPHQL_FIELDS}
        }
      }
    }
  `;

  console.log("Executing query for getAllArticles:", query);

  const articles = await fetchGraphQL(query);
  return articles ? extractArticleEntries(articles) : [];
}
