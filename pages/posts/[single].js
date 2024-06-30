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

  const allPosts = await client.getEntries({ content_type: 'article' });
  const postRes = await client.getEntries({
    content_type: 'article',
    'fields.slug': single,
  });

  const post = postRes.items[0];
  const content = post ? post.fields.body : '';

  const posts = allPosts.items.map((item) => ({
    title: item.fields.title,
    slug: item.fields.slug,
    publishedDate: item.fields.publishedDate,
    category: item.fields.category,
    content: item.fields.body,
  }));

  return {
    props: {
      post: post ? JSON.parse(JSON.stringify(post.fields)) : null,
      content: JSON.parse(JSON.stringify(content)),
      slug,
      posts: JSON.parse(JSON.stringify(posts)),
    },
  };
};
