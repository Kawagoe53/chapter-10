// //このページの役割：既存記事の内容を修正して、DBに上書き保存する画面
// #タスク詳細
// 1.既存データの取得・表示記事IDをもとに現在のtitle・content・categories・thumbnailUrlを
// 取得してフォームに初期表示
// 2.フォームUIの実装入力欄に既存データをセットして編集できる状態にする
// 3.更新APIの呼び出し編集内容をPUTリクエストで送信
// 4.完了後の処理成功したら一覧ページなどにリダイレクト;

"use client";

import {
  PostShowResponse,
  CategoriesIndexResponse,
  PostRequestBody,
} from "@/app/_types/Posts";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PostForm } from "../_components/Postform";

export default function FixAdminPost() {
  const { id } = useParams();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); //読み込み中の状態管理
  const router = useRouter();
  const [data, setData] = useState<PostRequestBody | null>(null);

  const [categories, setCategories] = useState<
    CategoriesIndexResponse["categories"]
  >([]);

  useEffect(() => {
    const fetcher = async () => {
      try {
        const res = await fetch(`/api/admin/posts/${id}`);
        if (!res.ok) {
          setError("取得に失敗しました");
          return;
        }
        const data: PostShowResponse = await res.json(); //これはAPIから受け取るデータの型
        setData({
          title: data.post.title,
          thumbnailUrl: data.post.thumbnailUrl,
          content: data.post.content,
          categories: data.post.postCategories.map((pc) => ({
            id: pc.category.id,
          })),
        });
      } catch (e) {
        console.error(e);
        setError("エラーが発生しました");
      } finally {
        setIsLoading(false);
      }
    };

    fetcher();
  }, [id]);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await fetch("/api/admin/categories");
        if (!res.ok) {
          setError("取得に失敗しました");
          return;
        }
        const data: CategoriesIndexResponse = await res.json();
        setCategories(data.categories);
      } catch (e) {
        console.error(e);
        setError("エラーが発生しました。");
      } finally {
        setIsLoading(false);
      }
    };
    getCategories();
  }, []);

  const updateHandleSubmit = async (data: PostRequestBody) => {
    try {
      const requestBody: PostRequestBody = {
        title: data.title,
        thumbnailUrl: data.thumbnailUrl,
        content: data.content,
        categories: data.categories, // ✅ そのまま使える
      };
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      if (!res.ok) {
        setError("更新を失敗しました");
        return;
      }
      alert("更新しました");
      router.push("/admin/posts"); //成功したらリダイレクトする
    } catch (e) {
      console.error(e); //開発者用
      setError("エラーが発生しました"); //ユーザー用
    }
  };

  const deleteHandleSubmit = async () => {
    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        setError("削除失敗しました");
        return;
      }
      alert("削除しました");
      router.push("/admin/posts"); //成功したらリダイレクトする
    } catch (e) {
      console.error(e); //開発者用
      setError("エラーが発生しました"); //ユーザー用
    }
  };

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
  if (!data) {
    return (
      <div className="max-w-3xl mx-auto p-8">
        <p>データがありません</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">記事編集</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <PostForm
        onSubmit={updateHandleSubmit}
        defaultValues={data}
        categories={categories}
        mode="edit"
        deleteHandleSubmit={deleteHandleSubmit}
      />
    </div>
  );
}
