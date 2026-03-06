"use client";

import { useForm } from "react-hook-form";

type ContactFormData = {
  email: string;
  message: string;
  name: string;
};

type ContactRequestBody = {
  email: string;
  message: string;
  name: string;
};

//ContactFormDataはフォームの型、ContactRequestBodyはAPIに送るデータの型と役割を分けることで、
// 将来バックエンドの仕様が変わった時にContactRequestBodyだけ修正すればいいようになる

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    //isSubmitting取り出すだけでtrue/false自動でしてくれる
    //このerrorsはバリデーション用
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    try {
      const requestBody: ContactRequestBody = {
        email: data.email,
        message: data.message,
        name: data.name,
        //型を明示的に定義
      };
      await fetch(
        //awaitはfetchの結果（サーバーからのレスポンス）が返ってくるまで次の行に進まずに待つ
        "https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/contacts",
        {
          method: "POST", //送信するモード
          headers: { "Content-Type": "application/json" }, //送り状,受け取り側への中身の説明
          body: JSON.stringify(requestBody),
          // 通信で送れるのは文字列だけ、なのでJSON.stringifyで文字列に変換する
          //dataとは何か
          // →react-hook-formのhandleSubmitが自動でフォームの入力値を集めてdataに入れて渡してくれる
        },
      );
      alert("送信しました");
      reset();
    } catch (error) {
      //try-catchの性質でcatchの引数にはエラー内容が自動的に入る
      console.error(error);
      alert("送信に失敗しました");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-medium text-gray-900 mb-8">問い合わせ</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* form onSubmit→送信ボタンが押された時に実行する処理を登録する場所」 */}
          {/* handleSubmit → react-hook-formが用意した関数 
          onSubmit →自分で定義した関数 */}

          {/* 名前 */}
          <div>
            <label htmlFor="name" className="block text-sm text-gray-600 mb-1">
              名前
            </label>
            <input
              id="name"
              type="text"
              disabled={isSubmitting}
              {...register("name", {
                required: "入力必須",
                maxLength: { value: 30, message: "最大30文字です" },
              })}
              className="w-full border border-gray-200 rounded px-3 py-2 text-gray-900 focus:outline-none focus:border-gray-400 transition-colors"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>
            )}
          </div>
          {/* メールアドレス */}
          <div>
            <label htmlFor="email" className="block text-sm text-gray-600 mb-1">
              メールアドレス
            </label>
            <input
              id="email"
              type="email"
              disabled={isSubmitting}
              {...register("email", {
                required: "入力必須",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "正しいメールアドレスを入力してください",
                },
              })}
              className="w-full border border-gray-200 rounded px-3 py-2 text-gray-900 focus:outline-none focus:border-gray-400 transition-colors"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>
          {/* 本文 */}
          <div>
            <label
              htmlFor="message"
              className="block text-sm text-gray-600 mb-1"
            >
              本文
            </label>
            <input
              id="message"
              type="text"
              disabled={isSubmitting}
              {...register("message", {
                required: "入力必須",
                maxLength: { value: 500, message: "最大500文字です" },
              })}
              className="w-full border border-gray-200 rounded px-3 py-2 text-gray-900 focus:outline-none focus:border-gray-400 transition-colors"
            />
            {errors.message && (
              <p className="mt-1 text-xs text-red-400">
                {errors.message.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gray-900 text-white text-sm py-2.5 rounded hover:bg-gray-700 transition-colors"
          >
            送信
          </button>
        </form>
      </div>
    </div>
  );
}
