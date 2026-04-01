// #新規投稿作成画面 タスク詳細
// 1ページ・フォームUIの作成title・content・thumbnailUrl・categoriesの入力欄を用意
// 2DBからカテゴリ一覧を取得する
// 3フォームの状態管理入力値をstateで管理する
// 4作成APIの呼び出し作成ボタンを押したらPOSTリクエストを送る
// 5完了後の処理成功したら一覧ページへリダイレクト

"use client";

import { useEffect, useState } from "react";
import {
  CategoriesIndexResponse,
  CreatePostRequestBody,
} from "@/app/_types/Posts";
import { useRouter } from "next/navigation";

export default function CreateNewPost() {
  // カテゴリの一覧（オブジェクトの配列）が入ってくる
  const [categories, setCategories] = useState<
    CategoriesIndexResponse["categories"]
  >([]);

  // フォームの入力値（オブジェクト1つ）が入ってくる
  const [form, setForm] = useState<CreatePostRequestBody>({
    title: "",
    content: "",
    thumbnailUrl: "",
    categories: [],
  });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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
        console.log(e);
        setError("エラーが発生しました。");
      }
    };
    getCategories();
  }, []);

  const handleSubmit = async () => {
    try {
      //asyncの中でtry-catchする
      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        //失敗したら以下の処理
        setError("送信に失敗しました");
        return;
      }
      router.push("/admin/posts"); //成功したらリダイレクトする
    } catch (e) {
      console.log(e); //開発者用
      setError("エラーが発生しました"); //ユーザー用
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">記事作成</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <label className="font-bold text-gray-700">タイトル</label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            type="text"
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-bold text-gray-700">サムネイルURL</label>
          <input
            value={form.thumbnailUrl}
            onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })}
            type="text"
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-bold text-gray-700">本文</label>
          <textarea
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
                  type="checkbox"
                  id={`${category.id}`} //大規模開発だと`category-${category.id}`がいい
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

        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-200 text-white font-bold py-2 px-6 rounded self-end"
        >
          作成する
        </button>
      </div>
    </div>
  );
}
