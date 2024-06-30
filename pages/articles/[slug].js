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

  const allPosts = await client.getEntries({ content_type: 'article' });
  const postRes = await client.getEntries({
    content_type: 'article',
    'fields.slug': slug,
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
