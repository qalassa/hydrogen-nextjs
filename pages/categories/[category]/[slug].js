import client from '@lib/contentful';
import Base from '@layouts/Baseof';
import { MDXRemote } from 'next-mdx-remote';
import Image from 'next/image';
import shortcodes from "@shortcodes/all";

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

  const paths = res.items
    .filter(item => item.fields.categoryName && item.fields.slug)
    .map(item => {
      const category = item.fields.categoryName;
      return {
        params: { category: encodeURIComponent(category).toLowerCase(), slug: item.fields.slug }
      };
    });

  return { paths, fallback: 'blocking' };
};

export const getStaticProps = async ({ params }) => {
  const { category, slug } = params;
  try {
    const res = await client.getEntries({
      content_type: 'article',
      'fields.slug': slug,
      'fields.categoryName': decodeURIComponent(category),
    });

    if (!res.items.length) {
      console.log(`No post found for slug: ${slug} in category: ${category}`);
      return { notFound: true };
    }

    const post = res.items[0];
    const content = post.fields.body;

    // Ensure content is properly serialized
    const serializedContent = content ? JSON.parse(JSON.stringify(content)) : null;

    return {
      props: {
        post: {
          frontmatter: post.fields,
          content: serializedContent,
        },
      },
    };
  } catch (error) {
    console.error(`Error fetching post for category ${category} and slug ${slug}:`, error);
    return { notFound: true };
  }
};
