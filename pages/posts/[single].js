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
    const post = await getArticle(slug);
    if (!post) {
      return { notFound: true };
    }
    return {
      props: {
        post: {
          frontmatter: {
            title: post.title,
            date: post.date,
            image: post.articleImage?.url,
            categories: [post.categoryName],
            author: post.authorName,
          },
          content: post.details?.json,
        },
        slug,
      },
    };
  } catch (error) {
    console.error(`Error fetching post for slug ${slug}:`, error);
    return { notFound: true };
  }
};

