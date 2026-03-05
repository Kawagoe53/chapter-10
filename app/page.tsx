"use client";

import Link from "next/link";
import Image from "next/image";
import { formatDate } from "../app/_utils/formatDate";
import { useState } from "react";
import { useEffect } from "react";
import type { Post } from "../app/_types/post";

export default function Posts() {
  const [posts, setPosts] = useState<Post[]>([]); //データの保持するためにpostsという空箱を用意する
  const [error, setError] = useState<string | null>(null); //最初はエラーないからnull
  const [isLoading, setIsLoading] = useState<boolean>(true); //読み込み中の状態管理

  useEffect(() => {
    const fetcher = async () => {
      // useEffectに直接asyncをつけるとPromiseが返ってきてしまうため、
      // 中にasync関数を定義して呼び出す
      try {
        //tryの中でうまくいかなかったらcatchの処理に映る
        const res = await fetch(
          //情報を取得(まだ封筒状態で中身は見えない)
          "https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/posts",
        );
        const data = await res.json(); //resをjsオブジェクトに変換
        console.log(data.posts[0].thumbnailUrl);
        setPosts(data.posts); //dataをpostsに入れてデータを保持する。
      } catch (e) {
        //eにはエラー情報が入っている、
        console.log(e); //開発者様のエラー表示
        setError("エラーが発生しました"); //ユーザー用のエラー表示
      } finally {
        setIsLoading(false);
      }
    };

    fetcher(); //関数を実行
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
            src={post.thumbnailUrl}
            className="w-fit h-30 shrink-0 object-cover m-3"
            alt="記事の画像です"
          />
          <div className="text-black">
            <p>
              {formatDate(post.createdAt)},{post.categories}
            </p>
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
