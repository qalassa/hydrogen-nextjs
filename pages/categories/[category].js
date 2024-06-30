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
  try {
    const res = await client.getEntries({ content_type: 'article' });
    const categories = res.items.map(item => item.fields.categoryName || 'uncategorized');
    const uniqueCategories = [...new Set(categories)];

    const paths = uniqueCategories.map(category => ({
      params: { category: encodeURIComponent(category).toLowerCase() }
    }));

    console.log('Generated paths for categories:', paths);

    return { paths, fallback: 'blocking' };
  } catch (error) {
    console.error('Error generating paths for categories:', error);
    return { paths: [], fallback: false };
  }
};

export const getStaticProps = async ({ params }) => {
  try {
    const res = await client.getEntries({
      content_type: 'article',
      'fields.categoryName': params.category,
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
      category: item.fields.categoryName,
    }));

    const sortedPosts = posts.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));

    console.log(`Fetched posts for category ${params.category}:`, sortedPosts);

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
