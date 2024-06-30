// pages/categories/[category].js
import client from '@lib/contentful';
import Base from '@layouts/Baseof';
import Post from '@layouts/components/Post';

const Category = ({ posts, category }) => {
  if (!posts.length) {
    return <div>No posts found for this category</div>;
  }

  return (
    <Base>
      <div className="section">
        <div className="container">
          <div className="row">
            <div className="mx-auto lg:col-10">
              <h1 className="text-center capitalize">{category}</h1>
              <div className="row pt-12">
                {posts.map((post, i) => (
                  <Post
                    className="mb-6 sm:col-6"
                    key={`key-${i}`}
                    post={post}
                    href={`/categories/${category}/${post.slug}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Base>
  );
};

export default Category;

export const getStaticPaths = async () => {
  const res = await client.getEntries({ content_type: 'article' });
  const categories = res.items.flatMap(item => item.fields.categories || ['uncategorized']);
  const uniqueCategories = [...new Set(categories)];

  const paths = uniqueCategories.map(category => ({
    params: { category: encodeURIComponent(category).toLowerCase() }
  }));

  return { paths, fallback: 'blocking' };
};

export const getStaticProps = async ({ params }) => {
  try {
    const res = await client.getEntries({
      content_type: 'article',
      'fields.categories[in]': decodeURIComponent(params.category),
    });

    if (!res.items.length) {
      console.log(`No posts found for category: ${params.category}`);
      return { notFound: true };
    }

    const posts = res.items.map((item) => ({
      title: item.fields.title,
      slug: item.fields.slug,
      publishedDate: item.fields.publishedDate,
      categories: item.fields.categories,
    }));

    const sortedPosts = posts.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));

    return {
      props: {
        posts: JSON.parse(JSON.stringify(sortedPosts)),
        category: decodeURIComponent(params.category),
      },
    };
  } catch (error) {
    console.error(`Error fetching posts for category ${params.category}:`, error);
    return { props: { posts: [], category: decodeURIComponent(params.category) } };
  }
};
