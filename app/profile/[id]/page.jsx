"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

import Profile from "@components/Profile";

const MyProfile = () => {
  const [posts, setPosts] = useState([]);
  const router = useRouter();
  const pathName = usePathname();
  const [name, setName] = useState("User");

  useEffect(() => {
    const id = pathName.split("/")[2];

    const fetchPosts = async () => {
      const response = await fetch(`/api/users/${id}/posts`);
      const data = await response.json();

      setPosts(data);
      if (data.length > 0) setName(data[0].creator.username);
    };

    if (id) fetchPosts();
  }, []);

  return (
    <Profile
      name={name}
      desc="welcome to your personalized profile page"
      data={posts}
    />
  );
};

export default MyProfile;
