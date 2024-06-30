import config from "@config/config.json";
import { dateFormat } from "@lib/utils/dateFormat";
import Link from "next/link";
const { blog_folder } = config.settings;

const Post = ({ post, className }) => {
  // Safely access categories with optional chaining and default to an empty array if undefined
  const categories = post.frontmatter?.categories || [];
  const title = post.frontmatter?.title || "No title";
  const date = post.frontmatter?.date || "No date available";

  return (
    <div className={className}>
      <div className="card">
        <ul className="flex items-center space-x-4">
          {categories.length > 0 ? (
            categories.map((category, index) => (
              <li key={index}>
                <Link
                  className="text-primary"
                  href={`/categories/${category.toLowerCase()}`}
                >
                  {category}
                </Link>
              </li>
            ))
          ) : (
            <li>No categories</li>
          )}
        </ul>
        <p className="my-4">{dateFormat(date)}</p>
        <h2 className="h3 mb-2 font-normal">
          <Link href={`/${blog_folder}/${post.slug}`} className="block">
            {title}
          </Link>
        </h2>
        <Link
          className="btn-link mt-7 inline-flex items-center hover:text-primary"
          href={`/${blog_folder}/${post.slug}`}
        >
          Continue Reading
          {/* SVG omitted for brevity */}
        </Link>
      </div>
    </div>
  );
};

export default Post;
