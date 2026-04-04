// #新規投稿作成画面 タスク詳細
// 1ページ・フォームUIの作成title・content・thumbnailUrl・categoriesの入力欄を用意
// 2DBからカテゴリ一覧を取得する
// 3フォームの状態管理入力値をstateで管理する
// 4作成APIの呼び出し作成ボタンを押したらPOSTリクエストを送る
// 5完了後の処理成功したら一覧ページへリダイレクト

"use client";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import {
  CategoriesIndexResponse,
  CreatePostRequestBody,
} from "@/app/_types/Posts";
import { useRouter } from "next/navigation";
import TextInput from "@/app/_components/TextInput";

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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    //isSubmitting取り出すだけでtrue/false自動でしてくれる
    //このerrorsはバリデーション用
  } = useForm<CreatePostRequestBody>();

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
        console.error(e);
        setError("エラーが発生しました。");
      }
    };
    getCategories();
  }, []);

  const onSubmit = async (data: CreatePostRequestBody) => {
    try {
      const requestBody: CreatePostRequestBody = {
        title: data.title,
        content: data.content,
        thumbnailUrl: data.thumbnailUrl,
        categories: form.categories,
      };
      //asyncの中でtry-catchする
      await fetch("/api/admin/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      router.push("/admin/posts"); //成功したらリダイレクトする
    } catch (e) {
      console.error(e); //開発者用
      setError("送信に失敗しました"); //ユーザー用
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">記事作成</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6">
          <TextInput
            disabled={isSubmitting}
            {...register("title", {
              required: "必須項目です",
              maxLength: { value: 30, message: "最大30文字です" },
            })}
            label="タイトル"
          />
          {errors.title && (
            <p className="mt-1 text-xs text-red-400">{errors.title.message}</p>
          )}

          <div className="flex flex-col gap-1">
            <label className="font-bold text-gray-700">サムネイルURL</label>
            <input
              {...register("thumbnailUrl", {
                required: "必須項目です",
                maxLength: { value: 30, message: "最大30文字です" },
              })}
              disabled={isSubmitting}
              type="text"
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.thumbnailUrl && (
              <p className="mt-1 text-xs text-red-400">
                {errors.thumbnailUrl.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold text-gray-700">本文</label>
            <textarea
              disabled={isSubmitting}
              id="content"
              {...register("content", {
                required: "必須項目です",
                minLength: {
                  value: 8,
                  message: "8文字以上で入力してください",
                },
                maxLength: {
                  value: 50,
                  message: "50文字以内で入力してください",
                },
              })}
              className="border border-gray-300 rounded px-3 py-2 h-48 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.content && (
              <p className="mt-1 text-xs text-red-400">
                {errors.content.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-bold text-gray-700">カテゴリー</label>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center gap-1">
                  <input
                    disabled={isSubmitting}
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
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-200 text-white font-bold py-2 px-6 rounded self-end"
          >
            作成する
          </button>
        </div>
      </form>
    </div>
  );
}
