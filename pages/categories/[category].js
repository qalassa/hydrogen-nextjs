import client from '@lib/contentful';
import Base from '@layouts/Baseof';
import Post from '@layouts/components/Post';
import { getArticle ,getAllArticles } from '../../lib/api';

const Category = ({ posts, slug }) => {
  if (!posts.length) {
    return <div>No posts found for this category</div>;
  }
  return (
    <Base>
      <div className="section">
        <div className="container">
          <div className="row">
            <div className="mx-auto lg:col-10">
              <h1 className="text-center capitalize">{decodeURIComponent(slug)}</h1>
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
    const categoryName = decodeURIComponent(params.category);
    const articles = await client.getEntries({
      content_type: 'article',
      'fields.categoryName': categoryName,
    });
    if (!articles.items.length) {
      return { notFound: true };
    }
    const posts = articles.items.map((item) => ({
      title: item.fields.title,
      slug: item.fields.slug,
      date: item.fields.date,
      image: item.fields.articleImage?.fields?.file?.url,
      author: item.fields.authorName,
      categories: [item.fields.categoryName],
      summary: item.fields.summary || '',
    }));
    return {
      props: {
        posts: JSON.parse(JSON.stringify(posts)),
        category: categoryName,
      },
    };
  } catch (error) {
    console.error(`Error fetching posts for category ${params.category}:`, error);
    return { props: { posts: [], category: params.category } };
  }
};
