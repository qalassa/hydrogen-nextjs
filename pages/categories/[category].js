import client from '@lib/contentful';
import Base from '@layouts/Baseof';
import Post from '@layouts/components/Post';

const Category = ({ posts, slug }) => {
  return (
    <Base>
      <div className="section">
        <div className="container">
          <div className="row">
            <div className="mx-auto lg:col-10">
              <h1 className="text-center capitalize">{slug}</h1>
              <div className="row pt-12">
                {posts.map((post, i) => (
                  <Post className="mb-6 sm:col-6" key={`key-${i}`} post={post} />
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
  const allCategories = res.items.map((item) => item.fields.category);

  const uniqueCategories = [...new Set(allCategories)].filter(Boolean);

  const paths = uniqueCategories.map((category) => ({
    params: { category: category.toString() },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params }) => {
  try {
    const res = await client.getEntries({
      content_type: 'article',
      'fields.category': params.category,
    });

    if (!res.items.length) {
      console.log(`No posts found for category: ${params.category}`);
      return { notFound: true };
    }

    const posts = res.items.map((item) => ({
      title: item.fields.title,
      body: item.fields.body,
      slug: item.fields.slug,
      publishedDate: item.fields.publishedDate,
      category: item.fields.category,
    }));

    const sortedPosts = posts.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));

    return {
      props: {
        posts: JSON.parse(JSON.stringify(sortedPosts)),
        slug: params.category,
      },
    };
  } catch (error) {
    console.error(`Error fetching posts for category ${params.category}:`, error);
    return { props: { posts: [], slug: params.category } };
  }
};

