import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../store/slices/postsSlice";

export default function Posts() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.posts);

  useEffect(() => {
    dispatch(fetchPosts(10));
  }, [dispatch]);

  return (
    <div>
      <h2>Posts</h2>

      {status === "loading" && <p>Loading...</p>}
      {status === "failed" && <p className="error">{error}</p>}

      <ul className="posts">
        {items.map((post) => (
          <li key={post.id} className="card">
            <h3>{post.title}</h3>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
