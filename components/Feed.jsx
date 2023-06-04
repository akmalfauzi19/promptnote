"use client";

import { useState, useEffect } from "react";
import PromptCard from "./PromptCard";
import Loading from "./loading";

const PromptCardList = ({ data, handleTagClick }) => {
  return data.map((post) => (
    <PromptCard key={post._id} post={post} handleTagClick={handleTagClick} />
  ));
};

const Feed = () => {
  const [searchText, setSearchText] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    const response = await fetch("/api/prompt");
    const data = await response.json();

    setPosts(data);
    setLoading(false);
  };

  useEffect(() => {
    const fetchPromise = new Promise((resolve, reject) => {
      resolve(fetchPosts());
    });

    fetchPromise.then((value) => {
      if (searchText.length > 0) filterPost(searchText);
    });
  }, []);

  const filterPost = (data) => {
    const regex = new RegExp(data, "i");

    const resultFilter = posts.filter((val) => {
      return (
        regex.test(val.creator.username) ||
        regex.test(val.tag) ||
        regex.test(val.prompt)
      );
    });

    setPosts(resultFilter);
    setLoading(false);
  };

  const handleSearchChange = (e) => {
    setLoading(true);
    e.preventDefault();
    const { value } = e.target;

    setSearchText(value);

    if (value.length > 0) filterPost(value);
    else fetchPosts();
  };

  const handleTagClick = (tag) => {
    setLoading(true);
    setSearchText(tag);
    filterPost(tag);
  };

  return (
    <section className="feed">
      <form
        className="relative w-full flex-center"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          type="text"
          placeholder="Search for a tag or a username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>
      <div className="mt-16 prompt_layout">
        {loading ? (
          <Loading />
        ) : posts.length > 0 ? (
          <PromptCardList data={posts} handleTagClick={handleTagClick} />
        ) : (
          <p className="text-lg text-gray-600 text-center">Data not found</p>
        )}
      </div>
    </section>
  );
};

export default Feed;
