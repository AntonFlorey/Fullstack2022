import PropTypes from "prop-types"

const Blog = ({ blog, toggleDetails, likeBlog, deleteBlog, loggedInUser }) => {
  if (blog.details) {
    return (
      <div className="blog">
        {blog.title} by {blog.author} <button type="button" onClick={toggleDetails}>details</button> <br/>
        <div className="blogDetails">
          url: {blog.url} <br/>
          likes: {blog.likes} <button className="likeButton" type="button" onClick={likeBlog}>like</button> <br/>
          author: {blog.user.name} <br/>
        </div>
        {(loggedInUser === blog.user.username) && <button className="deleteButton" type="button" onClick={deleteBlog}>delete</button>}
      </div>
    )
  }
  return (
    <div className="blog">
      {blog.title} by {blog.author} <button className="detailButton" type="button" onClick={toggleDetails}>details</button>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  toggleDetails: PropTypes.func.isRequired,
  likeBlog: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  loggedInUser: PropTypes.string.isRequired
}

export default Blog