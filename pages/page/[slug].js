import Pagination from '@components/Pagination';
import config from '@config/config.json';
import Post from '@layouts/components/Post';
import client from '@lib/contentful';
import { sortByDate } from '@lib/utils/sortFunctions';
const { blog_folder, pagination } = config.settings;

// blog pagination
const BlogPagination = ({ posts, currentPage, pagination }) => {
  const indexOfLastPost = currentPage * pagination;
  const indexOfFirstPost = indexOfLastPost - pagination;
  const totalPages = Math.ceil(posts.length / pagination);

  const currentPosts = sortByDate(posts.slice(indexOfFirstPost, indexOfLastPost));

  return (
    <div className="section container">
      <div className="row">
        <div className="mx-auto lg:col-10">
          <div className="row">
            {currentPosts.map((post, i) => (
              <Post className="col-12 mb-6 sm:col-6" key={`key-${i}`} post={post} />
            ))}
          </div>
        </div>
      </div>
      <div className="mt-12">
        <Pagination totalPages={totalPages} currentPage={currentPage} />
      </div>
    </div>
  );
};

export default BlogPagination;

// get blog pagination slug
export const getStaticPaths = async () => {
  const res = await client.getEntries({ content_type: 'article' });
  const allPosts = res.items;

  const totalPages = Math.ceil(allPosts.length / pagination);
  let paths = [];

  for (let i = 1; i <= totalPages; i++) {
    paths.push({
      params: { slug: i.toString() }, // Ensure slug is a string
    });
  }

  return {
    paths,
    fallback: false,
  };
};

// get blog pagination content
export const getStaticProps = async ({ params }) => {
  const currentPage = parseInt(params.slug || '1');
  try {
    const res = await client.getEntries({ content_type: 'article' });

    if (!res.items.length) {
      console.log('No posts available for pagination.');
      return { notFound: true };
    }

    const posts = res.items.map((item) => ({
      title: item.fields.title,
      slug: item.fields.slug,
      publishedDate: item.fields.publishedDate,
      category: item.fields.categoryName,
      content: item.fields.body,
    }));

    return {
      props: {
        pagination,
        posts: JSON.parse(JSON.stringify(posts)),
        currentPage,
      },
    };
  } catch (error) {
    console.error('Error fetching posts for pagination:', error);
    return { props: { posts: [], currentPage } };
  }
};

