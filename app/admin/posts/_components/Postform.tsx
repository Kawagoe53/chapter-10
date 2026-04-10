import TextInput from "@/app/_components/TextInput";
import { CategoriesIndexResponse, PostRequestBody } from "@/app/_types/Posts";
import { useForm } from "react-hook-form";

type Props = {
  mode: "new" | "edit";
  deleteHandleSubmit?: () => Promise<void>;
  onSubmit: (data: PostRequestBody) => Promise<void>;
  categories: CategoriesIndexResponse["categories"];
  defaultValues: PostRequestBody;
};

export const PostForm = ({
  onSubmit,
  categories,
  defaultValues,
  mode,
  deleteHandleSubmit,
}: Props) => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<PostRequestBody>({ defaultValues });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-6">
        <TextInput
          disabled={isSubmitting}
          label="タイトル"
          {...register("title", {
            required: "必須項目です",
            maxLength: { value: 30, message: "最大30文字です" },
          })}
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
                    const current = getValues("categories") ?? [];
                    if (e.target.checked) {
                      setValue("categories", [...current, { id: category.id }]);
                    } else {
                      setValue(
                        "categories",
                        current.filter((c) => c.id !== category.id),
                      );
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
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-200 text-white font-bold py-2 px-6 rounded self-end"
        >
          {mode == "new" ? "作成する" : "更新する"}
        </button>
        {mode == "edit" && (
          <button
            disabled={isSubmitting}
            onClick={deleteHandleSubmit}
            className="bg-red-500 hover:bg-red-200 text-white font-bold py-2 px-6 rounded self-end"
          >
            削除
          </button>
        )}
      </div>
    </form>
  );
};
