"use client";

import Link from "next/link";
import Image from "next/image";
import { formatDate } from "../app/_utils/formatDate";
import { useState } from "react";
import { useEffect } from "react";
import { MicroCmsPost } from "./_types/MicroCmsPost";

export default function Posts() {
  const [posts, setPosts] = useState<MicroCmsPost[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetcher = async () => {
      try {
        const res = await fetch("https://xnbhacnf5s.microcms.io/api/v1/posts", {
          //管理画面で取得したエンドポイントを入力してください
          headers: {
            //fetch関数の第二引数にheadersを設定でき、その中にAPIキーを設定します。
            "X-MICROCMS-API-KEY": process.env
              .NEXT_PUBLIC_MICROCMS_API_KEY as string, // 管理画面で取得したAPIキーを入力してください。
          },
        });
        const { contents } = await res.json();
        setPosts(contents);
      } catch (e) {
        console.log(e);
        setError("エラーが発生しました");
      } finally {
        setIsLoading(false);
      }
    };
    fetcher();
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto p-8">
        <p>ローディング中...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="max-w-3xl mx-auto bg-white p-8">
        <p className="text-red-600">{error}</p>
        <Link href="/" className="text-blue-600">
          一覧へ戻る
        </Link>
      </div>
    );
  }
  return (
    <div className="bg-white min-h-screen min-w-screen">
      <h1 className="text-black flex justify-center text-5xl">記事一覧</h1>

      {posts.map((post) => (
        <Link
          href={`/posts/${post.id}`}
          key={post.id}
          className="grid grid-cols-[200px_1fr] gap-4 border-b border-[#e5e7eb] max-w-3xl mx-auto"
        >
          <Image
            height={116}
            width={157}
            src={post.thumbnail.url}
            className="w-fit h-30 shrink-0 object-cover m-3"
            alt="thumbnail"
          />
          <div className="text-black">
            <p>{formatDate(post.createdAt)},[categories]</p>
            <p className="font-bold">{post.title}</p>
            <p
              className="text-sm text-gray-700 overflow-hidden line-clamp-2"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </Link>
      ))}
    </div>
  );
}
