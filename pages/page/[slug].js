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
      para
