import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import client from '@lib/contentful';

const Article = ({ article }) => {
  if (!article || !article.fields) {
    return <div>Article not found</div>;
  }

  const { title, body } = article.fields;

  return (
    <div>
      <h1>{title}</h1>
      <div>{documentToReactComponents(body)}</div>
    </div>
  );
};

export default Article;

export const getStaticPaths = async () => {
  try {
    const res = await client.getEntries({ content_type: 'article' });

    const paths = res.items.map((item) => ({
      params: { slug: item.fields.slug },
    }));

    console.log("Generated paths:", paths);

    return {
      paths,
      fallback: 'blocking',
    };
  } catch (error) {
    console.error("Error in getStaticPaths:", error);
    throw error;
  }
};

export async function getStaticProps({ params }) {
  try {
    const { items } = await client.getEntries({
      content_type: 'article',
      'fields.slug': params.slug,
    });

    if (!items.length) {
      console.error(`No articles found for slug: ${params.slug}`);
      return { notFound: true };
    }

    console.log("Fetched article:", items[0]);

    return {
      props: { article: items[0] },
    };
  } catch (error) {
    console.error(`Error fetching article for slug: ${params.slug}`, error);
    return { notFound: true };
  }
}
