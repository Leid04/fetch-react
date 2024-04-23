import { useEffect, useRef, useState } from "react";
import "./App.css";

interface Post {
  id: number;
  title: string;
}

const URL = "https://jsonplaceholder.typicode.com";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();
      setIsLoading(true);

      try {
        const response = await fetch(`${URL}/posts?page=${page}`, {
          signal: abortControllerRef.current?.signal,
        });
        const posts = (await response.json()) as Post[];
        setPosts(posts);
      } catch (er: any) {
        if (er.name === "AbortError") {
          console.log("aborted");
          return;
        }
        setError("Something went wrong");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [page]);

  if (error) {
    <div>Someting went wrong</div>;
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl">Data feching in react</h1>
      <button onClick={() => setPage(page + 1)}>Increase page {page}</button>
      {isLoading && <div>Loading...</div>}
      {!isLoading && (
        <ul>
          {posts.map((post) => {
            return <li key={post.id}>{post.title}</li>;
          })}
        </ul>
      )}
    </div>
  );
}

export default App;
