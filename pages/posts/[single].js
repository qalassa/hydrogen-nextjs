import { getArticle } from '../../lib/api';
import PostSingle from '@layouts/PostSingle';
import client from '@lib/contentful';

const Article = ({ post, content, slug, posts }) => {
  return (
    <PostSingle content={content} slug={slug} post={post} posts={posts} />
  );
};

export default Article;

export const getStaticPaths = async () => {
  const res = await client.getEntries({ content_type: 'article' });
  const paths = res.items.map(item => ({
    params: { single: item.fields.slug.toString() },
  }));

  return { paths, fallback: 'blocking' };
};

export const getStaticProps = async ({ params }) => {
  const { slug } = params;
  try {
    const article = await getArticle(slug);
    if (!article) {
      return { notFound: true };
    }
    return {
      props: {
        post: {
          frontmatter: {
            title: article.title,
            date: article.date,
            image: article.articleImage?.url,
            author: article.authorName,
            categories: [article.categoryName],
          },
          content: article.details?.json,
          slug: article.slug,
          summary: article.summary || '',
        },
      },
    };
  } catch (error) {
    console.error(`Error fetching article for slug ${slug}:`, error);
    return { notFound: true };
  }
};

