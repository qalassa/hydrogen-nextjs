import { BLOCKS, INLINES } from '@contentful/rich-text-types';
import client from '@lib/contentful';
import PostSingle from '@layouts/PostSingle';

const Article = ({ post, content, slug, posts }) => {
  return (
    <PostSingle content={content} slug={slug} post={post} posts={posts} />
  );
};

export default Article;

// get post single slug
export const getStaticPaths = async () => {
  const res = await client.getEntries({ content_type: 'article' });
  const paths = res.items.map((item) => ({
    params: { single: item.fields.slug.toString() }, // Ensure slug is a string
  }));

  return {
    paths,
    fallback: false,
  };
};

// get post single content
export const getStaticProps = async ({ params }) => {
  const { single } = params;
  try {
    const postRes = await client.getEntries({
      content_type: 'article',
      'fields.slug': single,
    });

    if (!postRes.items.length) {
      console.log(`No post found for slug: ${single}`);
      return { notFound: true };
    }

    const post = postRes.items[0];
    const content = post.fields.body;

    return {
      props: {
        post: JSON.parse(JSON.stringify(post.fields)),
        content: JSON.parse(JSON.stringify(content)),
        slug: single,
      },
    };
  } catch (error) {
    console.error(`Error fetching single post ${single}:`, error);
    return { notFound: true };
  }
};
