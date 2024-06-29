// pages/articles/[slug].js
import { useRouter } from 'next/router';
import client from '../../contentful';

const Article = ({ article }) => {
  const router = useRouter();

  if (!router.isFallback && !article) {
    return <div>مقال غير موجود</div>;
  }

  return (
    <div>
      <h1>{article.fields.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: article.fields.body }} />
    </div>
  );
};

export async function getStaticPaths() {
  const res = await client.getEntries({ content_type: 'article' });
  const paths = res.items.map(item => ({
    params: { slug: item.fields.slug },
  }));

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const res = await client.getEntries({
    content_type: 'article',
    'fields.slug': params.slug,
  });

  return {
    props: {
      article: res.items[0] || null,
    },
    revalidate: 1,
  };
}

export default Article;
