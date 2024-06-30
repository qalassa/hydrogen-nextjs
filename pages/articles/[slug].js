import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import client from '@lib/contentful';
import PostSingle from '@layouts/PostSingle';

const Article = ({ post, mdxContent, slug, posts }) => {
  return (
    <PostSingle mdxContent={mdxContent} slug={slug} post={post} posts={posts} />
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

  const allPosts = await client.getEntries({ content_type: 'article' });
  const postRes = await client.getEntries({
    content_type: 'article',
    'fields.slug': slug,
  });

  const post = postRes.items[0];

  // Convert rich text to a JSON object for serialization
  const mdxContent = post ? JSON.parse(JSON.stringify(post.fields.body)) : '';

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
      mdxContent,
      slug,
      posts: JSON.parse(JSON.stringify(posts)),
    },
  };
};
