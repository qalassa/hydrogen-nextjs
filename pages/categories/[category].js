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

    const posts = res.items.map((item) => ({
      title: item.fields.title,
      body: item.fields
