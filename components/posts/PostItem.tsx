import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Toggle } from "../ui/toggle";

const PostItem = () => {
  return (
    <Card className="m-4 ">
      <CardHeader>title</CardHeader>
      <CardContent>content</CardContent>
      <CardFooter>
        <div>
          <Toggle>Like</Toggle>
        </div>
        <div>username</div>
        <div>walletId</div>
      </CardFooter>
    </Card>
  );
};

export default PostItem;
