import React from "react";
import PostItem from "./PostItem";

const PostList = () => {
  // map over posts using arbitrary number of PostItem components
  // PostItem should be a card with a header, content, and footer
  // header should be the title
  // content should be the content
  return (
    <div>
      <div>PostList</div>
      <div>
        {Array.from({ length: 10 }, (_, i) => i + 1).map((i) => {
          return <PostItem key={i} />;
        })}
      </div>
    </div>
  );
};

export default PostList;
