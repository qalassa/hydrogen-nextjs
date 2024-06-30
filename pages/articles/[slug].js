import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import client from '@lib/contentful';
import PostSingle from '@layouts/PostSingle';

const Article = ({ post, content, slug, posts }) => {
  return (
    <PostSingle content={content} slug={slug} post={post} posts={posts} />
  );
};

export default Article;

export const getStaticPaths = async () => {
  const res = await client.getEntries({ content_type: 'article' });
  const paths = res.items.map((item) => ({
    params: { slug: item.fields.slug.toString() }, // Ensure slug is a string
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params }) => {
  const { slug } = params;
  try {
    const postRes = await client.getEntries({
      content_type: 'article',
      'fields.slug': slug,
    });

    if (!postRes.items.length) {
      console.log(`No post found for slug: ${slug}`);
      return { notFound: true };
    }

    const post = postRes.items[0];
    const content = post.fields.body;

    return {
      props: {
        post: JSON.parse(JSON.stringify(post.fields)),
        content: JSON.parse(JSON.stringify(content)),
        slug,
      },
    };
  } catch (error) {
    console.error(`Error fetching post for slug ${slug}:`, error);
    return { notFound: true };
  }
};
