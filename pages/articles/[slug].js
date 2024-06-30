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

export async function getStaticPaths() {
  const res = await client.getEntries({ content_type: 'article' });
  const paths = res.items.map((item) => ({
    params: { slug: item.fields.slug },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const { items } = await client.getEntries({
    content_type: 'article',
    'fields.slug': params.slug,
  });

  if (!items.length) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      article: items[0],
    },
  };
}
