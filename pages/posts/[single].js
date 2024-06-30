import { getArticle } from "../../lib/api";
import PostSingle from '@layouts/PostSingle';
import client from "../../lib/conentful.js";
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

  return { paths, fallback: false };
};

export const getStaticProps = async ({ params }) => {
  const { single } = params;
  try {
    const postRes = await getArticle(single);

    if (!postRes) {
      console.log(`No post found for slug: ${single}`);
      return { notFound: true };
    }

    const post = postRes;
    const content = post.details.json;

    return {
      props: {
        post,
        content,
        slug: single,
      },
    };
  } catch (error) {
    console.error(`Error fetching single post ${single}:`, error);
    return { notFound: true };
  }
};
