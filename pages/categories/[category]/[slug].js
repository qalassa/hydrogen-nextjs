// pages/categories/[category]/[slug].js
import client from '@lib/contentful';
import Base from '@layouts/Baseof';
import Post from '@layouts/components/Post';
import { MDXRemote } from 'next-mdx-remote';
import Image from 'next/image';
import shortcodes from "@shortcodes/all";  // Ensure this import is correct based on your project structure

const PostSingle = ({ post }) => {
  if (!post) {
    return <div>Article not found</div>;
  }

  const { frontmatter, content } = post;

  return (
    <Base>
      <div className="section">
        <div className="container">
          <div className="row">
            <div className="mx-auto lg:col-10">
              <h1 className="text-center capitalize">{frontmatter.title}</h1>
              <article>
                {frontmatter.image && (
                  <Image
                    className="w-full"
                    src={frontmatter.image}
                    height="500"
                    width="1000"
                    alt={frontmatter.title}
                    priority={true}
                  />
                )}
                <div className="content text-left">
                  <MDXRemote {...content} components={shortcodes} />
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </Base>
  );
};

export default PostSingle;

export const getStaticPaths = async () => {
  const res = await client.getEntries({ content_type: 'article' });
  const paths = res.items.map(item => {
    const category = item.fields.categories[0];
    return {
      params: { category: encodeURIComponent(category).toLowerCase(), slug: item.fields.slug }
    };
  });

  return { paths, fallback: 'blocking' };
};

export const getStaticProps = async ({ params }) => {
  try {
    const res = await client.getEntries({
      content_type: 'article',
      'fields.slug': params.slug,
      'fields.categories[in]': decodeURIComponent(params.category),
    });

    if (!res.items.length) {
      console.log(`No posts found for category: ${params.category}`);
      return { notFound: true };
    }

    const post = res.items[0];

    return {
      props: {
        post: {
          frontmatter: post.fields,
          content: post.fields.body, // assuming body contains the MDX content
        },
      },
    };
  } catch (error) {
    console.error(`Error fetching post for category ${params.category} and slug ${params.slug}:`, error);
    return { props: { post: null } };
  }
};
