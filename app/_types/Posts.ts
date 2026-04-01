export type Post = {
  id: number;
  title: string;
  content: string;
  thumbnailUrl: string;
  createdAt: Date;
  updatedAt: Date;
  postCategories: {
    category: {
      id: number;
      name: string;
    };
  }[];
}; //Post 型を一箇所で管理できて、変更があったときも1箇所直すだけでOK

export type PostsIndexResponse = {
  posts: Post[];
};

export type PostShowResponse = {
  post: Post;
};

export type CategoriesIndexResponse = {
  categories: {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
};

export type CreatePostRequestBody = {
  title: string;
  content: string;
  categories: { id: number }[];
  thumbnailUrl: string;
};

export type CreatePostResponse = {
  id: number;
};

export type PostIndexResponse = {
  posts: {
    id: number;
    title: string;
    content: string;
    thumbnailUrl: string;
    createdAt: Date;
    updatedAt: Date;
    postCategories: {
      category: {
        id: number;
        name: string;
      };
    }[];
  }[];
};

export type UpdatePostRequestBody = {
  title: string;
  content: string;
  categories: { id: number }[];
  thumbnailUrl: string;
};

export type CreateCategoryRequestBody = {
  name: string;
};

export type UpdateCategoryRequestBody = {
  name: string;
};

export type CategoryShowResponse = {
  category: {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  };
};
