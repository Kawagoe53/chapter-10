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
  UpdatePostRequestBody,
} from "@/app/_types/Posts";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function FixAdminPost() {
  const { id } = useParams();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); //読み込み中の状態管理
  const router = useRouter();
  const [form, setForm] = useState<UpdatePostRequestBody>({
    //これはAPIに送るデータの型
    title: "",
    content: "",
    thumbnailUrl: "",
    categories: [],
  });

  const [categories, setCategories] = useState<
    CategoriesIndexResponse["categories"]
  >([]);

  useEffect(() => {
    setIsLoading(true);
    const fetcher = async () => {
      try {
        const res = await fetch(`/api/admin/posts/${id}`);
        if (!res.ok) {
          setError("取得に失敗しました");
          return;
        }
        const data: PostShowResponse = await res.json(); //これはAPIから受け取るデータの型
        setForm({
          //UpdatePostRequestBodyはAPIに送るデータの型
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
    setIsLoading(true);
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

  const updateHandleSubmit = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        setError("更新を失敗しました");
        return;
      }
      router.push("/admin/posts"); //成功したらリダイレクトする
    } catch (e) {
      console.error(e); //開発者用
      setError("エラーが発生しました"); //ユーザー用
    } finally {
      setIsLoading(false);
    }
  };

  const deleteHandleSubmit = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        setError("削除失敗しました");
        return;
      }
      router.push("/admin/posts"); //成功したらリダイレクトする
    } catch (e) {
      console.error(e); //開発者用
      setError("エラーが発生しました"); //ユーザー用
    } finally {
      setIsLoading(false);
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

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">記事編集</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <label className="font-bold text-gray-700">タイトル</label>
          <input
            disabled={isLoading}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            type="text"
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-bold text-gray-700">サムネイルURL</label>
          <input
            disabled={isLoading}
            value={form.thumbnailUrl}
            onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })}
            type="text"
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-bold text-gray-700">本文</label>
          <textarea
            disabled={isLoading}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="border border-gray-300 rounded px-3 py-2 h-48 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-bold text-gray-700">カテゴリー</label>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center gap-1">
                <input
                  disabled={isLoading}
                  id={`${category.id}`} //htmlForと繋げることで文字を押してもチェックが入る
                  type="checkbox"
                  checked={form.categories.some((c) => c.id === category.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setForm({
                        ...form,
                        categories: [...form.categories, { id: category.id }],
                      });
                    } else {
                      setForm({
                        ...form,
                        categories: form.categories.filter(
                          (c) => c.id !== category.id,
                        ),
                      });
                    }
                  }}
                />
                <label htmlFor={`${category.id}`} className="text-gray-700">
                  {category.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <button
            disabled={isLoading}
            onClick={updateHandleSubmit}
            className="bg-green-500 hover:bg-green-200 text-white font-bold py-2 px-6 rounded self-end"
          >
            更新
          </button>

          <button
            disabled={isLoading}
            onClick={deleteHandleSubmit}
            className="bg-red-500 hover:bg-red-200 text-white font-bold py-2 px-6 rounded self-end"
          >
            削除
          </button>
        </div>
      </div>
    </div>
  );
}
