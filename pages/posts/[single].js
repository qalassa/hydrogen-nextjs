import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import client from '@lib/contentful';
import PostSingle from '@layouts/PostSingle';

const Article = ({ post, mdxContent, slug, posts }) => {
  return (
    <PostSingle mdxContent={mdxContent} slug={slug} post={post} posts={posts} />
  );
};

export default Article;

// get post single slug
export const getStaticPaths = async () => {
  // Fetch all articles from Contentful
  const res = await client.getEntries({ content_type: 'article' });
  const paths = res.items.map((item) => ({
    params: {
      single: item.fields.slug,
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

// get post single content
export const getStaticProps = async ({ params }) => {
  const { single } = params;

  // Fetch all posts
  const allPosts = await client.getEntries({ content_type: 'article' });

  // Fetch the specific post by slug
  const postRes = await client.getEntries({
    content_type: 'article',
    'fields.slug': single,
  });

  const post = postRes.items[0];

  // Convert rich text to React components
  const mdxContent = post ? documentToReactComponents(post.fields.body) : null;

  // Map all posts to the required format
  const posts = allPosts.items.map((item) => ({
    title: item.fields.title,
    slug: item.fields.slug,
    publishedDate: item.fields.publishedDate,
    category: item.fields.category,
    content: item.fields.body,
  }));

  return {
    props: {
      post: post.fields,
      mdxContent: mdxContent,
      slug: single,
      posts: posts,
    },
  };
};
